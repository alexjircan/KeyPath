import { User } from "@/app/core/user";
import { UserService } from "@/app/core/user.service";
import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";

@Component({
    selector: "app-details",
    templateUrl: "./details.component.html",
    styleUrls: ["./details.component.scss"]
})
export class DetailsComponent implements OnInit{
    public user$: Observable<User>;

    constructor(
        public $userService: UserService
    ){
    }

    ngOnInit(): void {
        this.user$ = this.$userService.getUserDetails();
    }
    
}