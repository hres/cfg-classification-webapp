import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { environment } from '../../environments/environment';

@Injectable()
export class DeleteService {

	constructor(private restangular:Restangular) { }

	delete(id:string){
		let restObj = this.restangular.oneUrl('delete', environment.servicesUrl + "service/datasets/" + id).remove();

		return restObj;
	}

}
