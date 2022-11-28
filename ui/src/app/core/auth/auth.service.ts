import { environment } from "@/environments/environment";
import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
import { catchError, map, of } from "rxjs";
import { ApiService } from "../api.service";

interface UserInterface {
    username?: string;
}

@Injectable()
export class AuthService {
    public token: string;
    public user: UserInterface = {};

    constructor(
        private $api: ApiService,
        private $jwtHelper: JwtHelperService,
      ) {
      }

    isLoggedIn() {
        return false;
    }

    login(form: {username: string; password: string}){
        return this.$api.post('/auth/login', form).pipe(
            map( (resp) => {
                if ( !resp.access_token || !this.validateToken(resp.access_token) ) throw new Error("Invalid username or password.");
                window.localStorage.setItem(environment.jwt.tokenKey, resp.access_token);
                console.log(resp);
            } )
        );
    }

    validateToken(token: string){
        try{
            this.user = this.$jwtHelper.decodeToken(token);
            this.token = token;
            console.log(this.$jwtHelper.decodeToken(token));
            return true;
        } catch (e) {
            console.log(e);
            window.localStorage.removeItem(environment.jwt.tokenKey)
            this.token = null;
            return false;
        }
    }
}