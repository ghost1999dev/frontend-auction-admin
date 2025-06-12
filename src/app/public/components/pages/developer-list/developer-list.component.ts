import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { forkJoin } from 'rxjs';
import { NotificationService } from 'src/app/core/services/notification.service';
import { DeveloperService } from 'src/app/core/services/developer.service';
import { getDeveloper } from 'src/app/core/models/developer';
import { RatingService } from 'src/app/core/services/rating.service';
import { PublicProfileResponse } from 'src/app/core/models/ratings';
import { LayoutService } from 'src/app/core/services/layout.service';

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

  developerRatings: any | null = null;
  chartData: any;
  chartOptions: any;

  constructor(
    private developerService: DeveloperService,
    private notificationService: NotificationService,
    private ratingService: RatingService,
    public layoutService: LayoutService
  ) { }

  ngOnInit(): void {
      this.loadDevelopers();
      this.initializeChartOptions();
      
      // Escuchar cambios de tema
      this.layoutService.configUpdate$.subscribe(() => {
          this.initializeChartOptions();
          if (this.developerRatings) {
              this.updateChartData();
          }
      });
  }

  initializeChartOptions(): void {
    const isDark = this.layoutService.config.colorScheme === 'dark';
    
    const textColor = isDark ? '#e0e0e0' : '#495057';
    const surfaceBorder = isDark ? '#4a4a4a' : '#dfe7ef';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

    this.chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false // Ocultamos la leyenda ya que solo tenemos un dataset
            },
            tooltip: {
                backgroundColor: isDark ? '#3e4858' : '#ffffff',
                titleColor: textColor,
                bodyColor: textColor,
                borderColor: surfaceBorder,
                borderWidth: 1,
                padding: 10,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColor,
                    font: {
                        weight: 500
                    }
                },
                grid: {
                    color: gridColor,
                    drawBorder: false
                }
            },
            y: {
                ticks: {
                    color: textColor,
                    font: {
                        weight: 500
                    },
                    stepSize: 1,
                    precision: 0
                },
                grid: {
                    color: gridColor,
                    drawBorder: false
                },
                beginAtZero: true
            }
        },
        animation: {
            duration: 1000,
            easing: 'easeOutQuart'
        }
    };
}
updateChartData(): void {
    if (!this.developerRatings) {
        this.developerRatings = this.getDefaultRatings();
    }

    const distribution = this.developerRatings.ratingSummary.scoreDistribution;
    const isDark = this.layoutService.config.colorScheme === 'dark';

    this.chartData = {
        labels: ['1 estrella', '2 estrellas', '3 estrellas', '4 estrellas', '5 estrellas'],
        datasets: [{
            label: 'Distribución de Ratings',
            backgroundColor: isDark ? [
                'rgba(110, 142, 251, 0.7)', // 1 estrella
                'rgba(110, 142, 251, 0.8)', // 2 estrellas
                'rgba(110, 142, 251, 0.9)', // 3 estrellas
                'rgba(110, 142, 251, 1.0)', // 4 estrellas
                'rgba(167, 119, 227, 1.0)'  // 5 estrellas (color diferente)
            ] : [
                'rgba(66, 165, 245, 0.7)',
                'rgba(66, 165, 245, 0.8)',
                'rgba(66, 165, 245, 0.9)',
                'rgba(66, 165, 245, 1.0)',
                'rgba(126, 87, 194, 1.0)'
            ],
            borderColor: isDark ? '#4a4a4a' : '#dfe7ef',
            borderWidth: 1,
            borderRadius: 6,
            hoverBackgroundColor: isDark ? [
                'rgba(110, 142, 251, 0.9)',
                'rgba(110, 142, 251, 1.0)',
                'rgba(110, 142, 251, 1.1)',
                'rgba(110, 142, 251, 1.2)',
                'rgba(167, 119, 227, 1.2)'
            ] : [
                'rgba(66, 165, 245, 0.9)',
                'rgba(66, 165, 245, 1.0)',
                'rgba(66, 165, 245, 1.1)',
                'rgba(66, 165, 245, 1.2)',
                'rgba(126, 87, 194, 1.2)'
            ],
            data: [
                distribution['1'] || 0,
                distribution['2'] || 0,
                distribution['3'] || 0,
                distribution['4'] || 0,
                distribution['5'] || 0
            ]
        }]
    };
}

viewRatings(developerId: number): void {
    this.currentDeveloperId = developerId;
    this.ratingLoading = true;
    this.showRatingDialog = true;
    
    this.ratingService.getAverageRatingByDeveloper(developerId).subscribe({
        next: (response: any) => {
            this.developerRatings = {
                ratingSummary: {
                    averageScore: response?.averageScore || 0,
                    totalRatings: response?.totalRatings || 0,
                    scoreDistribution: this.calculateScoreDistribution(response.ratings || [])
                },
                recentRatings: (response.ratings || []).map((rating: any) => ({
                    score: rating.score,
                    comment: rating.comment,
                    createdAt: rating.createdAt,
                    userName: rating.author_name || 'Usuario anónimo'
                }))
            };
            
            // Forzar la actualización del tema
            setTimeout(() => {
                this.updateChartData();
                this.initializeChartOptions();
                this.ratingLoading = false;
            }, 0);
        },
        error: () => {
            this.ratingLoading = false;
            this.developerRatings = this.getDefaultRatings();
            this.updateChartData();
        }
    });
}
getRandomColor(): string {
    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', 
        '#98D8C8', '#F06292', '#7986CB', '#9575CD'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

private calculateScoreDistribution(ratings: any[]): any {
    const distribution = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };
    ratings.forEach(rating => {
        const score = Math.round(rating.score);
        distribution[score.toString() as keyof typeof distribution]++;
    });
    return distribution;
}

private getDefaultRatings(): any {
    return {
        ratingSummary: {
            averageScore: 0,
            totalRatings: 0,
            scoreDistribution: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 }
        },
        recentRatings: []
    };
}

  loadDevelopers(): void {
    this.loading = true;
    this.developerService.getAllDevelopers().subscribe({
      next: (developers: getDeveloper[]) => {
        this.developers = developers;
        this.loading = false;
      },
      error: () => {
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