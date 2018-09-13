/*
import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { environment } from '../../environments/environment';

@Injectable()
export class ClassifyService {

	constructor(private restangular:Restangular) { }

	classify(datasetId:string){
		let classifyEndpoint = "service/datasets/" + datasetId;

		let restObj = this.restangular.oneUrl('classify', environment.servicesUrl + classifyEndpoint);

		return restObj.customPOST(null, "classify", null, {'Content-Type': 'application/json'});
	}

	classifySandbox(dataset:any, rulesetId:number){
		let classifyEndpoint = "service/datasets/classify";
		let sandboxDataset:any = {
									data: dataset.data,
									name:dataset.name,
							env: 'sandbox'
									};
		let restObj = this.restangular.oneUrl('classify', environment.servicesUrl + classifyEndpoint);

		// [elem, path, params, headers]
		return restObj.customPOST(sandboxDataset, rulesetId, null, {});
	}
}
*/

import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

@Injectable()
export class ClassifyService {

	constructor(private http: Http) { };

	classify(datasetId:string){

		let classifyEndpoint = "service/datasets/" + datasetId;
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		let url = environment.servicesUrl + classifyEndpoint + '/classify'
		
    	return this.http.post(url, null, options).map(response => response.json());

	}

	classifySandbox(dataset:any, rulesetId:number){
		let classifyEndpoint = "service/datasets/classify";
		let sandboxDataset:any = {
									data: dataset.data,
									name:dataset.name,
									env: 'sandbox'
									};

		
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		let url = environment.servicesUrl + classifyEndpoint + '/' + rulesetId
		
		return this.http.post(url,sandboxDataset, options).map(response => response.json());

	}
}