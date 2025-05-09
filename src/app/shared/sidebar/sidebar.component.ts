import { Component, ElementRef, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/core/services/app.layout.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  model: any[] = [];
  public user: any;

  constructor(
    public layoutService: LayoutService, 
    public el: ElementRef,     
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.initializeMenuBasedOnRole()
  }

  private initializeMenuBasedOnRole() {
    this.model = [
      {
        label: 'Home',
        items: [
          { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/main/dashboard'] }
        ]
      },
      {
        label: 'Menu',
        items: [
          //{ label: 'Auctions', icon: 'pi pi-fw pi-id-card', routerLink: ['/main/auctions'] },
          { label:  'Projects', icon: 'pi pi-fw pi-check-square', routerLink: ['/main/projects'] },
          { label: 'Admin', icon: 'pi pi-fw pi-id-card', routerLink: ['/main/admins'] },
          //{ label: 'Favorites', icon: 'pi pi-fw pi-bookmark', routerLink: ['/main/favorites'] },
          { label: 'Users', icon: 'pi pi-fw pi-bookmark', routerLink: ['/main/users'] }
        ]
      },
    ];
  }
}
