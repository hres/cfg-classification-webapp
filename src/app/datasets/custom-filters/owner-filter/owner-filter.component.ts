import { Component }													from '@angular/core';
import { AgFilterComponent }											from 'ag-grid-angular';
import { IFilterParams, IDoesFilterPassParams }from 'ag-grid';

@Component({
	selector: 'app-owner-filter',
	template:	`<div style="padding-bottom:20px">
					<select class="ag-filter-select" #select
						(change)="onChange($event.target.value)">
						<option>All</option>
						<option *ngFor="let owner of ownersList">{{owner}}</option>
					</select>
				</div>`,
	styleUrls: ['./owner-filter.component.css']
})

export class OwnerFilter implements AgFilterComponent {
	private filterParams:IFilterParams;
	private ownerFilter:string = 'all';
	private ownersList:string[];

	agInit(params:IFilterParams) {
		this.filterParams = params;
		this.ownersList = this.filterParams.context.componentParent.ownersList;
	}

	isFilterActive():boolean{
		return this.ownerFilter != undefined && this.ownerFilter != 'All';
	}

	doesFilterPass(params:IDoesFilterPassParams):boolean{
		var nodeValue:any = this.filterParams.valueGetter(params.node);

		return nodeValue == this.ownerFilter;
	}

	getModel():any{
		console.log('getModel()');
		return {value: 'toDo'};
	}

	setModel(model:any):void{
		console.log('OwnerFilter.setModel: todo');
	}

	private onChange(selectValue):void{
		this.ownerFilter = selectValue;
		this.filterParams.filterChangedCallback();
	}
}
