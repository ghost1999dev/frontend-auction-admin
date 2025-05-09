import { Component, Input } from '@angular/core';
import { Project } from 'src/app/core/models/projects';
import { LayoutService } from 'src/app/core/services/layout.service';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss']
})
export class ProjectCardComponent {
  @Input() project!: any;

  constructor(private layoutService: LayoutService) {}

  get isDarkMode(): boolean {
    return this.layoutService.config.colorScheme === 'dark';
  }

  getStatusClass(): string {
    return this.project.status === 1 ? 'active' : 'inactive';
  }

  getBadgeClass(): string {
    return this.getStatusClass();
  }

  getStatusText(): string {
    return this.project.status === 1 ? 'Active' : 'Inactive';
  }

  getStatusIcon(): string {
    return this.project.status === 1 ? 'bx bx-check-circle' : 'bx bx-pause-circle';
  }

  getCategoryColor(): string {
    // Asigna colores basados en el ID de categoría o algún otro criterio
    const colors = ['#00b8d9', '#36b37e', '#ffab00', '#ff5630', '#6554c0'];
    return colors[this.project.category_id % colors.length];
  }

  getProgress(): number {
    // Lógica para calcular el progreso basado en días disponibles
    if (!this.project.days_available) return 0;
    const maxDays = 30; // Ajusta según tu lógica de negocio
    return Math.min(100, (this.project.days_available / maxDays) * 100);
  }

  showCardOptions(event: MouseEvent): void {
    event.stopPropagation();
    // Implementa lógica para mostrar opciones de la tarjeta
  }

}