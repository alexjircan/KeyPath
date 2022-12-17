import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "./api.service";
import {User} from "./user"

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private $api: ApiService) { }

    getUserDetails(): Observable<User>{
        return this.$api.get('/user/details');
    }
}