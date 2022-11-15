import { NgModule } from "@angular/core";
import { AuthService } from "./auth.service";

@NgModule({
    providers: [AuthService],
    exports: []
})
export class AuthModule {

}