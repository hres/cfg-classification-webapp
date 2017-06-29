import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class RulesetsService {

	constructor() { }

	getRulesets():Observable<any>{
		return Observable.of([	{'name':'cfg-classification-ruleset 2011 *','id':'1'},
								{'name': 'cfg-classification-ruleset 2017'}
							]).delay(2000);
	}
}
