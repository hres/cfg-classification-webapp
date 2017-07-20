import { Component } 													from '@angular/core';
import { AgFilterComponent }											from 'ag-grid-angular/main';
import { IFilterParams,IDoesFilterPassParams,IAfterGuiAttachedParams }	from 'ag-grid/main';

@Component({
	selector: 'app-missing-numeric-filter',
	template: 	`<div style="padding-bottom:20px">
					 <select class="ag-filter-select" #select id="filterType" 
						(change)="onChange($event.target.value)">
						<option value="all">All</option>
						<option value="equals">Equals</option>
						<option value="missing">Missing</option>
					</select>
				</div>`,
	styleUrls: ['./missing-numeric-filter.component.css']
})

export class MissingNumericFilter implements AgFilterComponent{
	private filterParams:IFilterParams;
	private filterType:string;

	agInit(params:IFilterParams):void {
		this.filterParams = params;
	}

	isFilterActive():boolean{
		return this.filterType != undefined && this.filterType != 'all';
	}

	doesFilterPass(params:IDoesFilterPassParams):boolean{
		var nodeValue:any = this.filterParams.valueGetter(params.node);

		return nodeValue.value == null;
	}

	getModel():any{
		return {value: 'getModel todo'};
	}

	setModel(model:any):void{
		console.log('setModel todo');
	}

	private onChange(newValue):void{
		console.log('onChange');
		this.filterType = newValue;
		this.filterParams.filterChangedCallback();
	}

}
