import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/auth/auth.guard';
import { AuthComponent } from './modules/auth/auth.component';
import { ConfirmEmailComponent } from './modules/auth/confirm-email/confirm-email.component';
import { DetailsComponent } from './modules/details/details.component';
import { HomeComponent } from './modules/home/home.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { LoginGuard } from './modules/auth/login/login.guard';
import { RegisterComponent } from './modules/auth/register/register.components';
import { RegisterGuard } from './modules/auth/register/register.guard';
import { LayoutComponent } from './shared/layout/layout.component';

const routes: Routes = [
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      {
        path: '',
        pathMatch: 'prefix',
        redirectTo: 'login'
      },
      {
        path: 'login',
        canActivate: [LoginGuard],
        component: LoginComponent
      },
      {
        path: 'register',
        canActivate: [RegisterGuard],
        component: RegisterComponent
      },
      {
        path: 'confirm-email',
        component: ConfirmEmailComponent
      },
    ]
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'details',
        component: DetailsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
