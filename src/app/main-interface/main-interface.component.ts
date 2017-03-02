import { Component, OnInit } from '@angular/core';
import { GridOptions } from "ag-grid";
import { CfgItem } from '../dtos/cfgitem';
import { QueryService } from '../services/query.service';

@Component({
	selector: 'app-main-interface',
	templateUrl: './main-interface.component.html',
	styleUrls: ['./main-interface.component.css'],
	providers: [QueryService]
})
export class MainInterfaceComponent implements OnInit {
	private gridOptions: GridOptions;
	gridData: CfgItem[];

	constructor(private queryService: QueryService) {
		this.gridOptions={
			enableFilter: true,
			enableSorting: true
		};
		this.gridOptions.columnDefs=[
			{
				headerName: "Name",
				field: "name",
				width: 100
			},
			{
				headerName: "Cfg Code",
				field: "cfgCode",
				width: 100
			},
			{
				headerName: "Added Sodium",
				field: "addedSodium",
				width: 100
			},
			{
				headerName: "Comments",
				field: "comments",
				width: 100
			}
		];
	}

	ngOnInit() {
		this.getGridData();
	}

	getGridData():void{
		//todo temporary remove
		//this.queryService.getData().then(
			//myarray => {this.gridOptions.api.setRowData(myarray);
			//this.gridOptions.api.sizeColumnsToFit();}
		//);
		this.queryService.getGroups().subscribe(
			(res) => {
				this.gridOptions.api.setRowData(res);
			},
			(err) =>{
				console.log(err);
			});
	}
}
