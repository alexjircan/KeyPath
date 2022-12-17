import { AuthService } from "@/app/core/auth/auth.service";
import { User } from "@/app/core/user";
import { UserService } from "@/app/core/user.service";
import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

    public user$: Observable<User>;

    constructor(
        private $auth: AuthService,
        private $userService: UserService
    ){
        this.user$ = this.$userService.getUserDetails();
    }

    ngOnInit(): void {
    }

    onLogout(){
        this.$auth.logout();
    }
    
}