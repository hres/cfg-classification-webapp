import { Injectable } from '@angular/core';
//import { Restangular }	from 'ngx-restangular';
import { environment }	from '../../environments/environment';
import { Http, RequestOptions, Headers } from '@angular/http';

@Injectable()
export class CommitService {

	constructor(private http:Http) { };

	commit(changedTierFoods:any, datasetId:string){

		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		let commitEndpoint = "service/datasets/" + datasetId + '/commit';

		let url = environment.servicesUrl + commitEndpoint;
		
		return this.http.post(url,changedTierFoods, null).map(response => response.json());

	}
}
