import { MatPasswordStrengthModule } from "@angular-material-extensions/password-strength";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgbTypeaheadModule } from "@ng-bootstrap/ng-bootstrap";
import { HomeComponent } from "./home.component";

@NgModule({
    declarations: [HomeComponent],
    imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule, MatPasswordStrengthModule, NgbTypeaheadModule ]
})
export class HomeModule{}