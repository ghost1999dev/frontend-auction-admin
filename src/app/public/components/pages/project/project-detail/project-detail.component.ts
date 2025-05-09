import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from 'src/app/core/models/projects';
import { ProjectsService } from 'src/app/core/services/projects.service';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit {
  project: Project | null = null;
  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectsService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    
    this.projectService.getProjectById(id)
    .subscribe({
      next: (project) => {
        this.project = project;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load project details';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  getStatusText(status: number): string {
    switch (status) {
      case 0:
        return "Inactive";
      case 1:
        return "Active";
      case 2:
        return "Pending";
      case 4:
        return "Complete";
      case 3:
        return "Rejected";
      default:
        return "Unknown";
    }
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  }}