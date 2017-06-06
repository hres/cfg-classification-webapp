import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
	selector: 'app-save-view',
	templateUrl: './save-view.component.html',
	styleUrls: ['./save-view.component.css']
})
export class SaveViewComponent {

	datasetName:string;
	datasetComments:string;

	constructor(public dialogRef: MdDialogRef<SaveViewComponent>) { }

	onSaveClose():any{
		let retObj = {
			datasetName: this.datasetName,
			datasetComments: this.datasetComments
		};
		return retObj;
	}
}
