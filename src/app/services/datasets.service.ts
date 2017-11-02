import { Injectable } from '@angular/core';
import { Dataset } from '../dtos/dataset';
import { Restangular } from 'ngx-restangular';
import { environment } from '../../environments/environment';

@Injectable()
export class DatasetsService {

	constructor(private restangular:Restangular) { }

	getDatasets(env:string){
		let element = this.restangular.oneUrl('datasets',environment.servicesUrl + "service/datasets?env=" + env).get();
		
		return element;
	}
}
