import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AgGridModule } from "ag-grid-angular/main";
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RestangularModule } from 'ng2-restangular';
import { MaterialModule } from '@angular/material';

import { AppComponent } from './app.component';
import { MainInterfaceComponent }	from './main-interface/main-interface.component';
import { QueryViewComponent }		from './query-view/query-view.component';
import { SaveViewComponent } from './save-view/save-view.component';
import { DatasetsComponent } from './datasets/datasets.component';
import { DatasetsActionComponent } from './datasets/datasets-action/datasets-action.component';
import { NumericEditorComponent } from './main-interface/numeric-editor/numeric-editor.component';
import { BooleanEditorComponent } from './main-interface/boolean-editor/boolean-editor.component';
import { StringEditorComponent } from './main-interface/string-editor/string-editor.component';

import { AppRoutingModule }	from './app-routing.module';

// Do your Restangular default settings here
export function restangularConfigFactory(RestangularProvider){}

@NgModule({
  declarations: [
    AppComponent,
	DatasetsComponent,
    MainInterfaceComponent,
    QueryViewComponent,
    SaveViewComponent,
    DatasetsActionComponent,
    NumericEditorComponent,
    BooleanEditorComponent,
    StringEditorComponent
  ],
  imports: [
    BrowserAnimationsModule,
	BrowserModule,
	AgGridModule.withComponents(
		[
			MainInterfaceComponent,
			DatasetsComponent,
			DatasetsActionComponent,
			NumericEditorComponent,
			BooleanEditorComponent,
			StringEditorComponent
		]
	),
	AppRoutingModule,
    FormsModule,
    HttpModule,
	RestangularModule.forRoot(restangularConfigFactory),
	MaterialModule
  ],
  entryComponents: [SaveViewComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
