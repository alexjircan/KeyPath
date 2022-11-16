import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit{
    

    
    checkPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => { 
        let pass = group.get('password').value;
        let confirmPass = group.get('conPassword').value
        return pass === confirmPass ? null : { notSame: true }
    }

    public form: FormGroup<{
        email: FormControl<string>;
        password: FormControl<string>;
        conPassword: FormControl<string>;
      }>;

    ngOnInit(): void {
        this.form = new FormGroup({
            email: new FormControl('', [Validators.email]),
            password: new FormControl(''),
            conPassword: new FormControl(''),
          }, {validators: [this.checkPasswords]});
    }
}