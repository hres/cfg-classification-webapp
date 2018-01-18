import { Component, OnInit, ViewChild, AfterContentChecked, ElementRef } from '@angular/core';
import { GridOptions } from 'ag-grid';
import { Dataset } from '../dtos/dataset';

import { DatasetsService } 	from '../services/datasets.service';
import { DeleteService } 	from '../services/delete.service';
import { SaveService  } 	from '../services/save.service';
import { CfgModel }			from '../model/cfg.model';

import { DatasetsActionComponent } from './datasets-action/datasets-action.component';
import { Router } from '@angular/router';

import { OwnerFilter } 		from './custom-filters/owner-filter/owner-filter.component';
import { OwnerEditor  } 	from './custom-editors/owner-editor/owner-editor.component';
import { StatusFilter } 	from './custom-filters/status-filter/status-filter.component';
import * as moment from 'moment';

@Component({
	selector: 'app-datasets',
	templateUrl: './datasets.component.html',
	styleUrls: ['./datasets.component.css'],
	providers: [DatasetsService,DeleteService,SaveService]
})

export class DatasetsComponent implements OnInit, AfterContentChecked {
	@ViewChild('agGrid')
	agGrid;
	
	private gridOptions: GridOptions;
	gridData: Dataset[];
	height=200;
	selectedShowDataset:string = "all";

	private ownersList:string[] = [];
	private statusList:string[] = [];

	constructor(private datasetsService: DatasetsService,
				private router:Router,
				private deleteService:DeleteService,
				private cfgModel:CfgModel,
				private saveService:SaveService,
				private element:ElementRef) {

		this.gridOptions ={
			context:{componentParent:this},
			enableFilter: true,
			enableSorting: true,
			isExternalFilterPresent: this.isExternalFilterPresent.bind(this),
			doesExternalFilterPass: this.doesExternalFilterPass.bind(this),
			onCellValueChanged: this.onCellValueChanged
		};

		this.gridOptions.columnDefs=[
			{
				headerName: "Name",
				editable: this.isNameEditable,
				field: "name",
				width: 200,
			},
			{
				headerName: "Owner",
				cellEditorFramework: OwnerEditor,
				editable: this.cfgModel.isCfgAdmin,
				field: "owner",
				filterFramework: OwnerFilter,
				minWidth: 160,
				width: 110
			},
			{
				headerName: "Status",
				field: "status",
				filterFramework: StatusFilter,
				width: 190
			},
			{
				headerName: "Comments",
				editable: this.isCommentsEditable,
				field: "comments",
				width: 250
			},
			{
				headerName: "Last Update Date",
				field: "modifiedDate",
				valueFormatter: this.getDate,
				width: 250
			},
			{
				cellRendererFramework: DatasetsActionComponent,
				headerName: "Action",
				field: "id",
				minWidth: 190,
				suppressFilter: true,
				suppressSorting: true,
				width:190
			}
		]	
	}

	private isNameEditable(value):boolean{
		if(value.node.data.owner == value.context.componentParent.cfgModel.userFullName &&
			(value.context.componentParent.cfgModel.isCfgAdmin || 
			 value.context.componentParent.cfgModel.isAnalyst)
		){
			return true;
		}
		return false;
	}
	
	private isCommentsEditable(value):boolean{
		return value.context.componentParent.isNameEditable(value);
	}

	private onCellValueChanged(event){
		if (event.newValue != event.oldValue){
			(<any>this).context.componentParent.saveService.save(event.data).subscribe(
				(res) => {
					console.log(res);
				},
				(err) => {
					console.log(err);
				}
			);	
		}
	}

	ngOnInit() {
		let body = document.getElementsByTagName('body')[0];
		body.setAttribute("style","background-color:#d9edf7");//light blue
		this.cfgModel.sandboxMode = false;
		this.cfgModel.datasetId = undefined;

		this.getDatasets();
	}

	ngAfterContentChecked(){
		if(this.agGrid._nativeElement.querySelector('.ag-body-container')){
			// the 110 below is hardcoded for now, it is the header height + the element padding-top
			this.height = 110 + this.agGrid._nativeElement.querySelector('.ag-body-container').offsetHeight;
			this.gridOptions.api.sizeColumnsToFit();
		}
	}

	private	getDatasets(){
		this.datasetsService.getDatasets('prod').subscribe(
			(res) => {
				this.gridOptions.api.setRowData(res);
				this.gridOptions.api.sizeColumnsToFit();
				this.buildOwnersList();
				this.buildStatusList();
			},
			(err) => {
				console.log(err);
			});
	}

	public openDataset(datasetId:string, sandboxMode:boolean=false){
		this.cfgModel.sandboxMode = sandboxMode;

		if(sandboxMode){
			let body = document.getElementsByTagName('body')[0];
			body.setAttribute("style","background-color:#dff0d8");
		}

		this.router.navigate(['/main', datasetId]);
	}

	private deleteId:string;
	private deleteDataset(id:string){
		this.deleteId = id;
		this.element.nativeElement.dispatchEvent(new CustomEvent('popup', {
			detail:{message: "Are you sure you want to permanently delete dataset?",
				showYesButton: true,
				showNoButton: true,
				callback: this.deleteConfirmed},
			bubbles:true
		}));
	}

	private deleteConfirmed = () => {
		this.deleteService.delete(this.deleteId).subscribe(
			(res) => {
				this.getDatasets();
			},
			(err) => {
				console.log(err);
			}
		)
	}
	
	private isExternalFilterPresent(){
		return this.selectedShowDataset == 'myDatasets' || 
				!(this.cfgModel.isCfgAdmin || this.cfgModel.isAnalyst);
	}

	private doesExternalFilterPass(node){
		// If you are a viewer you can't see the in "Review" datasets
		if (!(this.cfgModel.isCfgAdmin || this.cfgModel.isAnalyst)){
			return node.data.status == "Review" ? false : true;
		}
		else if(this.cfgModel.isCfgAdmin){
			return node.data.status == "Pending Validation" ||
					node.data.status == "Validated" ||
					node.data.owner == this.cfgModel.userFullName;
		}
		else if(this.cfgModel.isAnalyst){
			return (node.data.status == "In Progress" || node.data.status == "Review") &&
					node.data.owner == this.cfgModel.userFullName;
		}
		return false;
	}

	private onShowChange(event){
		this.gridOptions.api.onFilterChanged();
	}

	//build the ownersList[] 
	private buildOwnersList(){
		this.ownersList=[];
		this.gridOptions.api.forEachNode(
			(node) => {
				if(!this.ownersList.some(x => x === node.data.owner)){
					this.ownersList.push(node.data.owner);
				}
			}
		);

		if(!this.ownersList.some(x => x === this.cfgModel.userFullName)){
			this.ownersList.push(this.cfgModel.userFullName);
		}
	}

	private buildStatusList(){
		this.statusList=[];
		this.gridOptions.api.forEachNode(
			(node) => {
				if(!this.statusList.some(x => x === node.data.status)){
					this.statusList.push(node.data.status);
				}
			}
		);
	}

	private getDate(params){
		if(params.value == null)
			return null;
		else
			return moment(params.value).format('LL');
	}
}
