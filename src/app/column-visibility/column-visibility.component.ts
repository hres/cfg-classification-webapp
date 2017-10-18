import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
	selector: 'column-visibility',
	templateUrl: './column-visibility.component.html',
	styleUrls: ['./column-visibility.component.css']
})

export class ColumnVisibilityComponent {

	public columns;
	public datasetStatus;

	constructor(public dialogRef: MatDialogRef<ColumnVisibilityComponent>) { }
}
