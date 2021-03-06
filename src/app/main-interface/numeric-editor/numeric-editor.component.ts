import { Component, ViewContainerRef, ViewChild, AfterViewInit } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular/main';
import { MdTooltip } 				from '@angular/material';

@Component({
	selector: 'numeric-editor',
	template: `<input #input mdTooltip="Please enter only numeric characters 0-9."
					(keypress)="onKeyPress($event)"
					(blur)="onBlur($event)"
					[(ngModel)]="value">
				`
})

export class NumericEditorComponent implements ICellEditorAngularComp, AfterViewInit {
	private params: any;
	public value: number;
	private oldValue:number;
	private cancelBeforeStart: boolean = false;

	@ViewChild('input', {read: ViewContainerRef})
	public input;
	
	@ViewChild(MdTooltip)
	tooltip;

	constructor() { }

	agInit(params: any): void {
		this.params = params;
		this.value = this.params.value.value;
		// only start edit if key pressed is a number, not a letter
		// this.cancelBeforeStart = params.charPress && ('1234567890'.indexOf(params.charPress) < 0);
	}

	getValue(): any {
		if(this.value !== this.oldValue){
			this.params.value.value = this.value.toString() == '' ? null : this.value * 1;
			this.params.value.modified = true;
		}
	
		return this.params.value;
	}

	isCancelBeforeStart(): boolean {
		return this.cancelBeforeStart;

	}

	// will reject the number if it greater than 1,000,000
	// not very practical, but demonstrates the method.
	isCancelAfterEnd(): boolean {
		return this.value > 1000000;
	};

	onKeyPress(event): void {
		if (!this.isKeyPressedNumeric(event)) {
			event.stopImmediatePropagation();
			this.tooltip.show();

			if (event.preventDefault) event.preventDefault();
		}
	}

	onBlur(event):void{
		this.params.stopEditing();
	}

	// dont use afterGuiAttached for post gui events - hook into ngAfterViewInit instead for this
	ngAfterViewInit() {
		this.oldValue = this.value;
		this.input.element.nativeElement.focus();
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
		return this.isCharNumeric(charStr) || charCode == 8;
	}
}
