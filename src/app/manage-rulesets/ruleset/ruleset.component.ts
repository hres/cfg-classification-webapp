import { Component, OnInit, HostBinding, HostListener } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
	selector: 'app-ruleset',
	styleUrls: ['./ruleset.component.css'],
	template: `<div (mouseover)="hovering=true;" (mouseout)="hovering=false;" >
					<label>{{params.value}}</label>
					<span (click)="onDeleteClick()" class="fa fa-lg fa-minus-circle" 
						[style.visibility]="hovering ? 'visible': 'hidden'"
						style="color:#a94442;cursor:pointer;float:right;padding-left:5px;padding-right:5px" matTooltip="Delete Ruleset" [matTooltipPosition]="position">
					</span>
					<span (click)="onPromoteClick()" class="fa fa-lg fa-gavel" 
						[style.visibility]="hovering ? 'visible': 'hidden'"
						style="color:#31708f;cursor:pointer;float:right;padding-right:5px" matTooltip="Set Product Ruleset"  [matTooltipPosition]="position" >
					</span>
					<span (click)="onViewClick()" class="glyphicon glyphicon-eye-open action-icon"  
						[style.visibility]="hovering ? 'visible': 'hidden'"
						style="color:#a94442;cursor:pointer;float:right;padding-left:5px;padding-left:5px;padding-right:5px" matTooltip="View Ruleset" [matTooltipPosition]="position">
					</span>
				</div>`
})

export class RulesetComponent implements ICellRendererAngularComp {
	params:any;
	hovering:boolean;
	position:String = "above";
	viewRuleset = "wma get get ruleset info...";

	
	constructor(){}

	agInit(params:any) {
		if(params.data.isProd){
			params.value+= " *";
		}

		this.params = params;
		this.params.eGridCell.addEventListener('click', (this.onClick).bind(this));
	}

	private onPromoteClick($event){
		event.stopPropagation();
		console.log('onPromoteClick()');
		this.params.context.componentParent.promoteRuleset(this.params.data.rulesetId);
	}
	
	private onDeleteClick($event){
		event.stopPropagation();
		this.params.context.componentParent.deleteRuleset(this.params.data.rulesetId);
	}

	private onViewClick($event){
		event.stopPropagation();
		console.log('onviewClick()');
		this.params.context.componentParent.viewRuleset(this.params.data.rulesetId);
	}

	private onClick($event:any){
		let startEditingParams = {
									rowIndex: this.params.rowIndex,
									colKey: this.params.colDef.field
		};
			
		this.params.api.startEditingCell(startEditingParams);
	}

	refresh(params:any):boolean{
		return false;
	}
}
