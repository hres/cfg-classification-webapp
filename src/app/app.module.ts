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

const appRoutes:Routes=[
	{
		path:'datasets',
		component: DatasetsComponent
	},
	{
		path:'main',
	   	component: MainInterfaceComponent,
   		data: {breadcrumb: 'mybreadcrumb'}
	},
	{
		path: 'query',
	   	component: QueryViewComponent,
		data: {title: 'My Query Title'}
	},
	{
		path: '',
		redirectTo: '/datasets',
		pathMatch: 'full'
	}
];

export function restangular(RestangularProvider){
	RestangularProvider.setBaseUrl('http://localhost:8080/');
}

@NgModule({
  declarations: [
    AppComponent,
	DatasetsComponent,
    MainInterfaceComponent,
    QueryViewComponent,
    SaveViewComponent
  ],
  imports: [
    BrowserModule,
	AgGridModule.withComponents(
		[MainInterfaceComponent,DatasetsComponent]
	),
    FormsModule,
    HttpModule,
	RouterModule.forRoot(appRoutes),
	RestangularModule.forRoot(restangular),
	MaterialModule
  ],
  entryComponents: [SaveViewComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
