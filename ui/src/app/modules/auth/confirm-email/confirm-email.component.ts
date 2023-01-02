import { AuthService } from "@/app/core/auth/auth.service";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, of, Subject } from "rxjs";

@Component({
    selector: "app-confirm-email",
    templateUrl: "./confirm-email.component.html",
    styleUrls: ["./confirm-email.component.scss"]
})
export class ConfirmEmailComponent implements OnInit{
    fromRegister: boolean = false;
    success: boolean = false;
    message: string = '';

    constructor( 
        private $route: ActivatedRoute,
        public $router: Router,
        private $auth: AuthService
         ){}

    ngOnInit(): void {
        this.$auth.logoutNoRefresh();
        this.$route.queryParams.subscribe(
            params => {
                if( params.token ){
                    this.$auth.confirmEmail(params.token).subscribe(
                        resp => {
                            if( resp == "Activation Succeeded" ){
                                this.message = "success";
                                this.success = true;
                            }
                            else{
                                this.message = resp;
                            }
                        }
                    );
                }
                else{
                    this.fromRegister = true;
                }
            }
        )
    }
    
}