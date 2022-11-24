import { Injectable } from "@angular/core";
import { ApiService } from "../api.service";

@Injectable()
export class AuthService {
    constructor(
        private $api: ApiService,
      ) {
      }

    isLoggedIn() {
        return false;
    }

    login(form: {email: String; password: String}){
        //TODO
    }
}