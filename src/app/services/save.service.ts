import { Injectable } from '@angular/core';
import { Restangular } from 'ng2-restangular';

@Injectable()
export class SaveService {

	constructor(private restangular:Restangular) { }

	save(dataset:any){
		let saveEndpoint = "cfg-task-service/service/datasets";

		let restObj = this.restangular.all(saveEndpoint);
	
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
