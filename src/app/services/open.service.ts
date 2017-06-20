import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { environment } from '../../environments/environment';

@Injectable()
export class OpenService {

	constructor(private restangular:Restangular) { }

	open(datasetId:string){
		let element = this.restangular.oneUrl('open', environment.servicesUrl + "service/datasets/" + datasetId).get();

		return element;
	}

}
