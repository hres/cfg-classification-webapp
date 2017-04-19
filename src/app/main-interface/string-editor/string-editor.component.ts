import { Component, ViewChild, ViewContainerRef  } from '@angular/core';
import { AgEditorComponent } from 'ag-grid-angular/main'; 

@Component({
  selector: 'string-editor',
  template: `<input #input class="ag-cell-edit-input" type="text" [(ngModel)]="value"/>`
})

export class StringEditorComponent implements AgEditorComponent {
	private params:any;
	public value:string;

	@ViewChild('input', {read: ViewContainerRef})
	public input;
	
	agInit(params:any):void{
		this.params = params;
	}

	getValue():any{
		return '&edited=true;' + this.value;
	}

	ngAfterViewInit(){
		this.input.element.nativeElement.focus();
	}

}
