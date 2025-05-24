import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { forkJoin } from 'rxjs';
import { NotificationService } from 'src/app/core/services/notification.service';
import { DeveloperService } from 'src/app/core/services/developer.service';
import { getDeveloper } from 'src/app/core/models/developer';
import { RatingService } from 'src/app/core/services/rating.service';
import { PublicProfileResponse } from 'src/app/core/models/ratings';

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
  showRatingDialog = false;
  currentDeveloperId?: number;

  deleteDeveloperDialog: boolean = false;
  deleteDevelopersDialog: boolean = false;

  submitted: boolean = false;
  loading: boolean = false;
  ratingLoading: boolean = false;

  developerRatings: PublicProfileResponse | null = null;

  constructor(
    private developerService: DeveloperService,
    private notificationService: NotificationService,
    private ratingService: RatingService
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

  viewRatings(developerId: number): void {
    this.currentDeveloperId = developerId;
    this.ratingLoading = true;
    this.showRatingDialog = true;
    
    this.ratingService.getPublicProfile(developerId).subscribe({
      next: (response: PublicProfileResponse) => {
        this.developerRatings = response;
        this.ratingLoading = false;
      },
      error: (error) => {
        this.notificationService.showErrorCustom('Failed to load ratings');
        this.ratingLoading = false;
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