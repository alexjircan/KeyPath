import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "src/app/core/auth/auth.service";

@Injectable({
    providedIn: 'root'
})
export class LoginGuard implements CanActivate {

    constructor(
        private $router: Router,
        private $auth: AuthService,
    ){ }

    canActivate(route: ActivatedRouteSnapshot, 
        state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        
        if (this.$auth.isLoggedIn()) {
            this.$router.navigate(['/']);
            return false;
        }

        return true;
    }
    
}