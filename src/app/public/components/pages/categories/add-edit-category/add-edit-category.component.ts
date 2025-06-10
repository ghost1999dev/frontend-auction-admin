import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Category } from 'src/app/core/models/categories';
import { CategoryService } from 'src/app/core/services/categories.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-add-edit-category',
  templateUrl: './add-edit-category.component.html',
  styleUrls: ['./add-edit-category.component.scss'],
})
export class AddEditCategoryComponent implements OnInit {
  @Input() categoryId?: number;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  categoryForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private notificationService: NotificationService,
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.categoryId) {
      this.loadCategory(this.categoryId);
    }
  }

  loadCategory(id: number): void {
    this.loading = true;
    this.categoryService.getCategoryById(id).subscribe({
      next: (category) => {
        this.categoryForm.patchValue({
          name: category.name
        });
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.categoryForm.invalid) {
      return;
    }

    this.loading = true;
    const formData = this.categoryForm.value;

    if (this.categoryId) {
      // Update category
      this.categoryService.updateCategory(this.categoryId, formData).subscribe({
        next: () => {
          this.notificationService.showSuccessCustom('Categoría actualizada');
          this.saved.emit();
        },
        error: () => {
          this.loading = false;
        }
      });
    } else {
      // Create category
      this.categoryService.createCategory(formData).subscribe({
        next: () => {
          this.notificationService.showSuccessCustom('Categoría creada');
          this.saved.emit();
        },
        error: () => {
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  get f() { return this.categoryForm.controls; }
}