import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit{
    
    public form: FormGroup<{
        username: FormControl<string>;
        password: FormControl<string>;
        conPassword: FormControl<string>;
      }>;

    ngOnInit(): void {
        this.form = new FormGroup({
            username: new FormControl(''),
            password: new FormControl(''),
            conPassword: new FormControl(''),
          });
    }
}