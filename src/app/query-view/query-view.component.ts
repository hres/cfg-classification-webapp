import { Component } from '@angular/core';
import { CfgRequest } from '../dtos/cfg-request';
import { Router } from '@angular/router';
import { QueryService } from '../services/query.service';

@Component({
	selector: 'query-view',
	templateUrl: './query-view.component.html',
	styleUrls: ['./query-view.component.css'],
	providers: []
})

export class QueryViewComponent {

	cfgRequest = new CfgRequest();
	private addedSodium:boolean;
	private addedSugar:boolean;
	private addedFat:boolean;
	private addedTransFat:boolean;
	private addedCaffeine:boolean;
	private addedSugarSub:boolean;

	constructor(private router: Router, private queryService: QueryService) { }

	// TODO:  This will have to be pulled in
	dataSource=['Food', 'Recipe', 'Both'];
	cfgTiers=[
		{id: 1, name: 1},
		{id: 2, name: 2},
		{id: 3, name:3},
		{id: 4, name:4},
		{id: 0, name: 'Missing'},
		{id: -1, name: '(Custom)'}
	];
	rollUpDown=[
		{id: 1, name: 'Rolled Up'},
		{id: 2, name: 'Rolled Down'},
		{id: 3, name: 'Rolled Up/Down'}
	];
	missingValues=[
		{id:'refAmount', name:'Reference Amount', value:false},
		{id:'cfgServing', name:'CFG Serving', value:false},
		{id:'tier4Serving', name:'Tier 4 Serving', value:false},
		{id:'energy', name:'Energy', value:false},
		{id:'cnfCode', name:'CNF Code', value:false},
		{id:'rollUp', name:'Recipe Roll Up/Down', value:false},
		{id:'sodiumPer100g', name:'Sodium per 100g', value:false},
		{id:'sugarPer100g', name:'Sugar per 100g', value:false},
		{id:'fatPer100g', name:'Fat per 100g', value:false},
		{id:'transfatPer100g', name:'TransFat per 100g', value:false},
		{id:'satFatPer100g', name:'SatFat per 100g', value:false},
		{id:'addedSodium', name:'Contains Added Sodium', value:false},
		{id:'addedSugar', name:'Contains Added Sugar', value:false},
		{id:'addedTransfat', name:'Contains Added Transfat', value:false},
		{id:'caffeine', name:'Contains Caffeine', value:false},
		{id:'sugarSubstitute', name:'Contains Sugar Substitutes', value:false}
	];

	lastUpdateValues=[
		{id:'refAmount', name:'Reference Amount', value:false},
		{id:'cfgServing', name:'CFG Serving', value:false},
		{id:'tier4Serving', name:'Tier 4 Serving', value:false},
		{id:'rollUp', name:'Recipe Roll Up/Down', value:false},
		{id:'sodiumPer100g', name:'Sodium per 100g', value:false},
		{id:'sugarPer100g', name:'Sugar per 100g', value:false},
		{id:'fatPer100g', name:'Fat per 100g', value:false},
		{id:'transfatPer100g', name:'TransFat per 100g', value:false},
		{id:'satFatPer100g', name:'SatFat per 100g', value:false},
		{id:'addedSodium', name:'Contains Added Sodium', value:false},
		{id:'addedSugar', name:'Contains Added Sugar', value:false},
		{id:'addedTransfat', name:'Contains Added Transfat', value:false},
		{id:'caffeine', name:'Contains Caffeine', value:false},
		{id:'sugarSubstitute', name:'Contains Sugar Substitutes', value:false}
	];



	// TODO: Remove this 
	get diagnostic() {return JSON.stringify(this.addedSodium);}

	showRollUp():boolean{
		return false; 
	}

	onSubmit(){
		//build containsAdded boolean array
		this.cfgRequest.containsAdded = [];
		// contains added sodium
		if (this.addedSodium == true)
			this.cfgRequest.containsAdded.push("sodium=true");
		else if(this.addedSodium == false)
			this.cfgRequest.containsAdded.push("sodium=false");
		//contains added sugar
		if (this.addedSugar == true)
			this.cfgRequest.containsAdded.push("sugar=true");
		else if(this.addedSugar == false)
			this.cfgRequest.containsAdded.push("sugar=false");
		//contains added fat
		if (this.addedFat == true)
			this.cfgRequest.containsAdded.push("fat=true");
		else if(this.addedFat == false)
			this.cfgRequest.containsAdded.push("fat=false");
		//contains added transfat
		if (this.addedTransFat == true)
			this.cfgRequest.containsAdded.push("transfat=true");
		else if(this.addedTransFat == false)
			this.cfgRequest.containsAdded.push("transfat=false");
		// contains added caffeine
		if (this.addedCaffeine == true)
			this.cfgRequest.containsAdded.push("caffeine=true");
		else if(this.addedCaffeine == false)
			this.cfgRequest.containsAdded.push("caffeine=false");
		// contains added sugar substitute
		if (this.addedSugarSub == true)
			this.cfgRequest.containsAdded.push("sugarSubstitute=true");
		else if(this.addedSugarSub == false)
			this.cfgRequest.containsAdded.push("sugarSubstitute=false");

		this.cfgRequest.missing = this.getMissingValues();
		this.cfgRequest.lastUpdateFilter = this.getLastUpdateValues();

		this.queryService.cfgRequest = this.cfgRequest;

		this.router.navigate(['/main']);
	}

	getMissingValues():string[]{
		let missing = [];

		for (let item of this.missingValues){
			if(item.value)
				missing.push(item.id);
		}

		return missing;
	}

	getLastUpdateValues():string[]{
		let lastUpdateValues = [];

		for (let item of this.lastUpdateValues){
			if(item.value)
				lastUpdateValues.push(item.id);
		}

		return lastUpdateValues;
	}
}
