import { Component } 		from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular/main';

@Component({
	selector: 'app-no-selection-renderer',
	template: `{{params.value}}`,
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

}
