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
		this.value = this.decode(this.params.value);
	}

	getValue():any{
		return this.value != this.oldValue ? '&edited=true;' + this.value : this.value;
	}

	ngAfterViewInit(){
		this.oldValue = this.value;
		this.input.element.nativeElement.focus();
	}

	decode(value:string){
		if(value ==null){
			return null;
		}else if(value.indexOf("&edited=true;")>-1){
			return value.replace('&edited=true;','');
		}else{
			return value;
		}
	}

}
