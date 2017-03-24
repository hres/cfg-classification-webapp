import { Component, OnInit } from '@angular/core';
import { GridOptions } from 'ag-grid';
import { QueryService } from '../services/query.service';
import { SaveService } from '../services/save.service';
import { SaveViewComponent } from '../save-view/save-view.component';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';

@Component({
	selector: 'app-main-interface',
	templateUrl: './main-interface.component.html',
	styleUrls: ['./main-interface.component.css'],
	providers: [SaveService]
})

export class MainInterfaceComponent implements OnInit {
	private gridOptions: GridOptions;

	constructor(private queryService: QueryService, private saveService: SaveService, private dialog: MdDialog) {
		this.gridOptions={
			enableFilter: true,
			enableSorting: true,
			headerHeight: 48
		};
		this.gridOptions.debug = true;
		this.gridOptions.columnDefs=[
			{
				headerName: "Type",
				field: "type",
				width: 200,
				minWidth: 150
			},
			{
			 	headerName: "Food/Recipe Code",
				field: "cnfCode",
				width: 100,
				minWidth: 150,
			},
			{
				editable: true,
				headerName: "Food/Recipe Name",
				field: "name",
				width: 300,
				minWidth: 150
			},
			{
				headerName: "CFG Code",
				field: "cfgCode",
				width: 100,
				minWidth: 150
			},
			{
				headerName: "CFG Code Last Update",
				field: "cfgCodeUpdateDate",
				width: 100,
				minWidth: 150
			},
			{
				headerName: "Energy (Kcal)",
				field: "energyKcal",
				width: 100,
				minWidth: 150
			},
			{
				headerName: "Sodium Amount (per 100g)",
				field: "sodiumAmountPer100g",
				width: 100,
				minWidth: 150
			},
			{
				headerName: "Sodium Imputation Reference",
				field: "sodiumImputationReference",
				width: 100,
				minWidth: 150
			},
			{
				headerName: "Sodium Imputation Last Update",
				field: "sodiumImputationDate",
				width: 100,
				minWidth: 150
			},
			{
				headerName: "Sugar Amount (per 100g)",
				field: "sugarAmountPer100g",
				width: 100,
				minWidth: 150
			},
			{
				headerName: "Sugar Imputation Reference",
				field: "sugarImputationReference",
				width: 100,
				minWidth: 150
			},
			{
				headerName: "Sugar Imputation Last Update",
				field: "sugarImputationDate",
				width: 100,
				minWidth: 150
			},
			{
				headerName: "TransFat Amount (per 100g)",
				field: "transfatAmountPer100g",
				width: 100,
				minWidth: 150
			},
			{
				headerName: "Transfat Imputation Reference",
				field: "transfatImputationReference",
				width: 100,
				minWidth: 150
			},

			{
				headerName: "TransFat Imputation Last Update",
				field: "transfatImputationDate",
				width: 100,
				minWidth: 150
			},
			{
				headerName: "SatFat Amount (per 100g)",
				field: "satfatAmountPer100g",
				width: 100,
				minWidth: 150
			},
			{
				headerName: "SatFat Imputation Reference",
				field: "satfatImputationReference",
				width: 100,
				minWidth: 150
			},
			{
				headerName: "SatFat Imputation Last Update",
				field: "satfatImputationDate",
				width: 100,
				minWidth: 150
			},
			{
				headerName: "Contains Added Sodium",
				field: "containsAddedSodium",
				width: 100,
				minWidth: 150
			},
			{
				headerName: "Contains Added Sodium Last Update Date",
				field: "containsAddedSodiumUpdateDate",
				width: 100,
				minWidth: 150
			},
			{
				headerName: "Contains Added Sugar",
				field: "containsAddedSugar",
				width: 100,
				minWidth: 150
			},
			{
				headerName: "Contains Added Sugar Last Update Date",
				field: "containsAddedSugarUdpateDate",
				width: 100,
				minWidth: 150
			},
			{
				headerName: "Contains Free Sugars",
				field: "containsFreeSugars",
				width: 100,
				minWidth: 150
			},
			{
				headerName: "Contains Free Sugars Last Update Date",
				field: "containsFreeSugarsUpdateDate",
				width: 100,
				minWidth: 150
			},
			{
				headerName: "Contains Added Fat",
				field: "containsAddedFat",
				width: 100,
				minWidth: 150
			},
			{
				headerName: "Contains Added Fat Last Update Date",
				field: "containsAddedFatUpdateDate",
				width: 100,
				minWidth: 150
			},
			{
				headerName: "Added TransFat",
				field: "containsAddedTransfat",
				width: 100,
				minWidth: 150
			},
			{
				headerName: "Contains Added TransFat Last Update Date",
				field: "containsAddedTransfatUpdateDate",
				width: 100,
				minWidth: 150
			},
			{
				headerName: "Contains Caffeine",
				field: "containsCaffeine",
				width: 100,
				minWidth: 150
			},
			{
				headerName: "Contains Caffeine Last Update Date",
				field: "containsCaffeineUpdateDate",
				width: 100,
				minWidth: 150
			},
			{
				headerName: "Contains Sugar Substitutes",
				field: "containsSugarSubstitutes",
				width: 100,
				minWidth: 150
			},
			{
				headerName: "Contains Sugar Substitutes Last Update Date",
				field: "containsSugarSubstituteUpdateDate",
				width: 100,
				minWidth: 150
			},
			{
				headerName: "Reference Amount (g)",
				field: "referenceAmountG",
				width: 100,
				minWidth: 150
			},
			{
				headerName: "Reference Amount (measure)",
				field: "referenceAmountMeasure",
				width: 100,
				minWidth: 150
			},
			{
				headerName: "Reference Amount Last Update Date",
				field: "referenceAmountUpdateDate",
				width: 100,
				minWidth: 150
			},
			{
				headerName: "Food Guide Serving (g)",
				field: "foodGuideServingG",
				width: 100,
				minWidth: 150
			},
			{
				headerName: "Food Guide Serving (measure)",
				field: "foodGuideServingMeasure",
				width: 100,
				minWidth: 150
			},
			{
				headerName: "FG Serving Last Update Date",
				field: "foodGuideUpdateDate",
				width: 100,
				minWidth: 150
			},
			{
				headerName: "Tier 4 Serving (g)",
				field: "tier4ServingG",
				width: 100,
				minWidth: 150
			},
			{
				headerName: "Tier 4 Serving (measure)",
				field: "tier4ServingMeasure",
				width: 100,
				minWidth: 150
			},
			{
				headerName: "Tier 4 Serving Last Update Date",
				field: "tier4ServingUpdateDate",
				width: 100,
				minWidth: 150
			},
			{
				headerName: "Rolled Up",
				field: "rolledUp",
				width: 100,
				minWidth: 150
			},
			{
				headerName: "Rolled Up Last Update Date",
				field: "rolledUpUpdateDate",
				width: 100,
				minWidth: 150
			},
			{
				headerName: "Comments",
				field: "comments",
				width: 100,
				minWidth: 150
			}
		];
	}

	ngOnInit() {
		this.search();
	}

	dataset:any;	
	search():void{
		this.queryService.search().subscribe(
			(res) => {
				this.dataset=res;
				this.gridOptions.api.setRowData(res);
				this.gridOptions.api.sizeColumnsToFit();
			},
			(err) =>{
				console.log(err);
			});
	}

	onSaveClick(){
		let config = new MdDialogConfig();
		config.width = '600px';

		let dialogRef = this.dialog.open(SaveViewComponent, config);
		dialogRef.afterClosed().subscribe(result => {
			if (result == "save"){
				this.saveDataset(dialogRef.componentInstance.datasetName, dialogRef.componentInstance.datasetComments);
			}
		});
	}

	saveDataset(datasetName:string, datasetComments:string){
		console.log(this.gridOptions.api.getModel);
		this.saveService.save(datasetName, datasetComments, this.dataset).subscribe(
			(res) => {
				console.log(res);
			},
			(err) => {
				console.log(err);
			});
	}
}
