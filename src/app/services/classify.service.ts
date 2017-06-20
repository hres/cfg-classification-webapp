import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { environment } from '../../environments/environment';

@Injectable()
export class ClassifyService {

	constructor(private restangular:Restangular) { }

	classify(datasetId:string){
		let classifyEndpoint = "service/datasets";

		let restObj = this.restangular.oneUrl('classify', environment.servicesUrl + classifyEndpoint, datasetId);

		return restObj.customPOST(null, "classify", null, {});
	}

}
