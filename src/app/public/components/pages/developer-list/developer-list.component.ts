import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { forkJoin } from 'rxjs';
import { NotificationService } from 'src/app/core/services/notification.service';
import { DeveloperService } from 'src/app/core/services/developer.service';
import { getDeveloper } from 'src/app/core/models/developer';

@Component({
  selector: 'app-developer-list',
  templateUrl: './developer-list.component.html',
  styleUrls: ['./developer-list.component.scss']
})
export class DeveloperListComponent implements OnInit {
  @ViewChild('dt') dt: Table | undefined;
  
  developers: getDeveloper[] = [];
  selectedDevelopers: getDeveloper[] = [];
  developer: getDeveloper = {} as getDeveloper;

  showAddEditDialog = false;
  currentDeveloperId?: number;

  deleteDeveloperDialog: boolean = false;
  deleteDevelopersDialog: boolean = false;

  submitted: boolean = false;
  loading: boolean = false;

  constructor(
    private developerService: DeveloperService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.loadDevelopers();
  }

  loadDevelopers(): void {
    this.loading = true;
    this.developerService.getAllDevelopers().subscribe({
      next: (developers: getDeveloper[]) => {
        this.developers = developers;
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.showErrorCustom('Failed to load developers');
        this.loading = false;
      }
    });
  }

  onGlobalFilter(table: Table, event: Event): void {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew(): void {
    this.currentDeveloperId = undefined;
    this.showAddEditDialog = true;
  }

  editDeveloper(developer: getDeveloper): void {
    this.developer = { ...developer };
    this.currentDeveloperId = developer.id;
    this.showAddEditDialog = true;
  }

  onDeveloperSaved(): void {
    this.showAddEditDialog = false;
    this.loadDevelopers();
  }
}