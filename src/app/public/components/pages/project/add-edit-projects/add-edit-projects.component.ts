import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProjectStatusUpdate } from 'src/app/core/models/admin';
import { Company, Category } from 'src/app/core/models/projects';
import { AdminService } from 'src/app/core/services/admin.service';
import { CategoryService } from 'src/app/core/services/categories.service';
import { CompaniesService } from 'src/app/core/services/companies.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { ProjectsService } from 'src/app/core/services/projects.service';

@Component({
  selector: 'app-add-edit-projects',

  templateUrl: './add-edit-projects.component.html',
  styleUrl: './add-edit-projects.component.scss'
})
export class AddEditProjectsComponent {
  @Input() projectId?: number;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  projectForm: FormGroup;
  loading = false;
  submitted = false;

  companies: Company[] = [];
  categories: Category[] = [];
  
  statusOptions = [
    { label: 'Pendiente', value: 0 },
    { label: 'Activo', value: 1 },
    { label: 'Inactivo', value: 2 },
    { label: 'Rechazado', value: 3 },
    { label: 'Completado', value: 4 }
  ];

  constructor(
    private fb: FormBuilder,
    private projectsService: ProjectsService,
    private companiesService: CompaniesService,
    private categoriesServices: CategoryService,
    private adminServices: AdminService,
    private notificationService: NotificationService,
  ) {
    this.projectForm = this.fb.group({
      project_name: ['', Validators.required],
      description: [''],
      company_id: ['', Validators.required],
      category_id: ['', Validators.required],
      budget: [null],
      days_available: [null],
      status: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCompanies();
    this.loadCategories();

    if (this.projectId) {
      this.loadProject(this.projectId);
    }
  }

loadCompanies(): void {
  this.companiesService.getAllCompanies().subscribe({
    next: (companies: any[]) => {
      // Mapeamos las compañías para adaptar la estructura que necesitamos
      this.companies = companies.map(company => ({
        id: company.id,          // Tomamos el id del objeto company
        name: company.user.name  // Tomamos el name del objeto user dentro de company
        // Puedes incluir otros campos si los necesitas
      }));
    },
    error: (error) => {
      this.notificationService.showErrorCustom('Error al cargar las empresas');
    }
  });
}

  loadCategories(): void {
    this.categoriesServices.getAllCategories().subscribe({
      next: (categories: any) => {
        this.categories = categories;
      },
      error: (error) => {
        this.notificationService.showErrorCustom('Error al cargar las categorías');
      }
    });
  }

  loadProject(id: number): void {
    this.loading = true;
    this.projectsService.getProjectById(id).subscribe({
      next: (project) => {
        this.projectForm.patchValue({
          project_name: project.project_name,
          description: project.description,
          company_id: project.company_id,
          category_id: project.category_id,
          budget: project.budget,
          days_available: project.days_available,
          status: project.status
        });
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.showErrorCustom(error.error?.message || 'No se pudo cargar el proyecto');
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.projectForm.invalid) {
      return;
    }

    this.loading = true;
    const formData = this.projectForm.value;

    if (this.projectId) {
      // Update project
      this.projectsService.updateProject(this.projectId, formData).subscribe({
        next: () => {
          
          const newStatus: number = this.projectForm.value.status;
          const statusUpdate: ProjectStatusUpdate = { newStatus };
              
          this.adminServices.updateProjectStatus(this.projectId, statusUpdate).subscribe({
            next: () => {
              this.notificationService.showSuccessCustom('Proyecto actualizado exitosamente');
              this.saved.emit();
            },
            error: (error) => {
            this.notificationService.showErrorCustom(error.error?.message || 'No se pudo actualizar el proyecto');
            }
          });
        },
        error: (error) => {
          console.error(error)
        },
        complete: () => {
          this.loading = false;
        }
      });
    } else {
      // Create project
      this.projectsService.createProject(formData).subscribe({
        next: () => {
          this.notificationService.showSuccessCustom('Proyecto creado exitosamente');
          this.saved.emit();
        },
        error: (error) => {
          this.notificationService.showErrorCustom(error.error?.message || 'No se pudo crear el proyecto');
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  get f() { return this.projectForm.controls; }
}
