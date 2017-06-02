import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AgGridModule } from "ag-grid-angular/main";
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RestangularModule } from 'ngx-restangular';
import { MaterialModule } from '@angular/material';

import { AppComponent } from './app.component';
import { MainInterfaceComponent }	from './main-interface/main-interface.component';
import { QueryViewComponent }		from './query-view/query-view.component';
import { SaveViewComponent } from './save-view/save-view.component';
import { ColumnVisibilityComponent }	from './column-visibility/column-visibility.component';
import { DatasetsComponent } from './datasets/datasets.component';
import { DatasetsActionComponent } from './datasets/datasets-action/datasets-action.component';
import { NumericEditorComponent } from './main-interface/numeric-editor/numeric-editor.component';
import { BooleanEditorComponent } from './main-interface/boolean-editor/boolean-editor.component';
import { StringEditorComponent } from './main-interface/string-editor/string-editor.component';

import { AppRoutingModule }	from './app-routing.module';
import { KeycloakService } from './keycloak-service/keycloak.service';
import { KeycloakHttp, KEYCLOAK_HTTP_PROVIDER } from './keycloak-service/keycloak.http';

// Do your Restangular default settings here
export function restangularConfigFactory(RestangularProvider){}

@NgModule({
  declarations: [
    AppComponent,
	DatasetsComponent,
    MainInterfaceComponent,
    QueryViewComponent,
    SaveViewComponent,
	ColumnVisibilityComponent,
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
  entryComponents: [SaveViewComponent, ColumnVisibilityComponent],
	providers: [
		KeycloakService,
		KEYCLOAK_HTTP_PROVIDER
	],
  bootstrap: [AppComponent]
})
export class AppModule { }
