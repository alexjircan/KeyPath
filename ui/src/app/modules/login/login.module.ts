import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { LoginComponent } from "./login.component";
import { LoginGuard } from "./login.guard";

@NgModule({
    declarations: [LoginComponent],
    imports: [FormsModule],
    providers: [LoginGuard],
})
export class LoginModule { }