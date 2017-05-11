import { Injectable } from '@angular/core';
import { Restangular } from 'ng2-restangular';

@Injectable()
export class ClassifyService {

	constructor(private restangular:Restangular) { }

	classify(datasetId:string){
		let classifyEndpoint = "cfg-task-service/service/datasets";

		//let restObj = this.restangular.all(classifyEndpoint);
		let restObj = this.restangular.one(classifyEndpoint,datasetId);

		//return restObj.customPOST(null, datasetId + "/classify", null, {'Content-Type': 'application/json'});
		return restObj.customPOST(null, "classify", null, {});
	}

}
