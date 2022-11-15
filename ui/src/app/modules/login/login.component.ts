import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

    public form: FormGroup<{
        email: FormControl<string>;
        password: FormControl<string>;
      }>;

    ngOnInit(): void {
        this.form = new FormGroup({
            email: new FormControl('', [Validators.email]),
            password: new FormControl(''),
          });
    }

}