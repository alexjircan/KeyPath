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

    changePassword(password: string){
        return this.$api.patch("/user/change-password", {password: password});
    }

    resetPassword(token: string, password: string){
        return this.$api.patch("/user/reset-password", {password: password}, {params: {token: token}})
    }

    sendResetEmail(email: string) {
        return this.$api.post("/user/send-reset-email", {email: email});
    }

    confirmEmail(token: string) {
        return this.$api.get("/user/confirm-email", {params: {token: token}});
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
                if ( !resp.access_token || !this.validateToken(resp.access_token) ) throw new Error(resp);
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

    logoutNoRefresh(){
        this.user = null;
        this.token = null;
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
            if( this.$jwtHelper.isTokenExpired(token) ){
                this.logout();
            }
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