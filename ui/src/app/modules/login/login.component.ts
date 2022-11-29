import { AuthService } from "@/app/core/auth/auth.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

    @ViewChild('password') private passwordInput;
    @ViewChild('username') private usernameInput;

    isLoading: boolean = false;
    loginError: boolean = false;

    public form: FormGroup<{
        username: FormControl<string>;
        password: FormControl<string>;
      }>;

    constructor(
    public $auth: AuthService,
    public $router: Router,
    ) { }

    ngOnInit(): void {
        this.form = new FormGroup({
            username: new FormControl('', [Validators.email, Validators.required]),
            password: new FormControl('', [Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$"), Validators.required]),
          });
    }

    onSubmit() {
        // grab the values from the native element as they may be "populated" via autofill.
        const passwordInputValue = this.passwordInput?.nativeElement.value;
        if (passwordInputValue && passwordInputValue !== this.form.get('password').value) {
            this.form.controls.password.setValue(passwordInputValue);
        }

        const usernameInputValue = this.usernameInput?.nativeElement.value;
        if (usernameInputValue && usernameInputValue !== this.form.get('username').value) {
            this.form.controls.username.setValue(usernameInputValue);
        }

        this.$auth.login(this.form.getRawValue()).subscribe(
            resp => console.log(resp),
            err => this.loginError = true,
        ).add( () => this.isLoading = false );

        this.isLoading = true;
    }

}