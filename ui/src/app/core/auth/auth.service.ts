import { environment } from "@/environments/environment";
import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
import { catchError, map, of } from "rxjs";
import { ApiService } from "../api.service";

interface UserInterface {
    user_id?: string;
}

@Injectable()
export class AuthService {
    public token: string;
    public user: UserInterface = {};

    constructor(
        private $api: ApiService,
        private $jwtHelper: JwtHelperService,
      ) {
        this.loadToken();
      }

    loadToken() {
        const token = window.localStorage.getItem(environment.jwt.tokenKey);
        if (token) {
          this.validateToken(token);
        }
      }

    isLoggedIn() {
        return this.user && this.token;
    }

    login(form: {username: string; password: string}){
        return this.$api.post('/auth/login', {email: form.username, password: form.password}).pipe(
            map( (resp) => {
                if ( !resp.access_token || !this.validateToken(resp.access_token) ) throw new Error("Invalid username or password.");
                window.localStorage.setItem(environment.jwt.tokenKey, resp.access_token);
            } )
        );
    }

    logout(){
        this.user = null;
        this.token = null;
        window.localStorage.removeItem(environment.jwt.tokenKey);
        window.location.reload();
    }

    register(form: {firstname: string, lastname: string, email: string; password: string}){
        return this.$api.post('/auth/register', form).pipe(
            map(
                (resp) => {
                    if( resp !== "Registration success" ) throw new Error(resp);
                }
            )
        )
    }

    validateToken(token: string){
        try{
            this.user = this.$jwtHelper.decodeToken(token);
            this.token = token;
            return true;
        } catch (e) {
            console.log(e);
            window.localStorage.removeItem(environment.jwt.tokenKey)
            this.token = null;
            return false;
        }
    }
}