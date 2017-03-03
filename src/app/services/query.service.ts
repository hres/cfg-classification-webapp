import { Injectable } from '@angular/core';
import { CfgItem } from '../dtos/cfgitem';
import { CFGITEMS } from './mock-data';
import { Restangular } from 'ng2-restangular';

@Injectable()
export class QueryService {

	constructor(private restangular:Restangular){ }

	getData(): Promise<CfgItem[]>{
		return Promise.resolve(CFGITEMS);
	}

	getGroups(){
		let element = this.restangular.one("fm/service/foods?data-source=both&food-recipe-name=&food-recipe-code=&commit-date-begin=&commit-date-end=&cnf-code=&subgroup-code=&cfg-tier=0&recipe=0&sodium=0&sugar=0&fat=0&transfat=0&caffeine=0&free-sugars=0&sugar-substitutes=0&reference-amount-missing=on&cfg-serving-missing=on&tier-4-serving-missing=on&energy-value-missing=on&cnf-code-missing=on&recipe-rolled-up-down-missing=on&sodium-value-missing=on&sugar-value-missing=on&fat-value-missing=on&transfat-value-missing=on&satfat-value-missing=on&select-all-missing=on&added-sodium-missing=on&added-sugar-missing=on&added-transfat-missing=on&added-caffeine-missing=on&added-free-sugars-missing=on&added-sugar-substitutes-missing=on").get();
		return element;
	}
}
