import { Component }													from '@angular/core';
import { AgFilterComponent }											from 'ag-grid-angular';
import { IFilterParams, IDoesFilterPassParams, IAfterGuiAttachedParams }from 'ag-grid';

@Component({
	selector: 'app-missing-boolean-filter',
	template:	`<div style="padding-bottom:20px">
					<select class="ag-filter-select" #select
						(change)="onChange($event.target.value)">
						<option value="all">All</option>
						<option value="missing">Missing</option>
						<option value="true">True</option>
						<option value="false">False</option>
					</select>
				</div>`,
	styleUrls: ['./missing-boolean-filter.component.css']
})

export class MissingBooleanFilter implements AgFilterComponent {
	private filterParams:IFilterParams;
	private filterType:string;

	agInit(params:IFilterParams) {
		this.filterParams = params;
	}

	isFilterActive():boolean{
		return this.filterType != undefined && this.filterType != 'all';
	}

	doesFilterPass(params:IDoesFilterPassParams):boolean{
		var nodeValue:any = this.filterParams.valueGetter(params.node);

		if(this.filterType == 'missing'){
			return nodeValue.value == null;
		}else if(this.filterType == 'true'){
			return nodeValue.value == true;
		}else if(this.filterType == 'false'){
			return nodeValue.value == false;
		}
	}

	getModel():any{
		console.log('getModel()');
		return {value: 'toDo'};
	}

	setModel(model:any):void{
		console.log('setModel: todo');
	}

	private onChange(selectValue):void{
		this.filterType = selectValue;
		this.filterParams.filterChangedCallback();
	}
}
