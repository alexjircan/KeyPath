import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DetailsComponent } from "./details.component";

@NgModule({
    declarations: [DetailsComponent],
    imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class DetailsModule{}