import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AgGridModule } from "ag-grid-angular/main";

import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { MainInterfaceComponent } from './main-interface/main-interface.component';
import { QueryViewComponent } from './query-view/query-view.component';
import { RestangularModule } from 'ng2-restangular';

const appRoutes:Routes=[
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
		redirectTo: '/query',
		pathMatch: 'full'
	}
];

export function restangular(RestangularProvider){
	RestangularProvider.setBaseUrl('http://localhost:8080/');
}

@NgModule({
  declarations: [
    AppComponent,
    MainInterfaceComponent,
    QueryViewComponent
  ],
  imports: [
    BrowserModule,
	AgGridModule.withComponents(
		[MainInterfaceComponent]
	),
    FormsModule,
    HttpModule,
	RouterModule.forRoot(appRoutes),
	RestangularModule.forRoot(restangular),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
