import { Component, ViewChild } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';

@Component({
	selector: 'owner-cell',
	template: 	`<mat-select #matSelect (onClose)="onClose()" [(ngModel)]="value">
					<mat-option *ngFor="let owner of ownersList" [value]="owner">{{owner}}</mat-option>
				</mat-select>`,
	styleUrls: ['./owner-editor.component.css']
})

export class OwnerEditor implements ICellEditorAngularComp {
	private params:any;
	public value:string;
	private oldValue:string;
	private ownersList:string[];

	@ViewChild('matSelect')
	matSelect;

	constructor() { }

	agInit(params:any):void{
		this.params = params;
		this.value = this.params.value ? this.params.value:null;
		this.ownersList = params.context.componentParent.ownersList;
	}

	getValue(): boolean{
		if(this.value != this.oldValue){
			this.params.value = this.value;
		}

		return this.params.value;
	}

	ngAfterViewInit(){
		this.oldValue = this.value;
		this.matSelect.open();
	}

	onClose(event){
		this.params.api.stopEditing();
	}
}
