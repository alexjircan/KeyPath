import { Account } from "@/app/core/account/account";
import { AccountService } from "@/app/core/account/account.service";
import { ApiService } from "@/app/core/api.service";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit{
    public accounts: Observable<Account[]>;

    public isLoading: boolean = false;

    public form = new FormGroup({
        website: new FormControl('', Validators.required),
        username: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required),
    });

    constructor(
        public $accountService: AccountService,
        public $api: ApiService
    ){
        this.accounts = $accountService.getAccounts();
    }

    ngOnInit(): void {

    }

    deleteAccount(account: Account) {
        console.log(account.AccountUserName);
    }

    getValidUrl(url: string){
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url =  'http://' + url;
        }
        return url;
    }

    getUrlImage(url: string){
        url = this.getValidUrl(url);
        return url + "/favicon.ico";
    }

    addAccount() {
        if( this.form.valid ){
            this.$accountService.addAccount(this.form.getRawValue()).subscribe(
                (resp) => {
                    this.accounts = this.$accountService.getAccounts();
                    this.isLoading = false;
                }
            );
        }

        this.isLoading = true;
    }

}