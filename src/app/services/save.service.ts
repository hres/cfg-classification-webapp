/*
import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { environment } from '../../environments/environment';

@Injectable()
export class SaveService {

	constructor(private restangular:Restangular) { }

	save(dataset:any){
		let saveEndpoint = "service/datasets";

		let restObj = this.restangular.allUrl('save', environment.servicesUrl + saveEndpoint);
	
		let request:any = {};
		request.name = dataset.name;
		request.status = dataset.status;
		request.comments = dataset.comments;
		request.data = dataset.data;
		request.owner = dataset.owner;
		//todo remove this
		request.env = "prod";

		if(dataset.id != undefined){
			return restObj.customPUT(request, dataset.id, undefined, {'Content-Type': 'application/json'});
		}else{
			// [elem, path, params, headers]
			return restObj.customPOST(request,undefined, undefined, {'Content-Type': 'application/json'});
		}
	}
}
*/

import { Injectable } from '@angular/core';
//import { Restangular } from 'ngx-restangular';
import { Http, RequestOptions, Headers } from '@angular/http';
import { environment } from '../../environments/environment';

@Injectable()
export class SaveService {

	constructor(private http:Http) { }

	save(dataset:any){
		let saveEndpoint = "service/datasets";
		let url = environment.servicesUrl + saveEndpoint;
	
		let request:any = {};
		request.name = dataset.name;
		request.status = dataset.status;
		request.comments = dataset.comments;
		request.data = dataset.data;
		request.owner = dataset.owner;
		//todo remove this
		request.env = "prod";

		if(dataset.id != undefined){
			url = url + '/' + dataset.id;
			return this.http.put(url,request, null).map(response => response.json());
			//return restObj.customPUT(request, dataset.id, undefined, {'Content-Type': 'application/json'});
		}else{
			
			return this.http.post(url,request, null).map(response => response.json());
			//return restObj.customPOST(request,undefined, undefined, {'Content-Type': 'application/json'});
		}
	}
}
