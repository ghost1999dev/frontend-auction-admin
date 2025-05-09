import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { forkJoin } from 'rxjs';
import { usersWithImage } from 'src/app/core/models/users';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [MessageService]
})
export class UsersComponent implements OnInit {
  @ViewChild('dt') dt: Table | undefined;
  
  users: usersWithImage[] = [];
  selectedUsers: usersWithImage[] = [];
  user: usersWithImage = {} as usersWithImage;

  showAddEditDialog = false;
  currentUserId?: number;

  deleteUserDialog: boolean = false;
  deleteUsersDialog: boolean = false;

  submitted: boolean = false;
  loading: boolean = false;

  statuses = [
    { label: 'Active', value: true },
    { label: 'Inactive', value: false }
  ];

  constructor(
    private userService: UserService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.loadUsers();
    console.log(this.users)
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (response: any) => {
        this.users = response;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load users'
        });
        this.loading = false;
      }
    });
  }

  deleteUser(user: usersWithImage): void {
    this.user = { ...user };
    this.deleteUserDialog = true;
  }

  confirmDelete(): void {
    this.deleteUserDialog = false;
    this.userService.deleteUser(this.user.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User deleted successfully'
        });
        this.loadUsers();
        this.user = {} as usersWithImage;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Failed to delete user'
        });
      }
    });
  }

  confirmDeleteSelected(): void {
    this.deleteUsersDialog = false;
    if (!this.selectedUsers || this.selectedUsers.length === 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No users selected'
      });
      return;
    }

    const deleteOperations = this.selectedUsers.map(user => 
      this.userService.deleteUser(user.id)
    );

    forkJoin(deleteOperations).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `${this.selectedUsers.length} users deleted`
        });
        this.loadUsers();
        this.selectedUsers = [];
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete some users'
        });
      }
    });
  }

  onGlobalFilter(table: Table, event: Event): void {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew(): void {
    this.currentUserId = undefined;
    this.showAddEditDialog = true;
  }

  editUser(user: usersWithImage): void {
    this.user = { ...user };
    this.currentUserId = user.id;
    this.showAddEditDialog = true;
  }

  onUserSaved(): void {
    this.showAddEditDialog = false;
    this.loadUsers();
  }
}