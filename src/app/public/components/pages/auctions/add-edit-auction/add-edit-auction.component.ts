import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Project } from 'src/app/core/models/projects';
import { NotificationService } from 'src/app/core/services/notification.service';
import { AuctionService } from 'src/app/core/services/auction.service';
import { ProjectsService } from 'src/app/core/services/projects.service';

@Component({
  selector: 'app-add-edit-auction',
  templateUrl: './add-edit-auction.component.html',
  styleUrls: ['./add-edit-auction.component.scss'],
})
export class AddEditAuctionComponent implements OnInit {
  @Input() auctionId?: number | any;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  auctionForm: FormGroup;
  loading = false;
  submitted = false;
  projects: Project[] = [];
  minStartDate: Date = new Date();
  maxStartDate: Date = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
  minDeadlineDate: Date = new Date();

  statuses = [
    { label: 'Pendiente', value: "0" },
    { label: 'Activa', value: "1" },
    { label: 'Completada', value: "2" },
    { label: 'Cancelada', value: "3" }
  ];

  constructor(
    private fb: FormBuilder,
    private auctionService: AuctionService,
    private projectService: ProjectsService,
    private notificationService: NotificationService,
  ) {
    this.auctionForm = this.fb.group({
      project_id: ['', Validators.required],
      bidding_started_at_date: [null, Validators.required],
      bidding_started_at_time: ['00:00', Validators.required],
      bidding_deadline_date: [null, Validators.required],
      bidding_deadline_time: ['00:00', Validators.required],
      status: [0]
    })
  }

  ngOnInit(): void {
    this.loadProjects();
    
    if (this.auctionId) {
      this.loadAuction(this.auctionId);
    }

    // Escuchar cambios en la fecha de inicio para actualizar la fecha mínima del deadline
    this.auctionForm.get('bidding_started_at_date')?.valueChanges.subscribe(() => {
      this.onStartDateChange();
    });
  }

  loadProjects(): void {
    this.projectService.getAllProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
      },
      error: (error) => {
        this.notificationService.showErrorCustom('Error al cargar los proyectos');
      }
    });
  }

  loadAuction(id: number): void {
    this.loading = true;
    this.auctionService.getAuctionById(id)
    .subscribe({
      next: (auction: any) => {
        const startDate = new Date(auction.bidding_started_at);
        const deadlineDate = new Date(auction.bidding_deadline);
        
        // Formatear fechas y horas para los inputs
        const startDateStr = startDate.toISOString().split('T')[0];
        const startTimeStr = this.formatTime(startDate);
        const deadlineDateStr = deadlineDate.toISOString().split('T')[0];
        const deadlineTimeStr = this.formatTime(deadlineDate);
        
        this.auctionForm.patchValue({
          project_id: auction.project_id,
          bidding_started_at_date: startDateStr,
          bidding_started_at_time: startTimeStr,
          bidding_deadline_date: deadlineDateStr,
          bidding_deadline_time: deadlineTimeStr,
          status: auction.status
        });
        
        // Actualizar la fecha mínima para el deadline
        this.minDeadlineDate = startDate;
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.showErrorCustom('Error al cargar la subasta');
        this.loading = false;
      }
    });
  }

  private formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.auctionForm.invalid) {
      return;
    }

    this.loading = true;
    const formData = this.auctionForm.value;

    // Combinar fecha y hora para bidding_started_at
    if (formData.bidding_started_at_date && formData.bidding_started_at_time) {
      formData.bidding_started_at = this.combineDateTimeToISO(
        formData.bidding_started_at_date, 
        formData.bidding_started_at_time
      );
    }

    // Combinar fecha y hora para bidding_deadline
    if (formData.bidding_deadline_date && formData.bidding_deadline_time) {
      formData.bidding_deadline = this.combineDateTimeToISO(
        formData.bidding_deadline_date, 
        formData.bidding_deadline_time
      );
    }

    console.log('Datos a enviar:', {
      ...formData,
      bidding_started_at: formData.bidding_started_at,
      bidding_deadline: formData.bidding_deadline
    });

    // Eliminar los campos temporales que ya no necesitamos
    delete formData.bidding_started_at_date;
    delete formData.bidding_started_at_time;
    delete formData.bidding_deadline_date;
    delete formData.bidding_deadline_time;


    if (this.auctionId) {

      // Update auction
      this.auctionService.updateAuction(this.auctionId, formData).subscribe({
        next: () => {
          this.notificationService.showSuccessCustom('Subasta actualizada exitosamente');
          this.saved.emit();
        },
        error: (error) => {
          this.notificationService.showErrorCustom(error.error?.message || 'Error al actualizar la subasta');
          this.loading = false;
        }
      });
    } else {
      // Create auction
      this.auctionService.createAuction(formData).subscribe({
        next: () => {
          this.notificationService.showSuccessCustom('Subasta creada exitosamente');
          this.saved.emit();
        },
        error: (error) => {
          this.notificationService.showErrorCustom(error.error?.message || 'Error al crear la subasta');
          this.loading = false;
        }
      });
    }
  }

  // Cambia la definición del validador a:


private combineDateTimeToISO(dateStr: string, timeStr: string): string {
  const [hours, minutes] = timeStr.split(':');
  return `${dateStr}T${hours}:${minutes}:00.000Z`;
}

  onStartDateChange(): void {
    const startDate = this.auctionForm.get('bidding_started_at_date')?.value;
    if (startDate) {
      this.minDeadlineDate = new Date(startDate);
      
      // Si el deadline actual es anterior a la nueva fecha de inicio, lo reseteamos
      const currentDeadlineDate = this.auctionForm.get('bidding_deadline_date')?.value;
      if (currentDeadlineDate && currentDeadlineDate <= startDate) {
        this.auctionForm.get('bidding_deadline_date')?.setValue(null);
      }
    }
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  get f() { return this.auctionForm.controls; }
}