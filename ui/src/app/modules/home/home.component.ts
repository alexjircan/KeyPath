import { Account } from "@/app/core/account/account";
import { AccountService } from "@/app/core/account/account.service";
import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit{
    public accounts: Observable<Account[]>;

    constructor(
        public $accountService: AccountService
    ){
        this.accounts = $accountService.accounts;
    }

    ngOnInit(): void {
        this.accounts.subscribe((result) => console.log(result))
    }

}