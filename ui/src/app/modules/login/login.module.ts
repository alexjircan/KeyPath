import { NgModule } from "@angular/core";
import { LoginComponent } from "./login.component";
import { LoginGuard } from "./login.guard";

@NgModule({
    declarations: [LoginComponent],
    providers: [LoginGuard]
})
export class LoginModule { }