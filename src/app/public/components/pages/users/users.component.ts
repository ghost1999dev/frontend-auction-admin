import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { forkJoin } from 'rxjs';
import { usersWithImage } from 'src/app/core/models/users';
import { NotificationService } from 'src/app/core/services/notification.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
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
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (response: any) => {
        this.users = response;
        this.loading = false;
      },
      error: () => {
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
        this.notificationService.showSuccessCustom('User deleted successfully');
        this.loadUsers();
        this.user = {} as usersWithImage;
      }
    });
  }

  confirmDeleteSelected(): void {
    this.deleteUsersDialog = false;
    if (!this.selectedUsers || this.selectedUsers.length === 0) {
      this.notificationService.showErrorCustom('No users selected');
      return;
    }

    const deleteOperations = this.selectedUsers.map(user => 
      this.userService.deleteUser(user.id)
    );

    forkJoin(deleteOperations).subscribe({
      next: () => {
        this.notificationService.showSuccessCustom(`${this.selectedUsers.length} users deleted`);
        this.loadUsers();
        this.selectedUsers = [];
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