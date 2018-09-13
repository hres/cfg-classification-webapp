import { Component } 		from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
	selector: 'app-two-decimal-renderer',
	template: `{{roundToTwo()}}`,
	styleUrls: ['./two-decimal-renderer.component.css']
})

export class TwoDecimalRendererComponent implements ICellRendererAngularComp {
	private params:any;

	agInit(params:any):void {
		this.params = params;
		params.eGridCell.style.textAlign = 'right';
	}

	refresh(params:any):boolean{
		return false;
	}

	roundToTwo():any{
		if(this.params.value==null)
			return null;
		else
			return Math.floor(this.params.value*100)/100;
	}

}
