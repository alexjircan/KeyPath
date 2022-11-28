import { AuthService } from "@/app/core/auth/auth.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit{
    
    @ViewChild('password') private passwordInput;
    @ViewChild('username') private usernameInput;
    @ViewChild('firstname') private firstnameInput;
    @ViewChild('lastname') private lastnameInput;

    isLoading: boolean = false;
    
    checkPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => { 
        let pass = group.get('password').value;
        let confirmPass = group.get('conPassword').value
        return pass === confirmPass ? null : { notSame: true }
    }

    public form: FormGroup<{
        firstname: FormControl<string>;
        lastname: FormControl<string>;
        email: FormControl<string>;
        password: FormControl<string>;
        conPassword: FormControl<string>;
      }>;

    constructor(
        public $auth: AuthService,
        public $router: Router,
    ){}

    ngOnInit(): void {
        this.form = new FormGroup({
            firstname: new FormControl('', [Validators.required]),
            lastname: new FormControl('', [Validators.required]),
            email: new FormControl('', [Validators.email, Validators.required]),
            password: new FormControl('', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d\\w\\W]{8,}$')]),
            conPassword: new FormControl('', [Validators.required]),
          }, {validators: [this.checkPasswords]});
    }

    isFormValid(): boolean{
        return this.form.valid;
    }

    onSubmit(){
        // grab the values from the native element as they may be "populated" via autofill.
        const passwordInputValue = this.passwordInput?.nativeElement.value;
        if (passwordInputValue && passwordInputValue !== this.form.get('password').value) {
            this.form.controls.password.setValue(passwordInputValue);
        }

        const usernameInputValue = this.usernameInput?.nativeElement.value;
        if (usernameInputValue && usernameInputValue !== this.form.get('email').value) {
            this.form.controls.email.setValue(usernameInputValue);
        }

        const firstnameInputValue = this.firstnameInput?.nativeElement.value;
        if (firstnameInputValue && firstnameInputValue !== this.form.get('firstname').value) {
            this.form.controls.firstname.setValue(firstnameInputValue);
        }

        const lastnameInputValue = this.lastnameInput?.nativeElement.value;
        if (lastnameInputValue && lastnameInputValue !== this.form.get('lastname').value) {
            this.form.controls.lastname.setValue(lastnameInputValue);
        }

        this.$auth.register({
            firstname: this.form.getRawValue().firstname,
            lastname: this.form.getRawValue().lastname,
            email: this.form.getRawValue().email,
            password: this.form.getRawValue().password}).subscribe(
                resp => console.log("ok"),
                err => console.log(err),
            ).add( () => this.isLoading = false  );
    }
}