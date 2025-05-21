import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { forkJoin } from 'rxjs';
import { NotificationService } from 'src/app/core/services/notification.service';
import { CompaniesService } from 'src/app/core/services/companies.service';
import { companies } from 'src/app/core/models/companies';

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
  currentCompanyId?: number;

  deleteCompanyDialog: boolean = false;
  deleteCompaniesDialog: boolean = false;

  submitted: boolean = false;
  loading: boolean = false;

  constructor(
    private companiesService: CompaniesService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.loadCompanies();
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