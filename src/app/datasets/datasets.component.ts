import { Component, OnInit, ViewChild, AfterContentChecked, ElementRef } from '@angular/core';
import { GridOptions } from 'ag-grid';
import { Dataset } from '../dtos/dataset';

import { DatasetsService } 	from '../services/datasets.service';
import { DeleteService } 	from '../services/delete.service';
import { SaveService  } 	from '../services/save.service';
import { CfgModel }			from '../model/cfg.model';

import { DatasetsActionComponent } from './datasets-action/datasets-action.component';
import { Router } from '@angular/router';

@Component({
	selector: 'app-datasets',
	templateUrl: './datasets.component.html',
	styleUrls: ['./datasets.component.css'],
	providers: [DatasetsService,DeleteService,SaveService]
})

export class DatasetsComponent implements OnInit, AfterContentChecked {
	@ViewChild('agGrid')agGrid;any

	private gridOptions: GridOptions;
	gridData: Dataset[];
	height=200;

	constructor(private datasetsService: DatasetsService,
		private router:Router,
		private deleteService:DeleteService,
		private cfgModel:CfgModel,
		private saveService:SaveService,
		private element:ElementRef) {
		this.gridOptions = <GridOptions>{
			context:{componentParent:this},
			enableFilter: true,
			enableSorting: true,
			onCellValueChanged: this.onCellValueChanged
		};
		this.gridOptions.columnDefs=[
			{
				headerName: "Name",
				editable: true,
				field: "name",
				width: 200,
			},
			{
				headerName: "Owner",
				field: "owner",
				minWidth: 160,
				width: 110
			},
			{
				headerName: "Status",
				field: "status",
				width: 190
			},
			{
				headerName: "Comments",
				editable: true,
				field: "comments",
				width: 250
			},
			{
				headerName: "Last Update Date",
				field: "modifiedDate",
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
}
