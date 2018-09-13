import { Dataset } from '../dtos/dataset';
import { Http } from '@angular/http';
import { Injectable, ElementRef } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { environment } from '../../environments/environment';

@Injectable()
export class DatasetsService {

	constructor(private http: Http) { };

	getDatasets(env:string): Observable<Dataset[]> {
        const url = environment.servicesUrl + "service/datasets?env=" + env;
        return this.http.get(url)
            .map(response => response.json());
    }

}

