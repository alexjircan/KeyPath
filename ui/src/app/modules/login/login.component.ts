import { AuthService } from "@/app/core/auth/auth.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

    @ViewChild('password') private passwordInput;
    @ViewChild('username') private usernameInput;

    isLoading: boolean = false;

    public form: FormGroup<{
        username: FormControl<string>;
        password: FormControl<string>;
      }>;

    constructor(
    public $auth: AuthService,
    ) { }

    ngOnInit(): void {
        this.form = new FormGroup({
            username: new FormControl('', [Validators.email]),
            password: new FormControl(''),
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

        this.$auth.login(this.form.getRawValue()).subscribe({
            next(response) { 
                console.log(response); },
            error(err) { console.log(err); },
        }).add( () => this.isLoading = false );

        this.isLoading = true;
    }

}