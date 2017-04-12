import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AgGridModule } from "ag-grid-angular/main";
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { RestangularModule } from 'ng2-restangular';
import { MaterialModule } from '@angular/material';

import { AppComponent } from './app.component';
import { MainInterfaceComponent } from './main-interface/main-interface.component';
import { QueryViewComponent } from './query-view/query-view.component';
import { SaveViewComponent } from './save-view/save-view.component';
import { DatasetsComponent } from './datasets/datasets.component';
import { DatasetsActionComponent } from './datasets/datasets-action/datasets-action.component';
import { NumericEditorComponent } from './main-interface/numeric-editor/numeric-editor.component';

const appRoutes:Routes=[
	{
		path:'datasets',
		component: DatasetsComponent
	},
	{
		path:'main/:id',
	   	component: MainInterfaceComponent,
	},
	{
		path: 'query/:env',
	   	component: QueryViewComponent,
		data: {env: 'My Query Title'}
	},
	{
		path: '',
		redirectTo: '/datasets',
		pathMatch: 'full'
	}
];

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
    NumericEditorComponent
  ],
  imports: [
    BrowserModule,
	AgGridModule.withComponents(
		[
			MainInterfaceComponent,
			DatasetsComponent,
			DatasetsActionComponent,
			NumericEditorComponent
		]
	),
    FormsModule,
    HttpModule,
	RouterModule.forRoot(appRoutes),
	RestangularModule.forRoot(restangularConfigFactory),
	MaterialModule
  ],
  entryComponents: [SaveViewComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
