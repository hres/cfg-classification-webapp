import { Dataset } from '../dtos/dataset';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

@Injectable()
export class DeleteService {

	constructor(private http:Http) { };

	delete(id:string){

		let deleteEndpoint = environment.servicesUrl + "service/datasets/" + id;

		return this.http.delete(deleteEndpoint).map(response => response.json());
	}

}