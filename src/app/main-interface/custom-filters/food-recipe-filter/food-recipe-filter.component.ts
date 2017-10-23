import { Component }							from '@angular/core';
import { AgFilterComponent }					from 'ag-grid-angular/main';
import { IFilterParams, IDoesFilterPassParams }	from 'ag-grid/main';

@Component({
	selector: 'app-food-recipe-filter',
	template:	`<div style="padding-bottom:20px">
					<select class="ag-filter-food-recipe" #select
						(change)="onChange($event.target.value)">
						<option value="all">All</option>
						<option value="food">Food</option>
						<option value="recipe">Recipe</option>
					</select>
				</div>`,
	styleUrls: ['./food-recipe-filter.component.css']
})

export class FoodRecipeFilter implements AgFilterComponent {
	private filterParams:IFilterParams;
	private filterType:string = 'all';

	agInit(params:IFilterParams) {
		this.filterParams = params;
	}

	isFilterActive():boolean{
		return this.filterType != undefined && this.filterType != 'all';
	}

	doesFilterPass(params:IDoesFilterPassParams):boolean{
		var nodeValue:any = this.filterParams.valueGetter(params.node);

		return nodeValue == this.filterType;
	}

	getModel():any{
		console.log('getModel()');
		return {value: 'toDo'};
	}

	setModel(model:any):void{
		console.log('FoodRecipeFilter.setModel: todo');
	}

	private onChange(selectValue):void{
		this.filterType = selectValue;
		this.filterParams.filterChangedCallback();
	}
}
