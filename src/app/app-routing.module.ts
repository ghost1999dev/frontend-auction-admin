import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicComponent } from './public/public.component';
import { AuthGuard } from './core/guards/auth.guard';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

const routes: Routes = [
  {path: '', redirectTo: 'auth', pathMatch: 'full'},
  {path: 'main', loadChildren: () => import('./public/components/pages/pages.module').then(m => m.PagesModule)
    , canActivate: [AuthGuard]
  },
  { 
    path: 'error',
    loadChildren: () => import('./public/components/error/error.module').then(m => m.ErrorModule),    
    data: {
      'type': 404,
      'title': 'Page Not Found',
      'desc': 'Oopps!! The page you were looking for doesn\'t exist.'
    }
  },
  {path: 'auth', loadChildren: () => import('./public/components/auth/auth.module').then(m => m.AuthModule)},
  {path: '**', redirectTo: 'error', pathMatch: 'full' }

];

@NgModule({
  schemas: [NO_ERRORS_SCHEMA], // <-- Oculta los errores de propiedades desconocidas
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' , useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
