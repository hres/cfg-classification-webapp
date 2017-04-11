import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from "ag-grid-angular/main";

@Component({
  selector: 'datasets-action',
  template: `<span (click)="invokeParentMethod()" class="glyphicon glyphicon-eye-open"></span><span class="wb-inv">Open</span>`
})

export class DatasetsActionComponent implements ICellRendererAngularComp {
	public params: any;

	agInit(params: any): void {
		this.params = params;
	}

	public invokeParentMethod() {
		this.params.context.componentParent.openDataset(this.params.value);
	}

}
