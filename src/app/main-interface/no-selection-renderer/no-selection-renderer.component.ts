import { Component } 		from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular/main';

@Component({
	selector: 'app-no-selection-renderer',
	template: `{{roundToTwo()}}`,
	styleUrls: ['./no-selection-renderer.component.css']
})

export class NoSelectionRendererComponent implements ICellRendererAngularComp {
	private params:any;

	agInit(params:any):void {
		this.params = params;
		this.params.eGridCell.addEventListener('mousedown', this.onMouseDown);
	}

	private onMouseDown($event){
		console.log('onMouseDown');
		event.preventDefault();
		event.stopImmediatePropagation();
	}

	refresh(params:any):boolean{
		return false;
	}

	roundToTwo(something):any{
		if(isNaN(this.params.value))
			return this.params.value;
		else
			return Math.floor(this.params.value*100)/100;
	}
}
