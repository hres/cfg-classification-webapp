import { Component, ViewChild, ViewContainerRef, AfterViewInit  } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular/main'; 

@Component({
  selector: 'string-editor',
  template: `<input #input class="ag-cell-edit-input" type="text"
					[(ngModel)]="valueObj.value"/>
			`
})

export class StringEditorComponent implements ICellEditorAngularComp, AfterViewInit {
	private params:any;
	public valueObj = {value:null, modified:false};
	private oldValue:any;
	private cancelBeforeStart: boolean = false;

	@ViewChild('input', {read: ViewContainerRef})
	public input;
	
	constructor(){}

	agInit(params:any):void{
		this.params = params;
		this.valueObj = this.params.node.data[params.column.colId];
	}

	getValue():any{
		if(this.valueObj.value !== this.oldValue){
			this.params.value = this.valueObj;
			this.params.value.value = this.valueObj.value;
			this.params.value.modified = true;
			this.params.context.mainInterface.modified = true;
		} 
		
		return this.valueObj;
	}

	ngAfterViewInit(){
		this.oldValue = this.valueObj.value;
		this.input.element.nativeElement.focus();
	}

	isCancelBeforeStart():boolean{
		return this.cancelBeforeStart;
	}
}
