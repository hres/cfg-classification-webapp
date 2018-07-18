import {ColumnVisibilityComponent} from './column-visibility.component'
import {MatSelectModule} from '@angular/material/select';
import { NgModule } from '@angular/core';
import {RouterModule} from '@angular/router'
import { CommonModule } from '@angular/common';  
import { FormsModule } from '@angular/forms';
import { AgGridModule } from "ag-grid-angular/main";
import {MatTabsModule} from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material';





@NgModule({
    imports:[
        MatSelectModule,
        RouterModule,
        CommonModule,
        FormsModule,
        AgGridModule,
        MatTabsModule,
        MatDialogModule
    ],
    declarations: [ 
        ColumnVisibilityComponent
         ],

    exports: [ ColumnVisibilityComponent,RouterModule ]
})
export class ColumnVisibilityModule {



 }