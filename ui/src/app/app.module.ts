import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './core/auth/auth.module';
import { AuthComponent } from './modules/auth/auth.component';
import { HomeModule } from './modules/home/home.module';
import { LoginModule } from './modules/auth/login/login.module';
import { RegisterModule } from './modules/auth/register/register.module';
import { LayoutComponent } from './shared/layout/layout.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DetailsModule } from './modules/details/details.module';
import { ConfirmEmailComponent } from './modules/auth/confirm-email/confirm-email.component';
import { ConfirmEmailModule } from './modules/auth/confirm-email/confirm-email.module';
import { PasswordResetComponent } from './modules/auth/password-reset/password-reset.component';
import { PasswordResetModule } from './modules/auth/password-reset/password-reset.module';
import { PasswordResetTokenComponent } from './modules/auth/password-reset-token/password-reset-token.component';
import { PasswordResetTokenModule } from './modules/auth/password-reset-token/password-reset-token.module';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    LayoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HomeModule,
    DetailsModule,
    ConfirmEmailModule,
    PasswordResetModule,
    PasswordResetTokenModule,
    AuthModule,
    LoginModule,
    RegisterModule,
    HttpClientModule,
    NgbModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
