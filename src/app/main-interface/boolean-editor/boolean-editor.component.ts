import { Component, ViewChild } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular/main';

@Component({
	selector: 'boolean-cell',
	template: 	`<select #select [(ngModel)]="value" style="width:100%">
					<option [ngValue]=true>true</option>
					<option [ngValue]=false>false</option>
				</select>` 
})

export class BooleanEditorComponent implements ICellEditorAngularComp {
	private params:any;
	public value:boolean;
	private oldValue:boolean;

	@ViewChild('select')
	input;

	constructor() { }

	agInit(params:any):void{
		this.params = params;
		this.value = this.params.value ? this.params.value.value:null;
	}

	getValue(): boolean{
		if(this.value != this.oldValue){
			this.params.value.value = this.value;
			this.params.value.modified = true;
		}

		return this.params.value;
	}

	ngAfterViewInit(){
		this.oldValue = this.value;
		this.input.nativeElement.focus();
	}
}
