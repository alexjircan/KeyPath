import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RegisterComponent } from "./register.components";


@NgModule({
    declarations: [RegisterComponent],
    imports: [FormsModule, ReactiveFormsModule, CommonModule],
})
export class RegisterModule { } 