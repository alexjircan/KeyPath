import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable } from "rxjs";
import { ApiService } from "../api.service";
import { Account } from "./account";

@Injectable({
    providedIn: 'root',
})
export class AccountService{
    constructor(
        private $api: ApiService,
    ){}

    addAccount(form: {website: string, username: string, password: string}){
        let formAux = {
            username: form.username,
            password: form.password,
            url: form.website
        }
        return this.$api.post('/account/add', formAux);
    }

    getValidUrl(url: string){
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url =  'http://' + url;
        }
        return url + "/favicon.ico";
    }

    getAccounts(): Observable<Account[]> {
        return this.$api.get("/account/getAll");
    }
}