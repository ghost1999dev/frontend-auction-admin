import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { OutletContext, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { BrowserModule } from '@angular/platform-browser';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FileUploadModule } from 'primeng/fileupload';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ChipsModule } from 'primeng/chips';
import { TagModule } from 'primeng/tag';
const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        component: LoginComponent
      }
    ]
  },
]

@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    PasswordModule,

    RadioButtonModule,
    FileUploadModule,
    
    ReactiveFormsModule,
    FormsModule,
    InputMaskModule,
    InputTextareaModule,

    ChipsModule,
    TagModule,

    RouterModule.forChild(routes)
  ],
  providers: [
  
  ],
})
export class AuthModule { }
