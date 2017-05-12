import { Component, ViewChild, ViewContainerRef  } from '@angular/core';
import { AgEditorComponent } from 'ag-grid-angular/main'; 

@Component({
  selector: 'string-editor',
  template: `<input #input class="ag-cell-edit-input" type="text" [(ngModel)]="value"/>`
})

export class StringEditorComponent implements AgEditorComponent {
	private params:any;
	public value:string;
	private oldValue:string;

	@ViewChild('input', {read: ViewContainerRef})
	public input;
	
	agInit(params:any):void{
		this.params = params;
		this.value = this.params.value ? this.params.value.value:null;
	}

	getValue():any{
		if(this.value != this.oldValue){
			this.params.value.value = this.value;
			this.params.value.modified = true;
		} 
		
		return this.params.value;
	}

	ngAfterViewInit(){
		this.oldValue = this.value;
		this.input.element.nativeElement.focus();
	}

}
