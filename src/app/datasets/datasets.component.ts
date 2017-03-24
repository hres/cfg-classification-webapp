import { Component, OnInit } from '@angular/core';
import { GridOptions } from 'ag-grid';
import { Dataset } from '../dtos/dataset';
import { DatasetsService } from '../services/datasets.service';

@Component({
	selector: 'app-datasets',
	templateUrl: './datasets.component.html',
	styleUrls: ['./datasets.component.css'],
	providers: [DatasetsService]
})
export class DatasetsComponent implements OnInit {
	private gridOptions: GridOptions;
	gridData: Dataset[];
		
	constructor(private datasetsService: DatasetsService) {
		this.gridOptions={
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
				width: 150
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
				headerName: "Action",
				width: 100
			}
		]	
	}

	ngOnInit() {
		//this.datasetsService.getDatasets().subscribe(
			//(res) => {
				//console.log(res);
			//},
			//(err) => {
				//console.log(err);
			//});
		this.datasetsService.getDatasets().then(datasets =>{
			this.gridOptions.api.setRowData(datasets);
			this.gridOptions.api.sizeColumnsToFit();
			
		});
	}

}
