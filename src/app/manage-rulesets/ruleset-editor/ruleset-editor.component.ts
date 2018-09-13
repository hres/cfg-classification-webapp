import { Component, OnInit } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';

@Component({
	selector: 'app-ruleset-editor',
	styleUrls: ['./ruleset-editor.component.css'],
	template: `<input type="text" [(ngModel)]="value" (change)="onChange()" (focusOut)="onMouseOut()" style="width:100%">

	`
})

export class RulesetEditorComponent implements ICellEditorAngularComp {
	private params:any;
	value:string;

	agInit(params:any):void {
		this.params = params;
		this.value = params.value;
	}

	getValue(){
		return this.value;
	}

	onChange(){
		console.log('onChange');
		this.params.api.stopEditing();
	}

	onMouseOut(){
		console.log('onMOuseOut');
	}
}
