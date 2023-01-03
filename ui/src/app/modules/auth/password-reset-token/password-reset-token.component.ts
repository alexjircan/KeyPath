import { AuthService } from "@/app/core/auth/auth.service";
import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: 'app-password-reset-token',
    templateUrl: './password-reset-token.component.html',
    styleUrls: ['./password-reset-token.component.scss']
})
export class PasswordResetTokenComponent implements OnInit{
    public success: boolean = false;
    public loading: boolean = false;
    public errorMessage: string = "";

    public form: FormGroup<{
        password: FormControl<string>;
        conPassword: FormControl<string>;
    }>;

    constructor(
        private $auth: AuthService,
        private $route: ActivatedRoute,
        public $router: Router,
    ){}

    checkPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => { 
        let pass = group.get('password').value;
        let confirmPass = group.get('conPassword').value
        return pass === confirmPass ? null : { notSame: true }
    }

    ngOnInit(): void {
        this.form = new FormGroup({
            password: new FormControl('', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d\\w\\W]{8,}$')]),
            conPassword: new FormControl('', [Validators.required]),
          }, {validators: [this.checkPasswords]});
    }

    onSubmit(){
        console.log( this.form.get('password').value )
        this.$auth.resetPassword(this.$route.snapshot.paramMap.get('token'), this.form.get('password').value).subscribe(
            result => {
                if( result != 'Reset Succeeded' ) this.errorMessage = result;
                else this.success = true;
                this.loading = false;
            }
        );
        this.loading = true;
    }

}