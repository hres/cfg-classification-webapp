import { Injectable } from '@angular/core';
import { Restangular } from 'ng2-restangular';

@Injectable()
export class DeleteService {

	constructor(private restangular:Restangular) { }

	delete(id:string){
		let restObj = this.restangular.one("cfg-task-service/service/datasets/" + id).remove();

		return restObj;
	}

}
