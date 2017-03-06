import { Component } from '@angular/core';
import { CfgRequest } from '../dtos/cfg-request';

@Component({
	selector: 'query-view',
	templateUrl: './query-view.component.html',
	styleUrls: ['./query-view.component.css']
})

export class QueryViewComponent {

	cfgRequest = new CfgRequest();
	private addedSodium:boolean;

	constructor() { }

	// TODO:  This will have to be pulled in
	dataSource=['Food', 'Recipe', 'Both'];
	rollUpDown=[1,2,3];
	missingValues=['Reference Amount', 'CFG Serving', 'Tier 4 Serving', 'Energy Value', 'CNF Code', 'Recipe Rolled Up/Down', 'Sodium Value', 'Sugar Value', 'Fat Value', 'TransFat Value', 'SatFat Value', 'Added Sodium', 'Added Sugar', 'Added Transfat', 'Added Caffeine', 'Added Free Sugars', 'Added Sugar Substitutes'];

	// TODO: Remove this 
	get diagnostic() {return JSON.stringify(this.addedSodium);}

	showRollUp():boolean{
		return false; 
	}

	onSubmit(){
		//console.log(form.value);
	}
}
