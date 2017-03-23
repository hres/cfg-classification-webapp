import { Injectable } from '@angular/core';
import { Restangular } from 'ng2-restangular';

@Injectable()
export class SaveService {

	constructor(private restangular:Restangular) { }

	save(name:string, comments:string, data:any){
		let saveEndpoint = "fm/service/datasets";

		let element = this.restangular.one(saveEndpoint).post(data);
		
		return element;
	}
}
