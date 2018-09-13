import { Component }													from '@angular/core';
import { AgFilterComponent }											from 'ag-grid-angular';
import { IFilterParams, IDoesFilterPassParams, IAfterGuiAttachedParams }from 'ag-grid';

@Component({
	selector: 'app-missing-string-filter',
	template: `<div style="padding-bottom:20px">
					<select class="ag-filter-select" #select
						(change)="onChange($event.target.value)">
						<option value="all">All</option>
						<option value="missing">Missing</option>
					</select>
				</div>`,
	styleUrls: ['./missing-string-filter.component.css']
})

export class MissingStringFilter implements AgFilterComponent{
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
		return {value:'getModel todo'};
	}

	setModel(model:any):void{
		console.log('setModel todo');
	}	

	private onChange(selectValue):void{
		this.filterType = selectValue;
		this.filterParams.filterChangedCallback();
	}
}
