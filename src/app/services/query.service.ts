import { Injectable } from '@angular/core';
import { CfgItem } from '../dtos/cfgitem';
import { CFGITEMS } from './mock-data';
import { Restangular } from 'ng2-restangular';
import { CfgRequest } from '../dtos/cfg-request';

@Injectable()
export class QueryService {

	cfgRequest:CfgRequest;

	constructor(private restangular:Restangular){ }

	getData(): Promise<CfgItem[]>{
		return Promise.resolve(CFGITEMS);
	}

	search(){
		let queryString = "fm/service/datasets/search?";

		//set source
		if(this.cfgRequest.source == 1)
			queryString += "&source=food";
		else if(this.cfgRequest.source == 2)
			queryString += "&source=recipe";

		// set name
		if (this.cfgRequest.name != null)
			queryString += "&name=" + this.cfgRequest.name;

		// set code
		if (this.cfgRequest.code != null)
			queryString += "&code=" + this.cfgRequest.code;

		// set subGroupCode
		if (this.cfgRequest.subGroupCode != null)
			queryString += "&subGroupCode=" + this.cfgRequest.subGroupCode;

		// set commit begin date
		if (this.cfgRequest.commitDateBegin != null)
			queryString += "&commitDateBegin=" + this.cfgRequest.commitDateBegin;

		// set commit end date
		if (this.cfgRequest.commitDateEnd != null)
			queryString += "&commitDateEnd=" + this.cfgRequest.commitDateEnd;

		// set cnfCode
		if (this.cfgRequest.cnfCode != null)
			queryString += "&cnfCode=" + this.cfgRequest.cnfCode;

		// set cfgTier
		if (this.cfgRequest.cfgTier != null)
			queryString += "&cfgTier=" + this.cfgRequest.cfgTier;

		// set rollUp
		if (this.cfgRequest.rollUp != null && this.cfgRequest.rollUp != 0)
			queryString += "&rollUp=" + this.cfgRequest.rollUp;

		// set containsAdded
		if (this.cfgRequest.containsAdded.length > 0){
			queryString += "&containsAdded=[";

			for (let item of this.cfgRequest.containsAdded){
				queryString += item;
			}

			queryString += "]";
		}

		// set missing values
		if (this.cfgRequest.missing.length > 0){
			queryString += "&missing=[";

			for (let item of this.cfgRequest.missing){
				queryString += item + ",";
			}

			queryString += "]"
		}

		// set comments
		if (this.cfgRequest.comments != null){
			queryString += "&comments=" + this.cfgRequest.comments;
		}

		// set last updated search
		if (this.cfgRequest.lastUpdateDateBegin != null){
			queryString += "&lastUpdateDateBegin=" + this.cfgRequest.lastUpdateDateBegin;
			queryString += "&lastUpdateDateEnd=" + this.cfgRequest.lastUpdateDateEnd;

			queryString += "&lastUpdateFilter=[";

			for (let item of this.cfgRequest.lastUpdateFilter){
				queryString += item + ",";
			}

			queryString += "]";
		}

		queryString = queryString.replace(/\?\&/g, "?");
		queryString = queryString.replace(/,]/g, "]");

		//let element = this.restangular.one("fm/service/datasets/search?data-source=0&food-recipe-name=&food-recipe-code=&commit-date-from=&commit-date-to=&cnf-code=&subgroup-code=&cfg-tier=4&recipe=0&sodium=0&sugar=0&fat=0&transfat=0&caffeine=0&free-sugars=0&sugar-substitutes=0&comments=&last-update-date-From=&last-update-date-To=").get();
		let element = this.restangular.one(queryString).get();

		return element;
	}
}
