import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';

@Injectable()
export class OpenService {

	constructor(private restangular:Restangular) { }

	open(datasetId:string){
		let element = this.restangular.one("cfg-task-service/service/datasets/" + datasetId).get();

		return element;
	}

}
