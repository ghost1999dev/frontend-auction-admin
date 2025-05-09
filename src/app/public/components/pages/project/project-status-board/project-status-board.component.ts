import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/core/models/projects';
import { ProjectsService } from 'src/app/core/services/projects.service';

@Component({
  selector: 'app-project-status-board',
  templateUrl: './project-status-board.component.html',
  styleUrls: ['./project-status-board.component.scss']
})
export class ProjectStatusBoardComponent implements OnInit {
  public lanes: any[] = [];
  public projects: any[] = [];
  public createPermission: boolean = false;

  showProjectDetail = false;
  selectedProject: Project | null = null;

  constructor(
    private projectsService: ProjectsService,
  ) { }

  ngOnInit(): void {
    this.loadProjects();
  }

  private loadProjects(): void {
    this.projectsService.getAllProjects()
    .subscribe(projects => {
      this.projects = projects;
      this.initializeLanes();
    });
  }

  private initializeLanes(): void {
    this.lanes = [
      {
        id: 0,
        title: 'Pending',
        issues: this.projects.filter(p => p.status === 0)
      },
      {
        id: 1,
        title: 'Active',
        issues: this.projects.filter(p => p.status === 1)
      },
      {
        id: 4,
        title: 'Completed',
        issues: this.projects.filter(p => p.status === 4)
      },
      {
        id: 3,
        title: 'Rejected',
        issues: this.projects.filter(p => p.status === 3)
      }
    ];
  }

  openProjectDetail(project: any) {
    this.selectedProject = project;
    this.showProjectDetail = true;
  }

  onEditProject(project: any) {
    this.showProjectDetail = false;
    // Lógica para editar el proyecto
    console.log('Edit project:', project);
  }

  onCloseDetail() {
    this.showProjectDetail = false;
  }
}