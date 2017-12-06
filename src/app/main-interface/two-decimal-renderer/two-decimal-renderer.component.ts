import { Component } 		from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular/main';

@Component({
	selector: 'app-two-decimal-renderer',
	template: `{{roundToTwo()}}`,
	styleUrls: ['./two-decimal-renderer.component.css']
})

export class TwoDecimalRendererComponent implements ICellRendererAngularComp {
	private params:any;

	agInit(params:any):void {
		this.params = params;
	}

	refresh(params:any):boolean{
		return false;
	}

	roundToTwo():any{
		return this.params.value ? Math.floor(this.params.value.value*100)/100 : null;
	}
}
