import { Component, ViewChild } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular/main';

@Component({
	selector: 'boolean-cell',
	template: 	`<mat-select #mdSelect [(ngModel)]="value" (onClose)="onClose()">
					<mat-option [value]=true>true</mat-option>
					<mat-option [value]=false>false</mat-option>
				</mat-select>`,
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
		this.oldValue = this.value;
	}

	getValue(): boolean{
		if(this.value != this.oldValue){
			this.params.value.value = this.value;
			this.params.value.modified = true;
			this.params.context.mainInterface.modified = true;
		}

		this.input.element.nativeElement.dispatchEvent(
			new CustomEvent(
				'valueChanged',
				{
					detail:{
						colId: this.params.column.colId,
						node: this.params.node
					},
					bubbles:true
				}
			)
		)

		return this.params.value;
	}

	ngAfterViewInit(){
		this.mdSelect.open();
	}

	onClose(event){
		this.params.api.stopEditing();
	}
}
