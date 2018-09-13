import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from "ag-grid-angular";

@Component({
	selector: 'datasets-action',
	template: `<span *ngIf="canEdit();else hideOpenProd"(click)="openDataset()"
					class="glyphicon glyphicon-eye-open action-icon" 
					style="color:#31708f;cursor:pointer">Prod
				</span>
				<ng-template #hideOpenProd>
					<span class="glyphicon glyphicon-eye-open action-icon" style="visibility:hidden">Prod</span>
				</ng-template>
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

	private canEdit():boolean{
		if(this.params.context.componentParent.cfgModel.isCfgAdmin){
			return true;
		}else if(this.params.context.componentParent.cfgModel.isAnalyst &&	(this.status == "In Progress" || this.status == "Review")){
			return true;
		}else if(!this.params.context.componentParent.isCfgAdmin && !this.params.context.componentParent.isAnalyst){ // is a Reader only
			return true;
		}

		return false;
	}

	refresh(params:any):boolean{
		return false;
	}
}
