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
	private addedSodium:number;
	private addedSugar:number;
	private addedFat:number;
	private addedTransFat:number;
	private addedCaffeine:number;
	private addedSugarSub:number;

	constructor(private router: Router, private queryService: QueryService) { }

	// TODO:  This will have to be pulled in
	dataSource=[
		{id: 1, name:'Food'},
	   	{id: 2, name:'Recipe'},
		{id: 0, name:'Both'}
	];
	cfgTiers=[
		{id: 1, name: 1},
		{id: 2, name: 2},
		{id: 3, name:3},
		{id: 4, name:4},
		{id: 0, name: 'Missing'},
		{id: -1, name: '(Custom)'}
	];
	rollUpDown=[
		{id: 0, name: ''},
		{id: 1, name: 'Rolled Up'},
		{id: 2, name: 'Rolled Down'},
		{id: 3, name: 'Rolled Up/Down'}
	];

	containsAdded=[
		{id: 0, name: ''},
		{id: 1, name: 'Yes'},
		{id: 2, name: 'No'}
	];

	missingValues=[
		{id:'missingRefAmount', name:'refAmount', desc:'Reference Amount', value:false},
		{id:'missingCfgServing', name:'cfgServing', desc:'CFG Serving', value:false},
		{id:'missingTier4Serving', name:'tier4Serving', desc:'Tier 4 Serving', value:false},
		{id:'missingEnergy', name:'energy', desc:'Energy', value:false},
		{id:'missingCnfCode', name:'cnfCode', desc:'CNF Code', value:false},
		{id:'missingRollUp', name:'rollUp', desc:'Recipe Roll Up/Down', value:false},
		{id:'missingSodiumPer100g', name:'sodiumPer100g', desc:'Sodium per 100g', value:false},
		{id:'missingSugarPer100g', name:'sugarPer100g', desc:'Sugar per 100g', value:false},
		{id:'missingFatPer100g', name:'fatPer100g', desc:'Fat per 100g', value:false},
		{id:'missingTransfatPer100g', name:'transfatPer100g', desc:'TransFat per 100g', value:false},
		{id:'missingSatFatPer100g', name:'satFatPer100g', desc:'SatFat per 100g', value:false},
		{id:'missingAddedSodium', name:'addedSodium', desc:'Contains Added Sodium', value:false},
		{id:'missingAddedSugar', name:'addedSugar', desc:'Contains Added Sugar', value:false},
		{id:'missingAddedTransfat', name:'addedTransfat', desc:'Contains Added Transfat', value:false},
		{id:'missingCaffeine', name:'caffeine', desc:'Contains Caffeine', value:false},
		{id:'missingSugarSubstitute', name:'sugarSubstitute', desc:'Contains Sugar Substitutes', value:false}
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

	onSubmit(){
		//build containsAdded boolean array
		this.cfgRequest.containsAdded = [];
		// contains added sodium
		if (this.addedSodium == 1)
			this.cfgRequest.containsAdded.push("sodium=true");
		else if(this.addedSodium == 2)
			this.cfgRequest.containsAdded.push("sodium=false");
		//contains added sugar
		if (this.addedSugar == 1)
			this.cfgRequest.containsAdded.push("sugar=true");
		else if(this.addedSugar == 2)
			this.cfgRequest.containsAdded.push("sugar=false");
		//contains added fat
		if (this.addedFat == 1)
			this.cfgRequest.containsAdded.push("fat=true");
		else if(this.addedFat == 2)
			this.cfgRequest.containsAdded.push("fat=false");
		//contains added transfat
		if (this.addedTransFat == 1)
			this.cfgRequest.containsAdded.push("transfat=true");
		else if(this.addedTransFat == 2)
			this.cfgRequest.containsAdded.push("transfat=false");
		// contains added caffeine
		if (this.addedCaffeine == 1)
			this.cfgRequest.containsAdded.push("caffeine=true");
		else if(this.addedCaffeine == 2)
			this.cfgRequest.containsAdded.push("caffeine=false");
		// contains added sugar substitute
		if (this.addedSugarSub == 1)
			this.cfgRequest.containsAdded.push("sugarSubstitute=true");
		else if(this.addedSugarSub == 2)
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
				missing.push(item.name);
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
