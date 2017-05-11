import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
	selector: 'column-visibility',
	templateUrl: './column-visibility.component.html',
	styleUrls: ['./column-visibility.component.css']
})

export class ColumnVisibilityComponent {

	public columns;

	constructor(public dialogRef: MdDialogRef<ColumnVisibilityComponent>) { }
}
