import { Component, OnInit } from '@angular/core';
import { GridOptions } from 'ag-grid';
import { Dataset } from '../dtos/dataset';
import { DatasetsService } from '../services/datasets.service';

@Component({
	selector: 'app-datasets',
	templateUrl: './datasets.component.html',
	styleUrls: ['./datasets.component.css']
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
				width: 300
			},
			{
				headerName: "Owner",
				field: "owner",
				width: 200
			},
			{
				headerName: "Status",
				field: "status",
				width: 200
			},
			{
				headerName: "Comments",
				field: "comments",
				width: 400
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
	}

}
