import { Account } from "@/app/core/account/account";
import { AccountService } from "@/app/core/account/account.service";
import { ApiService } from "@/app/core/api.service";
import { User } from "@/app/core/user";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { faEyeSlash, faStar } from "@fortawesome/free-regular-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { filter, map, Observable, tap } from "rxjs";

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit{
    faEye = faEye;
    faEyeSlash = faEyeSlash;

    public accounts: Observable<Account[]>;

    public isLoading: boolean = false;
    public isTableLoading: boolean = false;
    public passwordIcon = faEyeSlash;

    public form = new FormGroup({
        website: new FormControl('', Validators.required),
        username: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required),
    });

    constructor(
        public $accountService: AccountService,
        public $api: ApiService
    ){
        this.accounts = $accountService.getAccounts().pipe(
            map( accounts => {
                accounts.forEach( account => account.showPassword = false )
                console.log(accounts);
                return accounts;
            } )
        );
    }

    ngOnInit(): void {
        
    }

    hidePassword() {
        if( this.passwordIcon == faEye ){
            this.passwordIcon = faEyeSlash;
        }
        else{
            this.passwordIcon = faEye;
        }
    }

    deleteAccount(account: Account) {
        this.$accountService.deleteAccount({id: account.id}).subscribe(
            (resp) => {
                console.log(resp);
                this.isTableLoading = false;
            }
        )
        this.isTableLoading = true;
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