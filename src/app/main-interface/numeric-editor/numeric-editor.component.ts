import { Component, ViewContainerRef, ViewChild, AfterViewInit } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular/main';
import { MatTooltip } 				from '@angular/material';

@Component({
	selector: 'numeric-editor',
	template: `<input #input matTooltip="Please enter only numeric characters 0-9."
					(keypress)="onKeyPress($event)"
					[(ngModel)]="valueObj.value"/>
				`
})

export class NumericEditorComponent implements ICellEditorAngularComp, AfterViewInit {
	private params: any;
	public valueObj = {value:null, modified:false};
	private oldValue:number;
	private cancelBeforeStart: boolean = false;

	@ViewChild('input', {read: ViewContainerRef})
	public input;
	
	@ViewChild(MatTooltip)
	tooltip;

	constructor() { }

	agInit(params: any): void {
		this.params = params;
		this.valueObj = this.params.node.data[params.column.colId];
		// only start edit if key pressed is a number, not a letter
		// this.cancelBeforeStart = params.charPress && ('1234567890'.indexOf(params.charPress) < 0);
	}

	getValue(): any {
		if(this.valueObj.value !== this.oldValue){
			this.params.value = this.valueObj;
			this.params.value.value = this.valueObj.value.toString() == '' ? null : this.valueObj.value * 1;
			this.params.value.modified = true;
			this.params.context.mainInterface.modified = true;
		}
	
		return this.valueObj;
	}

	ngAfterViewInit() {
		this.oldValue = this.valueObj.value;
		this.input.element.nativeElement.focus();
	}

	isCancelBeforeStart(): boolean {
		return this.cancelBeforeStart;
	}

	// will reject the number if it greater than 1,000,000
	// not very practical, but demonstrates the method.
	isCancelAfterEnd(): boolean {
		return this.valueObj.value > 1000000;
	};

	onKeyPress(event): void {
		if (!this.isKeyPressedNumeric(event)) {
			event.stopImmediatePropagation();
			this.tooltip.show();

			if (event.preventDefault) event.preventDefault();
		}
	}

	private getCharCodeFromEvent(event): any {
		event = event || window.event;
		return (typeof event.which == "undefined") ? event.keyCode : event.which;
	}

	private isCharNumeric(charStr): boolean {
		return !!/\d/.test(charStr);
	}

	private isKeyPressedNumeric(event): boolean {
		var charCode = this.getCharCodeFromEvent(event);
		var charStr = String.fromCharCode(charCode);
		return this.isCharNumeric(charStr) || charCode == 8 || charCode == 46;
	}
}
