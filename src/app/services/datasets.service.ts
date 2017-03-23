import { Injectable } from '@angular/core';
import { Dataset } from '../dtos/dataset';
import { DATASETS } from './mock-datasets';
import { Restangular } from 'ng2-restangular';

@Injectable()
export class DatasetsService {

	constructor(private restangular:Restangular) { }

	getDatasets(): Promise<Dataset[]>{
		let element = this.restangular.one("fm/service/datasets/search?data-source=0&food-recipe-name=&food-recipe-code=&commit-date-from=&commit-date-to=&cnf-code=&subgroup-code=&cfg-tier=4&recipe=0&sodium=0&sugar=0&fat=0&transfat=0&caffeine=0&free-sugars=0&sugar-substitutes=0&comments=&last-update-date-From=&last-update-date-To=").get();

		return Promise.resolve(DATASETS);
	}
}
