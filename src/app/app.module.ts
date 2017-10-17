import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AgGridModule } from "ag-grid-angular/main";
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RestangularModule } from 'ngx-restangular';
import {
	MatDialogModule,
	MatSelectModule,
	MatTooltipModule
} from '@angular/material';

import { AppComponent } from './app.component';
import { MainInterfaceComponent }	from './main-interface/main-interface.component';
import { QueryViewComponent }		from './query-view/query-view.component';
import { SaveViewComponent } from './save-view/save-view.component';
import { ColumnVisibilityComponent }	from './column-visibility/column-visibility.component';
import { PopupMessage }				from './popup-message/popup-message';
import { DatasetsComponent } from './datasets/datasets.component';
import { DatasetsActionComponent } from './datasets/datasets-action/datasets-action.component';
import { NumericEditorComponent } from './main-interface/numeric-editor/numeric-editor.component';
import { BooleanEditorComponent } from './main-interface/boolean-editor/boolean-editor.component';
import { StringEditorComponent } from './main-interface/string-editor/string-editor.component';
import { BooleanRendererComponent } from './main-interface/boolean-renderer/boolean-renderer.component';
import { NoSelectionRendererComponent } from './main-interface/no-selection-renderer/no-selection-renderer.component';

import { AppRoutingModule }	from './app-routing.module';
import { ManageRulesetsComponent } from './manage-rulesets/manage-rulesets.component';
import { RulesetComponent } from './manage-rulesets/ruleset/ruleset.component';
import { RulesetEditorComponent } from './manage-rulesets/ruleset-editor/ruleset-editor.component';
import { CreateRulesetComponent } from './create-ruleset/create-ruleset.component';
import { MissingNumericFilter } from './main-interface/missing-numeric-filter/missing-numeric-filter.component';
import { MissingStringFilter } from './main-interface/missing-string-filter/missing-string-filter.component';
import { MissingBooleanFilter } from './main-interface/missing-boolean-filter/missing-boolean-filter.component';

import { KeycloakService } from './keycloak-service/keycloak.service';
import { KeycloakHttp, KEYCLOAK_HTTP_PROVIDER } from './keycloak-service/keycloak.http';

// Do your Restangular default settings here
export function restangularConfigFactory(RestangularProvider){}

@NgModule({
	exports:[MatSelectModule],
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
		StringEditorComponent,
		PopupMessage,
		BooleanRendererComponent,
		ManageRulesetsComponent,
		RulesetComponent,
		RulesetEditorComponent,
		NoSelectionRendererComponent,
		CreateRulesetComponent,
		MissingNumericFilter,
		MissingStringFilter,
		MissingBooleanFilter,
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
				BooleanRendererComponent,
				StringEditorComponent,
				ManageRulesetsComponent,
				RulesetComponent,
				RulesetEditorComponent,
				NoSelectionRendererComponent,
				MissingNumericFilter,
				MissingStringFilter,
				MissingBooleanFilter
			]
		),
		FormsModule,
		HttpModule,
		MatDialogModule,
		MatSelectModule,
		RestangularModule.forRoot(restangularConfigFactory),
		AppRoutingModule
	],
	entryComponents: [SaveViewComponent, ColumnVisibilityComponent, PopupMessage],
	providers: [
		KeycloakService,
		KEYCLOAK_HTTP_PROVIDER
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
