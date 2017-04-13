import { Injectable } from '@angular/core';
import { Restangular } from 'ng2-restangular';

@Injectable()
export class OpenService {

	constructor(private restangular:Restangular) { }

	open(datasetId:string){
		let element = this.restangular.one("cfg-task-service/service/datasets/" + datasetId).get();

		return element;
	}

}
