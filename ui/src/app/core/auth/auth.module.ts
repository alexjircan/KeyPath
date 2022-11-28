import { NgModule } from "@angular/core";
import { JwtModule } from "@auth0/angular-jwt";
import { AuthService } from "./auth.service";
import { environment } from "@/environments/environment";

export function tokenGetter() {
    return localStorage.getItem(environment.jwt.tokenKey);
  }

@NgModule({
    providers: [AuthService],
    imports: [
        JwtModule.forRoot({
            config: {
                authScheme: 'bearer ',
                tokenGetter,
                skipWhenExpired: false,
                allowedDomains: environment.jwt.allowedDomains,
                disallowedRoutes: environment.jwt.disallowedRoutes,
              },
        })
    ],
    exports: []
})
export class AuthModule {

}