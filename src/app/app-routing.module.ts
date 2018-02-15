import { NgModule } 				from '@angular/core';
import { RouterModule, Routes } 	from '@angular/router';

import { DatasetsComponent }		from './datasets/datasets.component';
import { MainInterfaceComponent }	from './main-interface/main-interface.component';
import { QueryViewComponent }		from './query-view/query-view.component';
import { ManageRulesetsComponent }  from './manage-rulesets/manage-rulesets.component';
import { CreateRulesetComponent }   from './create-ruleset/create-ruleset.component';

const appRoutes:Routes =[
	{
		path:'datasets',
		component: DatasetsComponent
	},
	{
		path:'main',
		component: MainInterfaceComponent
	},
	{
		path:'main/:id',
		component: MainInterfaceComponent
	},
	{
		path: 'query',
		component: QueryViewComponent,
		data: {env: 'My Query Title'}
	},
	{
		path: 'manageRulesets',
		component: ManageRulesetsComponent
	},
	{
		path: 'createRuleset',
		component: CreateRulesetComponent
	},
	{
		path: '',
		redirectTo: 'datasets',
		pathMatch: 'full'
	}
];

@NgModule({
	imports:[
		RouterModule.forRoot(appRoutes, { enableTracing:true })
	],
	exports:[
		RouterModule
	]
})

export class AppRoutingModule{}
