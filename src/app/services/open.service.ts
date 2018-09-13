/*
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
*/
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Restangular } from 'ngx-restangular';
import { environment } from '../../environments/environment';

@Injectable()
export class OpenService {

	constructor(private http: Http) { };

	open(datasetId:string){
        const url = environment.servicesUrl + "service/datasets/" + datasetId;
        return this.http.get(url)
            .map(response => response.json());
    }

}