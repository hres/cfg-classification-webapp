import { Component, OnInit, ViewChild, AfterContentChecked } from '@angular/core';
import { GridOptions } from 'ag-grid';
import { Dataset } from '../dtos/dataset';
import { DatasetsService } from '../services/datasets.service';
import { DatasetsActionComponent } from './datasets-action/datasets-action.component';
import { Router } from '@angular/router';

@Component({
	selector: 'app-datasets',
	templateUrl: './datasets.component.html',
	styleUrls: ['./datasets.component.css'],
	providers: [DatasetsService]
})

export class DatasetsComponent implements OnInit, AfterContentChecked {
	@ViewChild('agGrid')agGrid;any

	private gridOptions: GridOptions;
	gridData: Dataset[];
	height=200;
	private env:string='prod';

	private environments=[
		{name:'prod', desc:'Production'},
		{name:'sandbox', desc:'Sandbox'}
	];

	constructor(private datasetsService: DatasetsService, private router:Router) {
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
				width: 200
			}
		]	
	}

	ngOnInit() {
		this.onEnvChange();
	}

	ngAfterContentChecked(){
		if(this.agGrid._nativeElement.querySelector('.ag-body-container')){
			// the 110 below is hardcoded for now, it is the header height + the element padding-top
			this.height = 110 + this.agGrid._nativeElement.querySelector('.ag-body-container').offsetHeight;
			this.gridOptions.api.sizeColumnsToFit();
		}
	}

	onEnvChange(){
		this.datasetsService.getDatasets(this.env).subscribe(
			(res) => {
				// Todo remove this status set
				for(let dataset of res){
					if (dataset.id == "5900c9bd69953d0d9be85c57") dataset.status="Pending Validation";
					this.gridOptions.api.setRowData(res);
					this.gridOptions.api.sizeColumnsToFit();
				}
			},
			(err) => {
				console.log(err);
			});
	}

	public openDataset(datasetId:string){
		this.router.navigate(['/main', datasetId]);
	}
}
