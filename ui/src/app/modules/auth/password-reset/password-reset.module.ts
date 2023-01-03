import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PasswordResetComponent } from "./password-reset.component";

@NgModule({
    declarations: [PasswordResetComponent],
    imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class PasswordResetModule{}