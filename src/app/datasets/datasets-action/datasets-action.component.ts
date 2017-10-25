import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from "ag-grid-angular/main";

@Component({
	selector: 'datasets-action',
	template: `<span (click)="openDataset()"
					class="glyphicon glyphicon-eye-open action-icon" 
					style="color:#31708f;cursor:pointer">Prod
				</span>
				<span class="wb-inv">Open Production</span>
				<span *ngIf="status=='Validated' && params.context.componentParent.cfgModel.isCfgAdmin;else hideSandbox" (click)="openDataset(true)"
					class="glyphicon glyphicon-eye-open action-icon"
					style="color:#3c763d;cursor:pointer">Sandbox
				</span>
				<ng-template #hideSandbox>
					<span class="glyphicon glyphicon-eye-open action-icon" style="visibility:hidden">Sandbox</span>
				</ng-template>
				<span *ngIf="status=='Validated' && params.context.componentParent.cfgModel.isCfgAdmin" class="wb-inv">Open Sandbox</span>
				<span *ngIf="params.context.componentParent.cfgModel.isCfgAdmin || params.context.componentParent.cfgModel.userFullName == params.data.owner" (click)="deleteDataset()"
					class="glyphicon glyphicon-trash action-icon"
					style="color:#a94442;cursor:pointer">Delete
				</span>
				<span *ngIf="params.context.componentParent.cfgModel.isCfgAdmin || params.context.componentParent.cfgModel.userFullName == params.data.owner" class="wb-inv">Delete Dataset</span>`,
	styleUrls:['./datasets-action.component.css']
})

export class DatasetsActionComponent implements ICellRendererAngularComp {
	public params: any;
	private status:string;

	agInit(params: any): void {
		this.params = params;
		this.status = params.data.status;
	}

	public openDataset(sandboxMode:boolean=false) {
		this.params.context.componentParent.openDataset(this.params.value, sandboxMode);
	}

	private deleteDataset(){
		this.params.context.componentParent.deleteDataset(this.params.value);
	}
}
