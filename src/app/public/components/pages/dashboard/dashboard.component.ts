import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/core/services/app.layout.service';
import { DashboardService } from 'src/app/core/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  items!: MenuItem[];
  subscription!: Subscription;
  popularCategories: any[] = [];
  recentActivity: any[] = [];

  // Datos del dashboard
  activeCompanies: number = 0;
  activeDevelopers: number = 0;
  projectsByStatus: any = {
    Pendiente: 0,
    Activo: 0,
    Inactivo: 0,
    Rechazado: 0,
    Finalizado: 0
  };
  reportsByStatus: any = {
    Pendiente: 0,
    Resuelto: 0,
    Rechazado: 0
  };
  totalCategories: number = 0;
  adminsByStatus: any = {
    active: 0,
    inactive: 0
  };
  ratingsDistribution: any[] = [];
  
  loading: boolean = true;
  chartData: any;
  chartOptions: any;

  constructor(
    public layoutService: LayoutService,
    private dashboardService: DashboardService
  ) {
    this.subscription = this.layoutService.configUpdate$.subscribe(() => {
      this.initChart();
    });
  } 

  ngOnInit() {
    this.loadDashboardData();
    this.initChart();
    this.initMenuItems();
  }

  initMenuItems() {
    this.items = [
      { label: 'Actualizar', icon: 'pi pi-refresh', command: () => this.loadDashboardData() },
      { label: 'Exportar', icon: 'pi pi-download' }
    ];
  }

  loadDashboardData() {
    this.loading = true;
    this.dashboardService.getDashboardSummary().subscribe({
      next: (data) => {
        this.activeCompanies = data.activeCompanies.companiesCount;
        this.activeDevelopers = data.activeDevelopers.developersCount;
        this.projectsByStatus = data.projectsByStatus.statusCounts;
        this.reportsByStatus = data.reportsByStatus.statusCounts;
        this.totalCategories = data.totalCategories.total;
        this.adminsByStatus = data.adminsByStatus.statusCounts;
        this.ratingsDistribution = data.ratingsDistribution;
        
        this.updateCharts();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard data:', err);
        this.loading = false;
      }
    });
  }

  initChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.chartData = {
      labels: ['1', '2', '3', '4', '5'],
      datasets: [
        {
          label: 'Distribución de Calificaciones',
          data: [0, 0, 0, 0, 0],
          backgroundColor: [
            documentStyle.getPropertyValue('--red-500'),
            documentStyle.getPropertyValue('--orange-500'),
            documentStyle.getPropertyValue('--yellow-500'),
            documentStyle.getPropertyValue('--green-500'),
            documentStyle.getPropertyValue('--blue-500')
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--red-400'),
            documentStyle.getPropertyValue('--orange-400'),
            documentStyle.getPropertyValue('--yellow-400'),
            documentStyle.getPropertyValue('--green-400'),
            documentStyle.getPropertyValue('--blue-400')
          ]
        }
      ]
    };

    this.chartOptions = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor
          }
        }
      },
      responsive: true,
      maintainAspectRatio: false
    };
  }

  updateCharts() {
    // Actualizar gráfico de ratings
    const ratingsData = [0, 0, 0, 0, 0];
    this.ratingsDistribution.forEach(rating => {
      if (rating.score >= 1 && rating.score <= 5) {
        ratingsData[rating.score - 1] = rating.count;
      }
    });
    
    this.chartData = {
      ...this.chartData,
      datasets: [
        {
          ...this.chartData.datasets[0],
          data: ratingsData
        }
      ]
    };
  }

  getStatusPercentage(status: string, total: number): number {
    return total > 0 ? Math.round((this.projectsByStatus[status] / total) * 100) : 0;
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // Agrega estos métodos a la clase DashboardComponent

getProjectsStatusArray(): any[] {
  return [
    { label: 'Pendiente', value: this.projectsByStatus['Pendiente'] },
    { label: 'Activo', value: this.projectsByStatus['Activo'] },
    { label: 'Inactivo', value: this.projectsByStatus['Inactivo'] },
    { label: 'Rechazado', value: this.projectsByStatus['Rechazado'] },
    { label: 'Finalizado', value: this.projectsByStatus['Finalizado'] }
  ];
}

getTotalProjects(): any {
  return Object.values(this.projectsByStatus).reduce((a: any, b: any) => a + b, 0);
}

getStatusColorClass(status: string): string {
  const colorMap: {[key: string]: string} = {
    'Pendiente': 'bg-yellow-500',
    'Activo': 'bg-green-500',
    'Inactivo': 'bg-red-500',
    'Rechazado': 'bg-pink-500',
    'Finalizado': 'bg-blue-500'
  };
  return colorMap[status] || 'bg-gray-500';
}

getReportsStatusArray(): any[] {
  return [
    { label: 'Pendiente', value: this.reportsByStatus['Pendiente'] },
    { label: 'Resuelto', value: this.reportsByStatus['Resuelto'] },
    { label: 'Rechazado', value: this.reportsByStatus['Rechazado'] }
  ];
}

getTotalReports(): any {
  return Object.values(this.reportsByStatus).reduce((a: any, b: any) => a + b, 0);
}

getReportColorClass(status: string): string {
  const colorMap: {[key: string]: string} = {
    'Pendiente': 'bg-yellow-500',
    'Resuelto': 'bg-green-500',
    'Rechazado': 'bg-red-500'
  };
  return colorMap[status] || 'bg-gray-500';
}

getReportPercentage(status: string, total: number): number {
  return total > 0 ? Math.round((this.reportsByStatus[status] / total) * 100) : 0;
}

getAdminsStatusArray(): any[] {
  return [
    { label: 'active', value: this.adminsByStatus['active'] },
    { label: 'inactive', value: this.adminsByStatus['inactive'] }
  ];
}

getTotalAdmins(): any {
  return Object.values(this.adminsByStatus).reduce((a: any, b: any) => a + b, 0);
}

getAdminColorClass(status: string): string {
  const colorMap: {[key: string]: string} = {
    'active': 'bg-green-500',
    'inactive': 'bg-red-500'
  };
  return colorMap[status] || 'bg-gray-500';
}

getAdminPercentage(status: string, total: number): number {
  return total > 0 ? Math.round((this.adminsByStatus[status] / total) * 100) : 0;
}

getPopularCategories(): any[] {
  return this.popularCategories.map(cat => ({
    name: cat.name,
    count: cat.count
  }));
}

getCategoryPercentage(count: number, total: number): number {
  return total > 0 ? Math.round((count / total) * 100) : 0;
}

// For Recent Activity table

}