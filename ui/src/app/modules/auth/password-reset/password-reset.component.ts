import { AuthService } from "@/app/core/auth/auth.service";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: 'app-password-reset',
    templateUrl: './password-reset.component.html',
    styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit{

    public loading: boolean = false;
    public errorMessage: string = "";
    public success: boolean = false;

    public form: FormGroup<{
        email: FormControl<string>;
    }>;

    constructor( 
        private $auth: AuthService,
        public $router: Router,
         ){}

    ngOnInit(): void {
        this.form = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.email])
        });
    }

    onSubmit(){
        this.$auth.sendResetEmail(this.form.get('email').value).subscribe(
            resp => {
                if( resp == "Send Failed - invalid email" ) this.errorMessage = "Request Failed - Invalid Email";
                else if( resp != "Sent email" ) this.errorMessage = resp;
                else this.success = true;
                this.loading = false;
            }
        );
        this.loading = true;
    }
}