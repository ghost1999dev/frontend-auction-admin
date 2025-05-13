import { Component, OnInit, ViewChild } from "@angular/core";
import { Table } from "primeng/table";
import { forkJoin } from "rxjs";
import { Project } from "src/app/core/models/projects";
import { NotificationService } from "src/app/core/services/notification.service";
import { ProjectsService } from "src/app/core/services/projects.service";

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent implements OnInit {

 @ViewChild('dt') dt: Table | undefined;
  
  projects: Project[] = [];
  selectedProjects: Project[] = [];
  project: Project = {} as Project;

  showAddEditDialog = false;
  currentProjectId?: number;

  deleteProjectDialog: boolean = false;
  deleteProjectsDialog: boolean = false;

  loading: boolean = false;

  constructor(
    private projectsService: ProjectsService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading = true;
    this.projectsService.getAllProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.showErrorCustom('Error al cargar los proyectos');
        this.loading = false;
      }
    });
  }

  deleteProject(project: Project): void {
    this.project = { ...project };
    this.deleteProjectDialog = true;
  }

  confirmDelete() {
    this.projectsService.hardDeleteProject(this.project.id).subscribe({
      next: () => {
        this.notificationService.showSuccessCustom('Proyecto eliminado exitosamente');
        this.loadProjects();
        this.deleteProjectDialog = false;
        this.project = {} as Project;
      },
      error: (error) => {
        this.notificationService.showErrorCustom('Error al eliminar el proyecto');
      }
    });
  }

  confirmDeleteSelected(): void {
    this.deleteProjectsDialog = false;
    if (!this.selectedProjects || this.selectedProjects.length === 0) {
      this.notificationService.showErrorCustom('No hay proyectos seleccionados');
      return;
    }

    const deleteOperations = this.selectedProjects.map(project => 
      this.projectsService.hardDeleteProject(project.id)
    );

    forkJoin(deleteOperations).subscribe({
      next: () => {
        this.notificationService.showSuccessCustom(`${this.selectedProjects.length} proyectos eliminados`);
        this.loadProjects();
        this.selectedProjects = [];
      },
      error: (error) => {
        this.notificationService.showErrorCustom('No se pudieron eliminar algunos proyectos');
      }
    });
  }

  onGlobalFilter(table: Table, event: Event): void {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew(): void {
    this.currentProjectId = undefined;
    this.showAddEditDialog = true;
  }

  editProject(project: Project): void {
    this.project = { ...project };
    this.currentProjectId = project.id;
    this.showAddEditDialog = true;
  }

  onProjectSaved(): void {
    this.showAddEditDialog = false;
    this.loadProjects();
  }

  getUserInfo() {
    const token = this.getTokens();
    let payload;
    if (token) {
      payload = token.split(".")[1];
      payload = window.atob(payload);
      return JSON.parse(payload)['id'];
    } else {
      return null;
    }
  }
  
  getTokens() {
    return localStorage.getItem("admin_token");
  }

  id: any = this.getUserInfo();

}
