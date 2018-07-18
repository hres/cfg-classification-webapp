import {BooleanEditorComponent} from './boolean-editor.component'
import {MatSelectModule} from '@angular/material/select';
import { NgModule } from '@angular/core';
import {RouterModule} from '@angular/router'
import { CommonModule } from '@angular/common';  
import { FormsModule } from '@angular/forms';





@NgModule({
    imports:[
        MatSelectModule,
        RouterModule,
        CommonModule,
        FormsModule
    ],
    declarations: [ 
        BooleanEditorComponent
         ],

    exports: [ BooleanEditorComponent,RouterModule ]
})
export class BooleanEditorModule {



 }