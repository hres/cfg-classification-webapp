import { Component, OnInit, ViewChild, AfterContentChecked } from '@angular/core';
import { GridOptions } from 'ag-grid';
import { QueryService } from '../services/query.service';

import { SaveService } from '../services/save.service';
import { OpenService } from '../services/open.service';
import { ClassifyService } from '../services/classify.service';
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
	providers: [SaveService, OpenService, ClassifyService]
})

export class MainInterfaceComponent implements OnInit, AfterContentChecked {
	@ViewChild('agGrid')agGrid:any;

	private gridOptions: GridOptions;
	height=200;
	private env:string = "prod";
	private datasetId:string;
	private validationMode:boolean = false;
	private	dataset:any = {"name":null};
	private btnBarState={
		"showBase":false,
		"showRa":false,
		"showThreshold":false,
		"showAdjustments":false
	}

	constructor(private queryService: QueryService,
				private saveService: SaveService,
				private openService: OpenService,
				private classifyService: ClassifyService,
				private dialog: MdDialog,
				private route:ActivatedRoute) {

		this.gridOptions={
			context:{validationMode:false},
			enableFilter: true,
			enableSorting: true,
			headerHeight: 48,
			enableColResize: true
		};
		this.gridOptions.debug = true;
		this.gridOptions.columnDefs=[
			///////////////
			//BASE ITEM DATA
			///////////////
			{
				headerName: "Food/Recipe Name",
				field: "name",
				width: 390,
				minWidth: 390
			},
			{
				headerName: "Type",
				field: "type",
				minWidth: 65,
				width: 65
			},
			{
			 	headerName: "Food/Recipe Code",
				field: "code",
				width: 112,
				minWidth: 112
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
				hide: true,
				width: 100,
				minWidth: 120
			},
			//////////////////////////
			// EXTENTED ITEM DATA
			// //////////////////
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
				hide: true,
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
				hide: true,
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
				hide: true,
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
				hide: true,	
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
				hide: true,	
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
				hide: true,
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
				hide: true,	
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
				hide: true,	
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
				hide: true,	
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
				hide: true,	
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
				hide: true,	
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
				hide: true,	
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
				hide: true,	
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
				hide: true,	
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
				hide: true,	
				width: 100,
				minWidth: 150
			},
			{
				headerName: "Override Small RA Adj",
				field: "overrideSmallRaAdjustment",
				minWidth: 150
			},
			//{
				//headerName: "Toddler Item",
				//field: 
			//},
			{
				headerName: "Replacement Code",
				field: "replacementCode",
				minWidth: 118
			},
			///////////////////////
			// STEP 1 RA Adjustments
			////////////////////////
			{
				headerName: "Adjusted RA",
				field:"adjustedReferenceAmount",
				minWidth:118
			},
			{
				headerName: "Sodium per RA",
				field:"sodiumPerReferenceAmount",
				minWidth:118
			},
			{
				headerName: "Sugar per RA",
				field:"sugarPerReferenceAmount",
				minWidth:118
			},
			{
				headerName: "TransFat per RA",
				field:"transFatPerReferenceAmount",
				minWidth:118
			},
			{
				headerName: "SatFat per RA",
				field:"satFatPerReferenceAmount",
				minWidth:118
			},
			{
				headerName: "TotalFat per RA",
				field:"fatPerReferenceAmount",
				minWidth:118
			},
			/////////////////////////////
			//// STEP 2 THRESHOLD RULES
			//////////////////////////////
			{
				headerName: "Low Sodium",
				field:"lowSodium",

				minWidth:118
			},
			{
				headerName: "High Sodium",
				field:"highSodium",
				minWidth:118
			},
			{
				headerName: "Low Sugar",
				field:"lowSugar",
				minWidth:118
			},
			{
				headerName: "High Sugar",
				field:"highSugar",
				minWidth:118
			},
			{
				headerName: "Low Transfat",
				field:"lowTransFat",
				minWidth:118
			},
			{
				headerName: "High Transfat",
				field:"highTransFat",
				minWidth:118
			},
			{
				headerName: "Low SatFat",
				field:"lowSatFat",
				minWidth:118
			},
			{
				headerName: "High SatFat",
				field:"highSatFat",
				minWidth:118
			},
			{
				headerName: "Low TotalFat",
				field:"lowFat",
				minWidth:118
			},
			{
				headerName: "High TotalFat",
				field:"highFat",
				minWidth:118
			},
			{
				headerName: "SatFat FOP Warning",
				field:"satFatFopWarning",
				minWidth:118
			},
			{
				headerName: "Sugar FOP Warning",
				field:"sugarFopWarning",
				minWidth:118
			},
			{
				headerName: "Sodium FOP Warning",
				field:"sodiumFopWarning",
				minWidth:118
			},
			{
				headerName: "Initial CFG Code",
				field:"tier",
				minWidth:118
			},
			////////////////////////////////////
			//STEP 3 ADJUSTMENT RULES
			//////////////////////////////////////
			{
				headerName: "Shift Tier",
				field:"shift",
				minWidth:118
			},
			{
				headerName: "Absolute Tier",
				field:"absolute",
				minWidth:118
			},
			{
				headerName: "New CFG Code",
				field: "",
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
					this.setDataset(res);
					
				},
				(err) => {
					console.log(err);
				}
			)
		}else{
			this.search();
		}	
	}

	search():void{
		this.queryService.search().subscribe(
			(res) => {
				this.dataset.data = res;
				this.setDataset(this.dataset);
			},
			(err) =>{
				console.log(err);
			});
	}

	private	setDataset(dataset:any){
		this.dataset=dataset;
		this.dataset.status = dataset.status;
		this.gridOptions.api.setRowData(dataset.data);
		this.gridOptions.api.sizeColumnsToFit();
	}

	onSaveClick(){
		let config = new MdDialogConfig();
		config.width = '600px';

		//if first time save
		if(this.dataset.name == undefined){
			let dialogRef = this.dialog.open(SaveViewComponent, config);
			dialogRef.afterClosed().subscribe(result => {
				if (result == "save"){
					this.dataset.name=dialogRef.componentInstance.datasetName;
					this.dataset.status = "In Progress";
					this.dataset.owner = "Jean-Gabriel Pageau";
					this.dataset.comments=dialogRef.componentInstance.datasetComments;
					this.saveDataset();
				}
			});
		}else{
			this.saveDataset();
		}
	}

	saveDataset(){
		//ToDo
		//if(status) this.dataset.status = status;

		this.saveService.save(this.dataset).subscribe(
			(res) => {
				//if first time save, assign id
				if(this.dataset.id == undefined){
					this.dataset.id = res.id;
				}
				console.log(res);
			},
			(err) => {
				console.log(err);
			});
	}

	ngAfterContentChecked(){
		if(this.agGrid._nativeElement.querySelector('.ag-body-container')){
			this.height = 68 + this.agGrid._nativeElement.querySelector('.ag-body-container').offsetHeight + 20;
		}
	}

	getNumCellStyle(params:any):any{
		if(params.context.validationMode && params.value==null){
			return {backgroundColor: '#FFFFCC'}
		}
		else if(params.value < 0){
			return {backgroundColor: '#FFBFBC'};
		}		
	}

	getStringCellStyle(params:any):any{
		if(params.context.validationMode && params.value==null){
			return {backgroundColor: '#FFFFCC'};
		}
		else if(params.value!=null&&params.value.indexOf("&edited=true;")>-1){
			return {backgroundColor: '#FFBFBC'};
		}
	}

	getBooleanCellStyle(params:any):any{
		if (params.context.validationMode && params.value==null){
			return {backgroundColor: '#FFFFCC'};
		}
		else if(params.value!=null&&params.value<0){
			return {backgroundColor: '#FFBFBC'};
		}
	}
	
	getNumValue(params:any):any{
		return params.value < 0 ? params.value*-1:params.value;
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
		switch(param.value){
			case null:
				return null;
			case 0:
			case -2:
				return false;
			case 1: 
			case -1:
				return true;
		}
	}

	onSubmitClick(){
		this.validationMode = true;
		this.gridOptions.context.validationMode = true;
		this.gridOptions.api.refreshView();
		this.saveDataset();
	}

	onValidateClick(){
		this.validationMode = false;
		this.gridOptions.context.validationMode = false;
		this.gridOptions.api.refreshView();
		this.dataset.status = "Validated";
		this.saveDataset();
	}

	onClassifyClick(){
		this.classifyService.classify(this.dataset.id).subscribe(
			(res) => {
				this.setBaseClassified();
				this.dataset = res;
			},
			(err) => {
				console.log(err);
			});
	}

	onExportClick(){
		let params={
			skipHeader: false,
			columnGroups: true,
			skipFooters: true,
			skipGroups: true,
			skipFloatingTop: true ,
	        skipFloatingBottom: true,
	        allColumns: true,
	        onlySelected: false,
	        suppressQuotes: true,
			fileName: "luc.csv",
	        columnSeparator: ","
		};

		this.gridOptions.api.exportDataAsCsv(params);
	}

	setBaseClassified(){
		for (let columnNum in this.gridOptions.columnDefs){
			if(["type","code","name","cfgCode"].includes((<any>this.gridOptions.columnDefs[columnNum]).field)==true){
				(<any>this.gridOptions.columnDefs[columnNum]).hide = false;
			}else{
				(<any>this.gridOptions.columnDefs[columnNum]).hide = true;
			}
		}
		this.gridOptions.api.setColumnDefs(this.gridOptions.columnDefs);
		this.gridOptions.api.sizeColumnsToFit();
	}
}
