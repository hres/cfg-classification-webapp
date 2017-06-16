import { Component, ViewChild } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular/main';

@Component({
	selector: 'boolean-cell',
	template: 	`<md-select #mdSelect [(ngModel)]="value" (onClose)="onClose()">
					<md-option [value]=true>true</md-option>
					<md-option [value]=false>false</md-option>
				</md-select>`,
	styleUrls: ['./boolean-editor.component.css']
})

export class BooleanEditorComponent implements ICellEditorAngularComp {
	private params:any;
	public value:boolean;
	private oldValue:boolean;

	@ViewChild('mdSelect')
	mdSelect;

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
		this.mdSelect.open();
	}

	onClose(event){
		this.params.api.stopEditing();
	}
}
