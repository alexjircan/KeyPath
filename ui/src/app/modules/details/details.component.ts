import { AuthService } from "@/app/core/auth/auth.service";
import { User } from "@/app/core/user";
import { UserService } from "@/app/core/user.service";
import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { Observable } from "rxjs";

@Component({
    selector: "app-details",
    templateUrl: "./details.component.html",
    styleUrls: ["./details.component.scss"]
})
export class DetailsComponent implements OnInit{
    public user$: Observable<User>;
    public changePass: boolean = false;
    public loading:boolean = false;
    public passChanged: boolean = false;

    public form: FormGroup<{
        password: FormControl<string>;
        conPassword: FormControl<string>;
    }>;

    constructor(
        public $userService: UserService,
        private $auth: AuthService,
    ){
    }

    checkPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => { 
        let pass = group.get('password').value;
        let confirmPass = group.get('conPassword').value
        return pass === confirmPass ? null : { notSame: true }
    }

    ngOnInit(): void {
        this.user$ = this.$userService.getUserDetails();
        this.form = new FormGroup({
            password: new FormControl('', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d\\w\\W]{8,}$')]),
            conPassword: new FormControl('', [Validators.required]),
          }, {validators: [this.checkPasswords]});
    }

    onSubmit() {
        this.$auth.changePassword(this.form.get('password').value).subscribe(
            resp => {
                this.loading = false;
                this.changePass = false;
                this.passChanged = true;
            }
        )
        this.loading = true;
    }
    
}