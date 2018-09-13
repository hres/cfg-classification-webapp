import { Injectable} from '@angular/core';
import { environment } from '../../environments/environment';
import { Http } from '@angular/http';

@Injectable()
export class RulesetsService {

	constructor(private http: Http) { };

	getRulesets(){
        const url = environment.servicesUrl + "service/rulesets";
        return this.http.get(url)
            .map(response => response.json());
    }
	
	
	
	deleteRuleset(id:string){
		
		let deleteEndpoint = environment.servicesUrl + "service/rulesets/" + id;

		return this.http.delete(deleteEndpoint).map(response => response.json());
	}

	promoteRuleset(rulesetId:string){
		let rulesetEndpoint:string = "service/rulesets";
		let url = environment.servicesUrl + rulesetEndpoint + '/' + rulesetId;
		
		let request:any = {};
		request.isProd = true;
		
		return this.http.put(url,request, undefined).map(response => response.json());
	}

	viewRuleset(rulesetId:string){

		let rulesetEndpoint:string = "service/rulesets";
		let url = environment.servicesUrl + rulesetEndpoint + '/' + rulesetId ;
		
		let request:any = {};
		//request.isProd = true;
		console.log("call viewRleset with...===.");

	
		
		return this.http.get(url).map(response => response.json());
	}
	
}
