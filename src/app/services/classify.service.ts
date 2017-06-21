import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { environment } from '../../environments/environment';

@Injectable()
export class ClassifyService {

	constructor(private restangular:Restangular) { }

	classify(datasetId:string){
		let classifyEndpoint = "service/datasets/" + datasetId;

		let restObj = this.restangular.oneUrl('classify', environment.servicesUrl + classifyEndpoint);

		return restObj.customPOST(null, "classify", null, {});
	}

}
