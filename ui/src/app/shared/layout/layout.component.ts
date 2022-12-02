import { AuthService } from "@/app/core/auth/auth.service";
import { Component, OnInit } from "@angular/core";

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
    constructor(
        private $auth: AuthService
    ){}

    ngOnInit(): void {
    }

    onLogout(){
        this.$auth.logout();
    }
    
}