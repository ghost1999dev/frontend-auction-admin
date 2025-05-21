import { Component, ElementRef, OnInit } from '@angular/core';
import { AdminService } from 'src/app/core/services/admin.service';
import { LayoutService } from 'src/app/core/services/app.layout.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  model: any[] = [];
  public admin: any;

  constructor(
    public layoutService: LayoutService, 
    public el: ElementRef,     
    private adminServices: AdminService,
  ) { }

  ngOnInit() {
    this.getAdminById(this.id);
  }

  private initializeMenuAdmin() {
    this.model = [
      {
        label: 'Inicio',
        items: [
          { label: 'Panel', icon: 'pi pi-fw pi-home', routerLink: ['/main/dashboard'] }
        ]
      },
      {
        label: 'Menú',
        items: [
          //{ label: 'Auctions', icon: 'pi pi-fw pi-id-card', routerLink: ['/main/auctions'] },
          { label:  'Proyectos', icon: 'pi pi-fw pi-check-square', routerLink: ['/main/projects'] },
          //{ label: 'Administradores', icon: 'pi pi-fw pi-id-card', routerLink: ['/main/admins'] },
          //{ label: 'Favorites', icon: 'pi pi-fw pi-bookmark', routerLink: ['/main/favorites'] },
          //{ label: 'Users', icon: 'pi pi-fw pi-bookmark', routerLink: ['/main/users'] }
        ]
      },
    ];
  }

  private initializeMenuSuperAdmin() {
    this.model = [
      {
        label: 'Inicio',
        items: [
          { label: 'Panel', icon: 'pi pi-fw pi-home', routerLink: ['/main/dashboard'] }
        ]
      },
      {
        label: 'Menú',
        items: [
          { label:'Subastas', icon: 'pi pi-fw pi-id-card', routerLink: ['/main/auctions'] },
          { label:'Proyectos', icon: 'pi pi-fw pi-check-square', routerLink: ['/main/projects'] },
          { label:'Administradores', icon: 'pi pi-fw pi-id-card', routerLink: ['/main/admins'] },
          //{ label:'Favorites', icon: 'pi pi-fw pi-bookmark', routerLink: ['/main/favorites'] },
          { label:'Categorias', icon: 'pi pi-fw pi-box', routerLink: ['/main/categories'] },
          { label:'Usuarios', icon: 'pi pi-fw pi-bookmark', routerLink: ['/main/users'] }
        ]
      },
    ];
  }

  public getAdminById(id: any){
    this.adminServices.getAdminById(id)
    .subscribe((next: any) => {
      if(next){
        this.admin = next;
        if(next.role_id === 3){
          this.initializeMenuAdmin()
        }else if(next.role_id === 4){
          this.initializeMenuSuperAdmin()
        }
      }
    })
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
