import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { forkJoin } from 'rxjs';
import { NotificationService } from 'src/app/core/services/notification.service';
import { CompaniesService } from 'src/app/core/services/companies.service';
import { companies } from 'src/app/core/models/companies';
import { RatingService } from 'src/app/core/services/rating.service';
import { PublicProfileResponse } from 'src/app/core/models/ratings';
import { LayoutService } from 'src/app/core/services/layout.service';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent implements OnInit {
  @ViewChild('dt') dt: Table | undefined;
  
  companies: companies[] = [];
  selectedCompanies: companies[] = [];
  company: companies = {} as companies;

  showAddEditDialog = false;
  showRatingDialog = false;
  currentCompanyId?: number;

  deleteCompanyDialog: boolean = false;
  deleteCompaniesDialog: boolean = false;

  submitted: boolean = false;
  loading: boolean = false;
  ratingLoading: boolean = false;

  companyRatings: any | null = null;
  chartData: any;
  chartOptions: any;

  constructor(
    private companiesService: CompaniesService,
    private notificationService: NotificationService,
    private ratingService: RatingService,
    public layoutService: LayoutService
  ) { }

  ngOnInit(): void {
    this.loadCompanies();
    this.initializeChartOptions();
      
    // Escuchar cambios de tema
    this.layoutService.configUpdate$.subscribe(() => {
        this.initializeChartOptions();
        if (this.companyRatings) {
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
                display: false
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
    if (!this.companyRatings) {
        this.companyRatings = this.getDefaultRatings();
    }

    const distribution = this.companyRatings.ratingSummary?.scoreDistribution || { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };
    const isDark = this.layoutService.config.colorScheme === 'dark';

    this.chartData = {
        labels: ['1 estrella', '2 estrellas', '3 estrellas', '4 estrellas', '5 estrellas'],
        datasets: [{
            label: 'Distribución de Ratings',
            backgroundColor: isDark ? [
                'rgba(110, 142, 251, 0.7)',
                'rgba(110, 142, 251, 0.8)',
                'rgba(110, 142, 251, 0.9)',
                'rgba(110, 142, 251, 1.0)',
                'rgba(167, 119, 227, 1.0)'
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

  viewRatings(companyId: number): void {
    this.currentCompanyId = companyId;
    this.ratingLoading = true;
    this.showRatingDialog = true;
    
    this.ratingService.getPublicProfile(companyId).subscribe({
        next: (response: any) => {
            this.companyRatings = {
                ratingSummary: {
                    averageScore: response.ratingSummary?.averageScore || 0,
                    totalRatings: response.ratingSummary?.totalRatings || 0,
                    scoreDistribution: this.calculateScoreDistribution(response.recentRatings || [])
                },
                recentRatings: (response.recentRatings || []).map((rating: any) => ({
                    score: rating.score,
                    comment: rating.comment,
                    createdAt: rating.createdAt,
                    userName: rating.reviewer?.user?.name || 'Usuario anónimo'
                }))
            };
            
            // Forzar la actualización del tema
            setTimeout(() => {
                this.updateChartData();
                this.initializeChartOptions();
                this.ratingLoading = false;
            }, 0);
        },
        error: (error) => {
            console.error('Error loading ratings:', error);
            this.notificationService.showErrorCustom('Error al cargar los ratings');
            this.ratingLoading = false;
            this.companyRatings = this.getDefaultRatings();
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

  loadCompanies(): void {
    this.loading = true;
    this.companiesService.getAllCompanies().subscribe({
      next: (companies: companies[]) => {
        this.companies = companies;
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.showErrorCustom('Failed to load companies');
        this.loading = false;
      }
    });
  }

  onGlobalFilter(table: Table, event: Event): void {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew(): void {
    this.currentCompanyId = undefined;
    this.showAddEditDialog = true;
  }

  editCompany(company: companies): void {
    this.company = { ...company };
    this.currentCompanyId = company.id;
    this.showAddEditDialog = true;
  }

  onCompanySaved(): void {
    this.showAddEditDialog = false;
    this.loadCompanies();
  }
}