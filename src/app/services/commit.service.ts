import { Injectable } from '@angular/core';
import { Restangular }	from 'ngx-restangular';
import { environment }	from '../../environments/environment';

@Injectable()
export class CommitService {

	constructor(private restangular:Restangular) { }

	commit(changedTierFoods:any, datasetId:string){
		let commitEndpoint = "service/datasets/" + datasetId;

		let restObj = this.restangular.oneUrl('commit', environment.servicesUrl + commitEndpoint);

		// [elem, path, params, headers]
		return restObj.customPOST(changedTierFoods, "commit", null, {'Content-Type': 'application/json'});
	}
}
