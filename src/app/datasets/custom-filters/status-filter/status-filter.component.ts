import { Component }							from '@angular/core';
import { AgFilterComponent }					from 'ag-grid-angular';
import { IFilterParams, IDoesFilterPassParams }	from 'ag-grid';

@Component({
	selector: 'app-status-filter',
	template:	`<div style="padding-bottom:20px">
					<select class="ag-filter-status" #select
						(change)="onChange($event.target.value)">
						<option>All</option>
						<option *ngFor="let status of statusList">{{status}}</option>
					</select>
				</div>`,
	styleUrls: ['./status-filter.component.css']
})

export class StatusFilter implements AgFilterComponent {
	private filterParams:IFilterParams;
	private statusFilter:string = 'All';
	private statusList:string[];

	agInit(params:IFilterParams) {
		this.filterParams = params;
		this.statusList = this.filterParams.context.componentParent.statusList;
	}

	isFilterActive():boolean{
		return this.statusFilter != undefined && this.statusFilter != 'All';
	}

	doesFilterPass(params:IDoesFilterPassParams):boolean{
		var nodeValue:any = this.filterParams.valueGetter(params.node);

		return nodeValue == this.statusFilter;
	}

	getModel():any{
		console.log('getModel()');
		return {value: 'toDo'};
	}

	setModel(model:any):void{
		console.log('StatusFilter.setModel: todo');
	}

	private onChange(selectValue):void{
		this.statusFilter = selectValue;
		this.filterParams.filterChangedCallback();
	}
}
