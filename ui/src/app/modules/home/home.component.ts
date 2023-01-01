import { Account } from "@/app/core/account/account";
import { AccountService } from "@/app/core/account/account.service";
import { ApiService } from "@/app/core/api.service";
import { User } from "@/app/core/user";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { faEyeSlash, faStar } from "@fortawesome/free-regular-svg-icons";
import { faCheck, faEye, faPen, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { filter, map, Observable, startWith, tap } from "rxjs";
import zxcvbn, { IZXCVBNResult } from "zxcvbn-typescript";

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit{
    faEye = faEye;
    faEyeSlash = faEyeSlash;
    faPen = faPen;
    faCheck = faCheck;
    faSpinner = faSpinner;

    public accounts$: Observable<Account[]>;

    public isLoading: boolean = false;
    public isTableLoading: boolean = false;
    public passwordIcon = faEyeSlash;
    public editIcon = faPen;
    public inputPasswordClass = "w-0";
    public inputPasswordCrackTime = "No Password";

    filter = new FormControl('', { nonNullable: true });

    public form = new FormGroup({
        website: new FormControl('', Validators.required),
        username: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required),
    });

    constructor(
        public $accountService: AccountService,
        public $api: ApiService
    ){
        this.accounts$ = $accountService.getAccounts();
    }

    search(text: string){
        this.accounts$ = this.$accountService.getAccounts().pipe(
            map( (accounts:Account[]) => accounts.filter(
                account => {
                    const term = text.toLowerCase();
                    return (
                        account.AccountUrl.includes(term)
                    );
                }
            ) )
        )
    }

    ngOnInit(): void {
        this.filter.valueChanges.subscribe(
            text => {
                this.search(text);
            }
        )

        this.form.get("password").valueChanges.subscribe(
            password => {
                this.inputPasswordClass = this.computeStrengthClass( zxcvbn(password).score )
                this.inputPasswordCrackTime = zxcvbn(password).crack_times_display.online_no_throttling_10_per_second;
                if( password === "" ) this.inputPasswordCrackTime = "No Password";
            }
            );
    }

    onWebsiteChange($event, account){
        account.AccountUrl = $event.target.value;
        this.$accountService.getValidImgUrl(account);
        console.log($event.target.value);
        console.log(account);
    }

    onUsernameChange($event, account){
        account.AccountUserName = $event.target.value;
        console.log($event.target.value);
        console.log(account);
    }

    onPasswordChange($event, account){
        account.AccountPassword = $event.target.value;
        account.passwordStrength = this.$accountService.computePasswordStrength(account.AccountPassword);
    }

    computeStrengthClass(strength: number = 5): string{
        if (strength == 0) {
            return "w-0";
        }
        if (strength == 1) {
            return "w-25 bg-danger";
        }
        if (strength == 2) {
            return "w-50 bg-warning";
        }
        if (strength == 3) {
            return "w-75 bg-info";
        }
        if (strength == 4) {
            return "w-100 bg-success";
        }
        if (strength == 5) {
            return "w-0";
        }
    }

    hidePassword() {
        if( this.passwordIcon == faEye ){
            this.passwordIcon = faEyeSlash;
        }
        else{
            this.passwordIcon = faEye;
        }
    }


    getValidUrl(url: string){
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url =  'http://' + url;
        }
        return url;
    }

    editAccount(account: Account){
        if( !account.editable ){
            account.editable = true;
        }
        else{
            this.$accountService.updateAccount({
                id: account.id, 
                AccountUserName: account.AccountUserName, 
                AccountPassword: account.AccountPassword,
                AccountUrl: account.AccountUrl
            }).subscribe(
                result => {
                    account.editLoading = false;
                }
            );
            account.editLoading = true;
            account.editable = false;
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
                    this.accounts$ = this.$accountService.getAccounts();
                    this.isLoading = false;
                }
            );
        }

        this.isLoading = true;
    }

}