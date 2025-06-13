import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OutletContext, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { BrowserModule } from '@angular/platform-browser';
import { TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu'; // Import MenuModule
import { ChartModule } from 'primeng/chart'; // Import ChartModule
import { AuctionsComponent } from './auctions/auctions.component';
import { ToastModule } from 'primeng/toast';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { BadgeModule } from 'primeng/badge';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ProjectComponent } from './project/project.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { UsersComponent } from './users/users.component';
import { ButtonModule } from 'primeng/button';
import { ProfileComponent } from './profile/profile.component';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';

import { PasswordModule } from 'primeng/password';
import { RoleGuard } from 'src/app/core/guards/role.guard';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { AdminsComponent } from './admins/admins.component';
import { AddEditAdminsComponent } from './admins/add-edit-admins/add-edit-admins.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AddEditUsersComponent } from "./users/add-edit-users/add-edit-users.component";
import { BoardDndListComponent } from './project/board-dnd-list/board-dnd-list.component';
import { ProjectStatusBoardComponent } from './project/project-status-board/project-status-board.component';
import { ProjectCardComponent } from './project/project-card/project-card.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ProjectDetailComponent } from './project/project-detail/project-detail.component';
import { AddEditProjectsComponent } from './project/add-edit-projects/add-edit-projects.component';
import { CategoriesComponent } from './categories/categories.component';
import { AddEditCategoryComponent } from './categories/add-edit-category/add-edit-category.component';
import { AddEditAuctionComponent } from './auctions/add-edit-auction/add-edit-auction.component';
import { CalendarModule } from 'primeng/calendar';
import { DeveloperListComponent } from './developer-list/developer-list.component';
import { CompanyListComponent } from './company-list/company-list.component';
import { ProjectApplicationComponent } from './project-application/project-application.component';
import { AddEditProjectApplicationComponent } from './project-application/add-edit-project-application/add-edit-project-application.component';
import { ReportDeveloperComponent } from './report-developer/report-developer.component';
import { AddEditReportDeveloperComponent } from './report-developer/add-edit-report-developer/add-edit-report-developer.component';
import { ReportCompanyComponent } from './report-company/report-company.component';
import { AddEditReportCompanyComponent } from './report-company/add-edit-report-company/add-edit-report-company.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [RoleGuard],
        data: { allowedRoles: [3, 4] } 
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [RoleGuard],
        data: { allowedRoles: [3, 4] } 
      },
      {
        path: 'auctions',
        component: AuctionsComponent,
        canActivate: [RoleGuard],
        data: { allowedRoles: [3] } 
      },
      {
        path: 'projects',
        component: ProjectComponent,
        canActivate: [RoleGuard],
        data: { allowedRoles: [3] } 
      },
      {
        path: 'view/projects/:id',
        component: ProjectDetailComponent,
        canActivate: [RoleGuard],
        data: { allowedRoles: [3] } 
      },
      {
        path: 'favorites',
        component: FavoritesComponent,
        canActivate: [RoleGuard],
        data: { allowedRoles: [3] } 
      },
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [RoleGuard],
        data: { allowedRoles: [3] } 
      },
      {
        path: 'admins',
        component: AdminsComponent,
        canActivate: [RoleGuard],
        data: { allowedRoles: [4] } 
      },
      {
        path: 'categories',
        component: CategoriesComponent,
        canActivate: [RoleGuard],
        data: { allowedRoles: [3] } 
      },
      {
        path: 'developers',
        component: DeveloperListComponent,
        canActivate: [RoleGuard],
        data: { allowedRoles: [3] } 
      },
      {
        path: 'companies',
        component: CompanyListComponent,
        canActivate: [RoleGuard],
        data: { allowedRoles: [3] } 
      },
      {
        path: 'project-application',
        component: ProjectApplicationComponent,
        canActivate: [RoleGuard],
        data: { allowedRoles: [3] } 
      },
      {
        path: 'report-developers',
        component: ReportDeveloperComponent,
        canActivate: [RoleGuard],
        data: { allowedRoles: [3] } 
      },
      {
        path: 'report-companies',
        component: ReportCompanyComponent,
        canActivate: [RoleGuard],
        data: { allowedRoles: [3] } 
      }
    ]
  },
]

@NgModule({
  schemas: [NO_ERRORS_SCHEMA], // <-- Oculta los errores de propiedades desconocidas
  declarations: [
    PagesComponent,
    DashboardComponent,
    AuctionsComponent,
    ProjectComponent,
    FavoritesComponent,
    UsersComponent,
    ProfileComponent,
    AdminsComponent,
    AddEditAdminsComponent,
    AddEditUsersComponent,
    ProjectStatusBoardComponent,
    ProjectCardComponent,
    BoardDndListComponent,
    ProjectDetailComponent,
    AddEditProjectsComponent,
    CategoriesComponent,
    AddEditCategoryComponent,
    AddEditAuctionComponent,
    DeveloperListComponent,
    CompanyListComponent,
    ProjectApplicationComponent,
    AddEditProjectApplicationComponent,
    ReportDeveloperComponent,
    AddEditReportDeveloperComponent,
    ReportCompanyComponent,
    AddEditReportCompanyComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    TableModule,
    DragDropModule,
    MenuModule,
    ChartModule,
    DialogModule,
    ButtonModule,
    PasswordModule,
    ToolbarModule,
    InputTextareaModule,
    DropdownModule,
    PaginatorModule,
    StyleClassModule,
    PanelMenuModule,
    ToastModule,
    ConfirmDialogModule,
    InputTextModule,
    SidebarModule,
    BadgeModule,
    RadioButtonModule,
    InputSwitchModule,
    RippleModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    NgxMaskPipe,
    AvatarModule,
    BadgeModule,
    ButtonModule,
    CardModule,
    DividerModule,
    TagModule,
    CalendarModule,
    TooltipModule,
    SkeletonModule,
    FormsModule,
    RouterModule.forChild(routes),],
  providers: [
    provideNgxMask(),
    MessageService, // Add this line
  ]
})
export class PagesModule { }
