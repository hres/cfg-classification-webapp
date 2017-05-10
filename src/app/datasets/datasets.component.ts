import { Component, OnInit, ViewChild, AfterContentChecked } from '@angular/core';
import { GridOptions } from 'ag-grid';
import { Dataset } from '../dtos/dataset';

import { DatasetsService } from '../services/datasets.service';
import { DeleteService } from '../services/delete.service';
import { CfgModel }			from '../model/cfg.model';

import { DatasetsActionComponent } from './datasets-action/datasets-action.component';
import { Router } from '@angular/router';

@Component({
	selector: 'app-datasets',
	templateUrl: './datasets.component.html',
	styleUrls: ['./datasets.component.css'],
	providers: [DatasetsService,DeleteService]
})

export class DatasetsComponent implements OnInit, AfterContentChecked {
	@ViewChild('agGrid')agGrid;any

	private gridOptions: GridOptions;
	gridData: Dataset[];
	height=200;

	constructor(private datasetsService: DatasetsService,
				private router:Router,
				private deleteService:DeleteService,
				private cfgModel:CfgModel) {
		this.gridOptions = <GridOptions>{
			context:{componentParent:this},
			enableFilter: true,
			enableSorting: true
		};
  		this.gridOptions.columnDefs=[
			{
				headerName: "Name",
				field: "name",
				width: 200
			},
			{
				headerName: "Owner",
				field: "owner",
				width: 110
			},
			{
				headerName: "Status",
				field: "status",
				width: 190
			},
			{
				headerName: "Comments",
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
				width:190
			}
		]	
	}

	ngOnInit() {
		let body = document.getElementsByTagName('body')[0];
		body.setAttribute("style","background-color:#d9edf7");//light blue

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

	public deleteDataset(id:string){
		this.deleteService.delete(id).subscribe(
			(res) => {
				this.getDatasets();
			},
			(err) => {
				console.log(err);
			}
		)
	}
}
