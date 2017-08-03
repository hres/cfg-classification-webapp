import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { environment } from '../../environments/environment';

@Injectable()
export class RulesetsService {

	constructor(private restangular:Restangular) { }

	//getRulesets():Observable<any>{
		//return Observable.of([	{'name':'cfg-classification-ruleset 2011 *','id':'1'},
								//{'name': 'cfg-classification-ruleset 2017'}
							//]).delay(2000);
	//}

	getRulesets(){
		let element = this.restangular.oneUrl('rulesets', environment.servicesUrl + "service/rulesets").get();

		return element;
	}
}
