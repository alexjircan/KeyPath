import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private $auth: AuthService,
        private $router: Router
    ){}

    canActivate(
        route: ActivatedRouteSnapshot, 
        state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
            
        if( !this.$auth.isLoggedIn() ){
            window.sessionStorage.setItem('target_route', state.url);

            this.$router.navigate(['login']);

            return false;
        }

        return true;
    }

}