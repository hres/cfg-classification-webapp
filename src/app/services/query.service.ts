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
		let element = this.restangular.one("fm2/service/foods").get();
		return element;
	}
}
