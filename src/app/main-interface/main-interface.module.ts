import {MainInterfaceComponent} from './main-interface.component'
import {MatSelectModule} from '@angular/material/select';
import { NgModule } from '@angular/core';
import {RouterModule} from '@angular/router'
import { CommonModule } from '@angular/common';  
import { FormsModule } from '@angular/forms';
import { AgGridModule } from "ag-grid-angular/main";





@NgModule({
    imports:[
        MatSelectModule,
        RouterModule,
        CommonModule,
        FormsModule,
        AgGridModule
    ],
    declarations: [ 
        MainInterfaceComponent
         ],

    exports: [ MainInterfaceComponent,RouterModule ]
})
export class MainInterfaceModule {



 }