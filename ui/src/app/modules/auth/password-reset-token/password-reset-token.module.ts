import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PasswordResetTokenComponent } from "./password-reset-token.component";

@NgModule({
    declarations: [PasswordResetTokenComponent],
    imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class PasswordResetTokenModule{}