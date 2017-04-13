import { Component, ViewChild } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular/main';

@Component({
	selector: 'boolean-cell',
	template: 	`<select #select [(ngModel)]="value" style="width:100%">
					<option [ngValue]="true">true</option>
					<option [ngValue]="false">false</option>
				</select>` 
})

export class BooleanEditorComponent implements ICellEditorAngularComp {
	private params:any;
	value:boolean;

	@ViewChild('select')
	input;

	constructor() { }

	agInit(params:any):void{
		this.params = params;
		this.value = this.params.value;
	}

	getValue(): boolean{
		return this.value;
	}

	ngAfterViewInit(){
		this.input.nativeElement.focus();
	}
}
