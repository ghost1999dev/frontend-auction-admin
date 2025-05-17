import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { forkJoin } from 'rxjs';
import { Category } from 'src/app/core/models/categories';
import { CategoryService } from 'src/app/core/services/categories.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  @ViewChild('dt') dt: Table | undefined;
  
  categories: Category[] = [];
  selectedCategories: Category[] = [];
  category: Category = {} as Category;

  showAddEditDialog = false;
  currentCategoryId?: number;

  deleteCategoryDialog: boolean = false;
  deleteCategoriesDialog: boolean = false;

  submitted: boolean = false;
  loading: boolean = false;

  constructor(
    private categoryService: CategoryService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.showErrorCustom('Error al cargar categorías');
        this.loading = false;
      }
    });
  }

  deleteCategory(category: Category): void {
    this.category = { ...category };
    this.deleteCategoryDialog = true;
  }

  confirmDelete(): void {
    this.deleteCategoryDialog = false;
    this.categoryService.deleteCategory(this.category.id).subscribe({
      next: () => {
        this.notificationService.showSuccessCustom('Categoría eliminada');
        this.loadCategories();
        this.category = {} as Category;
      },
      error: (error) => {
        this.notificationService.showErrorCustom(error.error?.message || 'Error al eliminar categoría');
      }
    });
  }

  confirmDeleteSelected(): void {
    this.deleteCategoriesDialog = false;
    if (!this.selectedCategories || this.selectedCategories.length === 0) {
      this.notificationService.showErrorCustom('No hay categorías seleccionadas');
      return;
    }

    const deleteOperations = this.selectedCategories.map(category => 
      this.categoryService.deleteCategory(category.id)
    );

    forkJoin(deleteOperations).subscribe({
      next: () => {
        this.notificationService.showSuccessCustom(`${this.selectedCategories.length} categorías eliminadas`);
        this.loadCategories();
        this.selectedCategories = [];
      },
      error: (error) => {
        this.notificationService.showErrorCustom('Error al eliminar algunas categorías');
      }
    });
  }

  onGlobalFilter(table: Table, event: Event): void {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew(): void {
    this.currentCategoryId = undefined;
    this.showAddEditDialog = true;
  }

  editCategory(category: Category): void {
    this.category = { ...category };
    this.currentCategoryId = category.id;
    this.showAddEditDialog = true;
  }

  onCategorySaved(): void {
    this.showAddEditDialog = false;
    this.loadCategories();
  }
}