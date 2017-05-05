import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from "ag-grid-angular/main";

@Component({
  selector: 'datasets-action',
  template: `<span (click)="invokeParentMethod()" class="glyphicon glyphicon-eye-open"> Prod</span>
			<span class="wb-inv">Open Production</span>
			<span *ngIf="status=='Pending Validation'" (click)="invokeParentMethod()" class="glyphicon glyphicon-eye-open"> Sandbox</span>
			<span class="wb-inv">Open Sandbox</span>
			<span (click)="deleteDataset()" class="glyphicon glyphicon-trash"> Delete</span>`
})

export class DatasetsActionComponent implements ICellRendererAngularComp {
	public params: any;

	agInit(params: any): void {
		this.params = params;
	}

	public invokeParentMethod() {
		this.params.context.componentParent.openDataset(this.params.value);
	}

	private deleteDataset(){
		this.params.context.componentParent.deleteDataset(this.params.value);
	}
}
