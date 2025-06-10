import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Admin } from '../models/admin';

@Injectable({
  providedIn: 'root'
})
export class AdminStateService {
    
  private adminsSubject = new BehaviorSubject<Admin[]>([]);
  admins$ = this.adminsSubject.asObservable();

  constructor() {}

  setAdmins(admins: Admin[]): void {
    this.adminsSubject.next(admins);
  }

  addAdmin(admin: Admin): void {
    const currentAdmins = this.adminsSubject.value;
    this.adminsSubject.next([...currentAdmins, admin]);
  }

  updateAdmin(updatedAdmin: Admin): void {
    const currentAdmins = this.adminsSubject.value;
    const updatedAdmins = currentAdmins.map(admin => 
      admin.id === updatedAdmin.id ? updatedAdmin : admin
    );
    this.adminsSubject.next(updatedAdmins);
  }

  removeAdmin(id: number): void {
    const currentAdmins = this.adminsSubject.value;
    const updatedAdmins = currentAdmins.filter(admin => admin.id !== id);
    this.adminsSubject.next(updatedAdmins);
  }
}