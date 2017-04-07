import { Injectable } from '@angular/core';
import { Dataset } from '../dtos/dataset';
import { DATASETS } from './mock-datasets';
import { Restangular } from 'ng2-restangular';

@Injectable()
export class DatasetsService {

	constructor(private restangular:Restangular) { }

	getDatasets(env:string){
		let element = this.restangular.one("cfg-task-service/service/datasets?env=" + env).get();
		
		return element;
		//return Promise.resolve(DATASETS);
	}
}
