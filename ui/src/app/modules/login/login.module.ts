import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LoginComponent } from "./login.component";
import { LoginGuard } from "./login.guard";

@NgModule({
    declarations: [LoginComponent],
    imports: [FormsModule, ReactiveFormsModule, CommonModule],
    providers: [LoginGuard],
})
export class LoginModule { }