import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { ApiService } from "../api.service";
import { Account } from "./account";

@Injectable({
    providedIn: 'root',
})
export class AccountService{
    private _accounts = new BehaviorSubject<Account[]>([]);

    constructor(
        private $api: ApiService,
    ){
        this.$api.get("/account/getAll").subscribe(
            (result) => {
                this._accounts.next(result);
            }
        );
    }

    get accounts() {
        return this._accounts;
    }
}