import { Component, OnInit, ViewChild, AfterContentChecked } from '@angular/core';
import { GridOptions } from 'ag-grid';
import { QueryService } from '../services/query.service';
import { SaveService } from '../services/save.service';
import { OpenService } from '../services/open.service';
import { SaveViewComponent } from '../save-view/save-view.component';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { NumericEditorComponent } from './numeric-editor/numeric-editor.component';
import { BooleanEditorComponent } from './boolean-editor/boolean-editor.component';
import { StringEditorComponent } from './string-editor/string-editor.component';

@Component({
	selector: 'app-main-interface',
	templateUrl: './main-interface.component.html',
	styleUrls: ['./main-interface.component.css'],
	providers: [SaveService, OpenService]
})

export class MainInterfaceComponent implements OnInit, AfterContentChecked {
	@ViewChild('agGrid')agGrid:any;

	private gridOptions: GridOptions;
	height=200;
	private env:string = "prod";
	private datasetId:string;

	constructor(private queryService: QueryService,
				private saveService: SaveService,
				private openService: OpenService,
				private dialog: MdDialog,
				private route:ActivatedRoute) {

		this.gridOptions={
			enableFilter: true,
			enableSorting: true,
			headerHeight: 48,
			enableColResize: true
		};
		this.gridOptions.debug = true;
		this.gridOptions.columnDefs=[
			{
				headerName: "Type",
				field: "type",
				minWidth: 65,
				width: 65,
			},
			{
			 	headerName: "Food/Recipe Code",
				field: "code",
				width: 112,
				minWidth: 112,
			},
			{
				headerName: "Food/Recipe Name",
				field: "name",
				width: 300,
				minWidth: 150
			},
			{
				headerName: "CFG Code",
				cellRenderer: this.getNumValue,
				cellEditorFramework: NumericEditorComponent,
				cellStyle: this.getNumCellStyle,
				editable: true,
				field: "cfgCode",
				width: 90,
				minWidth: 90
			},
			{
				headerName: "CFG Code Last Update",
				field: "cfgCodeUpdateDate",
				width: 100,
				minWidth: 120
			},
			{
				headerName: "Energy (Kcal)",
				field: "energyKcal",
				width: 100,
				minWidth: 110
			},
			{
				headerName: "Sodium Amount (per 100g)",
				cellRenderer: this.getNumValue,
				cellEditorFramework: NumericEditorComponent,
				cellStyle: this.getNumCellStyle,
				editable: true,
				field: "sodiumAmountPer100g",
				width: 100,
				minWidth: 125
			},
			{
				headerName: "Sodium Imputation Reference",
				cellRenderer: this.getStringValue,
				cellEditorFramework: StringEditorComponent,
				cellStyle: this.getStringCellStyle,
				editable: true,
				field: "sodiumImputationReference",
				width: 100,
				minWidth: 141
			},
			{
				headerName: "Sodium Imputation Last Update",
				field: "sodiumImputationDate",
				width: 100,
				minWidth: 150
			},
			{
				headerName: "Sugar Amount (per 100g)",
				cellRenderer: this.getNumValue,
				cellEditorFramework: NumericEditorComponent,
				cellStyle: this.getNumCellStyle,
				editable: true,
				field: "sugarAmountPer100g",
				width: 100,
				minWidth: 150
			},
			{
				headerName: "Sugar Imputation Reference",
				cellRenderer: this.getStringValue,
				cellEditorFramework: StringEditorComponent,
				cellStyle: this.getStringCellStyle,
				editable: true,
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
				editable: true,
				cellRenderer: this.getNumValue,
				cellEditorFramework: NumericEditorComponent,
				cellStyle: this.getNumCellStyle,
				field: "transfatAmountPer100g",
				width: 100,
				minWidth: 150
			},
			{
				headerName: "Transfat Imputation Reference",
				cellRenderer: this.getStringValue,
				cellEditorFramework: StringEditorComponent,
				cellStyle: this.getStringCellStyle,
				editable: true,
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
				editable: true,
				cellRenderer: this.getNumValue,
				cellEditorFramework: NumericEditorComponent,
				cellStyle: this.getNumCellStyle,
				field: "satfatAmountPer100g",
				width: 100,
				minWidth: 150
			},
			{
				headerName: "SatFat Imputation Reference",
				cellRenderer: this.getStringValue,
				cellEditorFramework: StringEditorComponent,
				cellStyle: this.getStringCellStyle,
				editable: true,
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
				editable: true,
				cellEditorFramework: BooleanEditorComponent,
				cellRenderer: this.getBooleanValue,
				cellStyle: this.getBooleanCellStyle,
				field: "containsAddedSodium",
				width: 100,
				minWidth: 190
			},
			{
				headerName: "Contains Added Sodium Last Update Date",
				field: "containsAddedSodiumUpdateDate",
				width: 100,
				minWidth: 170
			},
			{
				headerName: "Contains Added Sugar",
				editable: true,
				cellEditorFramework: BooleanEditorComponent,
				cellRenderer: this.getBooleanValue,
				cellStyle: this.getBooleanCellStyle,
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
				editable: true,
				cellEditorFramework: BooleanEditorComponent,
				cellRenderer: this.getBooleanValue,
				cellStyle: this.getBooleanCellStyle,
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
				editable: true,
				cellEditorFramework: BooleanEditorComponent,
				cellRenderer: this.getBooleanValue,
				cellStyle: this.getBooleanCellStyle,
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
				editable: true,
				cellEditorFramework: BooleanEditorComponent,
				cellRenderer: this.getBooleanValue,
				cellStyle: this.getBooleanCellStyle,
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
				cellEditorFramework: BooleanEditorComponent,
				cellRenderer: this.getBooleanValue,
				cellStyle: this.getBooleanCellStyle,
				editable: true,
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
				cellEditorFramework: BooleanEditorComponent,
				cellRenderer: this.getBooleanValue,
				cellStyle: this.getBooleanCellStyle,
				editable: true,
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
				editable: true,
				cellRenderer: this.getNumValue,
				cellEditorFramework: NumericEditorComponent,
				cellStyle: this.getNumCellStyle,
				field: "referenceAmountG",
				width: 100,
				minWidth: 150
			},
			{
				headerName: "Reference Amount (measure)",
				cellRenderer: this.getStringValue,
				cellEditorFramework: StringEditorComponent,
				cellStyle: this.getStringCellStyle,
				editable: true,
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
				editable: true,
				cellRenderer: this.getNumValue,
				cellEditorFramework: NumericEditorComponent,
				cellStyle: this.getNumCellStyle,
				field: "foodGuideServingG",
				width: 100,
				minWidth: 150
			},
			{
				headerName: "Food Guide Serving (measure)",
				editable: true,
				cellRenderer: this.getStringValue,
				cellEditorFramework: StringEditorComponent,
				cellStyle: this.getStringCellStyle,
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
				editable: true,
				cellRenderer: this.getNumValue,
				cellEditorFramework: NumericEditorComponent,
				cellStyle: this.getNumCellStyle,
				field: "tier4ServingG",
				width: 100,
				minWidth: 150
			},
			{
				headerName: "Tier 4 Serving (measure)",
				cellRenderer: this.getStringValue,
				cellEditorFramework: StringEditorComponent,
				cellStyle: this.getStringCellStyle,
				editable: true,
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
				cellEditorFramework: BooleanEditorComponent,
				cellRenderer: this.getBooleanValue,
				cellStyle: this.getBooleanCellStyle,
				editable: true,
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
		this.route.params.subscribe(params =>{
			this.datasetId = params['id'];

			//todo fix this properly
			if(this.datasetId == 'prod' || this.datasetId == 'sandbox'){
				this.env = this.datasetId;
				this.datasetId = undefined;
			}
		})

		if(this.datasetId != undefined){
			this.openService.open(this.datasetId).subscribe(
				(res) => {
					this.setDataset(res[0].data);

				},
				(err) => {
					console.log(err);
				}
			)
		}else{
			this.search();
		}	
	}

	dataset:any;	
	search():void{
		this.queryService.search().subscribe(
			(res) => {
				this.setDataset(res);
			},
			(err) =>{
				console.log(err);
			});
	}

	private	setDataset(dataset:any){
		this.dataset=dataset;
		this.gridOptions.api.setRowData(dataset);
		this.gridOptions.api.sizeColumnsToFit();
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
		this.saveService.save(this.datasetId, datasetName, datasetComments, this.dataset, this.env).subscribe(
			(res) => {
				console.log(res);
			},
			(err) => {
				console.log(err);
			});
	}

	ngAfterContentChecked(){
		if(this.agGrid._nativeElement.querySelector('.ag-body-container')){
			this.height = 68 + this.agGrid._nativeElement.querySelector('.ag-body-container').offsetHeight;
		}
	}

	getNumCellStyle(param:any):any{
		if(param.value < 0){
			return {backgroundColor: '#FFBFBC'};
		}		
	}

	getStringCellStyle(param:any):any{
		if(param.value!=null&&param.value.indexOf("&edited=true;")>-1){
			return {backgroundColor: '#FFBFBC'};
		}
	}

	getBooleanCellStyle(param:any):any{
		if(param.value!=null&&param.value<0){
			return {backgroundColor: '#FFBFBC'};
		}
	}
	
	getNumValue(param:any):any{
		return param.value < 0 ? param.value*-1:param.value;
	}

	getStringValue(param:any):any{
		if(param.value==null){
			return null;
		}else if(param.value.indexOf("&edited=true;")>-1){
			return param.value.replace('&edited=true;','');
		}else{
			return param.value;
		}
	}

	getBooleanValue(param:any):any{
		//if(param.value==null){
			//return null;
		//}else if(param.value){
			
		//}
		switch(param.value){
			case null:
				return null;
			case 0:
			case -2:
			case "0":
			case "-2":
				return false;
			case 1: 
			case -1:
			case "-1":
			case "1":
				return true;
		}
	}
}
