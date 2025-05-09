import { Component, Input } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ProjectsService } from 'src/app/core/services/projects.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { ProjectStatusUpdate } from 'src/app/core/models/admin';
import { AdminService } from 'src/app/core/services/admin.service';
import { Project } from 'src/app/core/models/projects';

@Component({
  selector: '[board-dnd-list]',
  templateUrl: './board-dnd-list.component.html',
  styleUrls: ['./board-dnd-list.component.scss']
})
export class BoardDndListComponent {
  @Input() lanes: any;
  @Input() columnId!: number;
  showProjectDetail = false;
  displayDialog = false;
  selectedProject: Project | null = null;

  constructor(
    private adminServices: AdminService,
    private notificationService: NotificationService
  ) { }

  moveTask(event: CdkDragDrop<any>): void {
    const project = event.previousContainer.data[event.previousIndex];
    const newStatus = this.columnId;
    
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      
      this.updateProjectStatus(project.id, newStatus);
    }
  }

  private updateProjectStatus(projectId: number, newStatus: number): void {
    const statusUpdate: ProjectStatusUpdate = { newStatus };
    
    this.adminServices.updateProjectStatus(projectId, statusUpdate).subscribe({
      next: () => {
        this.notificationService.showSuccessCustom('Project status updated');
      },
      error: () => {
        this.notificationService.showErrorCustom('Failed to update project status');
      }
    });
  }

}