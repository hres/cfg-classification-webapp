import { Component, OnInit, ViewChild, AfterContentChecked, ElementRef } from '@angular/core';
import { GridOptions } from 'ag-grid';

import { QueryService } from '../services/query.service';
import { SaveService } from '../services/save.service';
import { OpenService } from '../services/open.service';
import { ClassifyService } from '../services/classify.service';
import { CfgModel }			from '../model/cfg.model';
import { SaveViewComponent } from '../save-view/save-view.component';
import { ColumnVisibilityComponent }	from '../column-visibility/column-visibility.component';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { NumericEditorComponent } from './numeric-editor/numeric-editor.component';
import { BooleanEditorComponent } from './boolean-editor/boolean-editor.component';
import { BooleanRendererComponent } from './boolean-renderer/boolean-renderer.component';
import { StringEditorComponent } from './string-editor/string-editor.component';

@Component({
	selector: 'app-main-interface',
	templateUrl: './main-interface.component.html',
	styleUrls: ['./main-interface.component.css'],
	providers: [SaveService, OpenService, ClassifyService]
})

export class MainInterfaceComponent implements OnInit, AfterContentChecked {
	@ViewChild('agGrid')
	agGrid:any;

	@ViewChild('gridPlaceHolder')
	gridPlaceHolder:any;

	@ViewChild('showMissingDiv')
	showMissingDiv:any;

	@ViewChild('showAllDiv')
	showAllDiv:any;

	private gridOptions: GridOptions;
	height=200;
	private datasetId:string;
	private validationMode:boolean = false;
	private	dataset:any = {"name":null,status:''};
	private btnBarState={
		"showBase":false,
		"showRa":false,
		"showThreshold":false,
		"showAdjustments":false
	}
	private callbackSubmit:boolean;
	private validationFailed:boolean=false;

	constructor(private queryService: QueryService,
		private saveService: SaveService,
		private openService: OpenService,
		private classifyService: ClassifyService,
		private dialog: MdDialog,
		private route:ActivatedRoute,
		private cfgModel:CfgModel,
		private element:ElementRef) {

		this.gridOptions={
			context:{validationMode:this.validationMode,
					 mainInterface:this
					},
			enableFilter: true,
			enableSorting: true,
			headerHeight: 48,
			enableColResize: true,
			isExternalFilterPresent: this.isExternalFilterPresent,
			doesExternalFilterPass: this.doesExternalFilterPass
		};

		this.gridOptions.debug = true;
		this.gridOptions.columnDefs=[
			///////////////
			//BASE ITEM DATA
			///////////////
			{
				headerName: "Food/Recipe Name",
				cellStyle: this.getNameCellStyle,
				field: "name",
				pinned: "left",
				width: 390
			},
			{
				headerName: "Type",
				field: "type",
				width: 65
			},
			{
				headerName: "Food/Recipe Code",
				field: "code",
				width: 112
			},
			{
				headerName: "CFG Code",
				cellRenderer: this.getNumValue,
				cellEditorFramework: NumericEditorComponent,
				cellStyle: this.getNumCellStyle,
				editable: true,
				field: "cfgCode",
				width: 90
			},
			{
				headerName: "CFG Code Last Update",
				field: "cfgCodeUpdateDate",
				hide: true,
				width: 120
			},
			//////////////////////////
			// EXTENTED ITEM DATA
			// //////////////////
			{
				headerName: "Energy (Kcal/100g)",
				cellStyle: this.getExtendedCellStyle,
				field: "energyKcal",
				width: 100
			},
			{
				headerName: "Sodium (mg/100g)",
				cellRenderer: this.getNumValue,
				cellEditorFramework: NumericEditorComponent,
				cellStyle: this.getNumCellStyle,
				editable: true,
				field: "sodiumAmountPer100g",
				width: 127
			},
			{
				headerName: "Sodium Imputation Reference",
				cellRenderer: this.getStringValue,
				cellEditorFramework: StringEditorComponent,
				cellStyle: this.getStringCellStyle,
				editable: true,
				field: "sodiumImputationReference",
				width: 142
			},
			{
				headerName: "Sodium Imputation Last Update",
				cellStyle: this.getExtendedCellStyle,
				field: "sodiumImputationDate",
				hide: true,
				width: 150
			},
			{
				headerName: "Sugar (g/100g)",
				cellRenderer: this.getNumValue,
				cellEditorFramework: NumericEditorComponent,
				cellStyle: this.getNumCellStyle,
				editable: true,
				field: "sugarAmountPer100g",
				width: 151
			},
			{
				headerName: "Sugar Imputation Reference",
				cellRenderer: this.getStringValue,
				cellEditorFramework: StringEditorComponent,
				cellStyle: this.getStringCellStyle,
				editable: true,
				field: "sugarImputationReference",
				width: 151
			},
			{
				headerName: "Sugar Imputation Last Update",
				cellStyle: this.getExtendedCellStyle,
				field: "sugarImputationDate",
				hide: true,
				width: 156
			},
			{
				headerName: "TransFat (g/100g)",
				editable: true,
				cellRenderer: this.getNumValue,
				cellEditorFramework: NumericEditorComponent,
				cellStyle: this.getNumCellStyle,
				field: "transfatAmountPer100g",
				width: 151
			},
			{
				headerName: "Transfat Imputation Reference",
				cellRenderer: this.getStringValue,
				cellEditorFramework: StringEditorComponent,
				cellStyle: this.getStringCellStyle,
				editable: true,
				field: "transfatImputationReference",
				width: 152
			},

			{
				headerName: "TransFat Imputation Last Update",
				cellStyle: this.getExtendedCellStyle,
				field: "transfatImputationDate",
				hide: true,
				width: 151
			},
			{
				headerName: "SatFat (g/100g)",
				editable: true,
				cellRenderer: this.getNumValue,
				cellEditorFramework: NumericEditorComponent,
				cellStyle: this.getNumCellStyle,
				field: "satfatAmountPer100g",
				width: 152
			},
			{
				headerName: "SatFat Imputation Reference",
				cellRenderer: this.getStringValue,
				cellEditorFramework: StringEditorComponent,
				cellStyle: this.getStringCellStyle,
				editable: true,
				field: "satfatImputationReference",
				width: 124
			},
			{
				headerName: "SatFat Imputation Last Update",
				cellStyle: this.getExtendedCellStyle,
				field: "satfatImputationDate",
				hide: true,	
				width: 100
			},
			{
				headerName: "TotalFat (g/100g)",
				editable: true,
				cellRenderer: this.getNumValue,
				cellEditorFramework: NumericEditorComponent,
				cellStyle: this.getNumCellStyle,
				field: "totalFatAmountPer100g",
				width: 100
			},
			{
				headerName: "Contains Added Sodium",
				editable: true,
				cellEditorFramework: BooleanEditorComponent,
				cellRendererFramework: BooleanRendererComponent,
				cellStyle: this.getBooleanCellStyle,
				field: "containsAddedSodium",
				width: 111
			},
			{
				headerName: "Contains Added Sodium Last Update Date",
				cellStyle: this.getExtendedCellStyle,
				field: "containsAddedSodiumUpdateDate",
				hide: true,	
				width: 170
			},
			{
				headerName: "Contains Added Sugar",
				editable: true,
				cellEditorFramework: BooleanEditorComponent,
				cellRendererFramework: BooleanRendererComponent,
				cellStyle: this.getBooleanCellStyle,
				field: "containsAddedSugar",
				width: 150
			},
			{
				headerName: "Contains Added Sugar Last Update Date",
				cellStyle: this.getExtendedCellStyle,
				field: "containsAddedSugarUdpateDate",
				hide: true,
				width: 165
			},
			{
				headerName: "Contains Free Sugars",
				editable: true,
				cellEditorFramework: BooleanEditorComponent,
				cellRendererFramework: BooleanRendererComponent,
				cellStyle: this.getBooleanCellStyle,
				field: "containsFreeSugars",
				width: 150
			},
			{
				headerName: "Contains Free Sugars Last Update Date",
				cellStyle: this.getExtendedCellStyle,
				field: "containsFreeSugarsUpdateDate",
				hide: true,	
				width: 165
			},
			{
				headerName: "Contains Added Fat",
				editable: true,
				cellEditorFramework: BooleanEditorComponent,
				cellRendererFramework: BooleanRendererComponent,
				cellStyle: this.getBooleanCellStyle,
				field: "containsAddedFat",
				width: 150
			},
			{
				headerName: "Contains Added Fat Last Update Date",
				cellStyle: this.getExtendedCellStyle,
				field: "containsAddedFatUpdateDate",
				hide: true,	
				width: 165
			},
			{
				headerName: "Contains TransFat",
				editable: true,
				cellEditorFramework: BooleanEditorComponent,
				cellRendererFramework: BooleanRendererComponent,
				cellStyle: this.getBooleanCellStyle,
				field: "containsAddedTransfat",
				width: 150
			},
			{
				headerName: "Contains Added TransFat Last Update Date",
				cellStyle: this.getExtendedCellStyle,
				field: "containsAddedTransfatUpdateDate",
				hide: true,	
				width: 180
			},
			{
				headerName: "Contains Caffeine",
				cellEditorFramework: BooleanEditorComponent,
				cellRendererFramework: BooleanRendererComponent,
				cellStyle: this.getBooleanCellStyle,
				editable: true,
				field: "containsCaffeine",
				width: 128
			},
			{
				headerName: "Contains Caffeine Last Update Date",
				cellStyle: this.getExtendedCellStyle,
				field: "containsCaffeineUpdateDate",
				hide: true,	
				width: 150
			},
			{
				headerName: "Contains Sugar Substitutes",
				cellEditorFramework: BooleanEditorComponent,
				cellRendererFramework: BooleanRendererComponent,
				cellStyle: this.getBooleanCellStyle,
				editable: true,
				field: "containsSugarSubstitutes",
				width: 116
			},
			{
				headerName: "Contains Sugar Substitutes Last Update Date",
				cellStyle: this.getExtendedCellStyle,
				field: "containsSugarSubstituteUpdateDate",
				hide: true,	
				width: 100
			},
			{
				headerName: "Reference Amount (g)",
				cellStyle: this.getExtendedCellStyle,
				field: "referenceAmountG",
				width: 100
			},
			{
				headerName: "Reference Amount (measure)",
				cellStyle: this.getExtendedCellStyle,
				field: "referenceAmountMeasure",
				width: 150
			},
			{
				headerName: "Reference Amount Last Update Date",
				cellStyle: this.getExtendedCellStyle,
				field: "referenceAmountUpdateDate",
				hide: true,	
				width: 100
			},
			{
				headerName: "Food Guide Serving (g)",
				editable: true,
				cellRenderer: this.getNumValue,
				cellEditorFramework: NumericEditorComponent,
				cellStyle: this.getNumCellStyle,
				field: "foodGuideServingG",
				width: 150
			},
			{
				headerName: "Food Guide Serving (measure)",
				editable: true,
				cellRenderer: this.getStringValue,
				cellEditorFramework: StringEditorComponent,
				cellStyle: this.getStringCellStyle,
				field: "foodGuideServingMeasure",
				width: 150
			},
			{
				headerName: "FG Serving Last Update Date",
				cellStyle: this.getExtendedCellStyle,
				field: "foodGuideUpdateDate",
				hide: true,	
				width: 150
			},
			{
				headerName: "Tier 4 Serving (g)",
				editable: true,
				cellRenderer: this.getNumValue,
				cellEditorFramework: NumericEditorComponent,
				cellStyle: this.getNumCellStyle,
				field: "tier4ServingG",
				width: 150
			},
			{
				headerName: "Tier 4 Serving (measure)",
				cellRenderer: this.getStringValue,
				cellEditorFramework: StringEditorComponent,
				cellStyle: this.getStringCellStyle,
				editable: true,
				field: "tier4ServingMeasure",
				width: 150
			},
			{
				headerName: "Tier 4 Serving Last Update Date",
				cellStyle: this.getExtendedCellStyle,
				field: "tier4ServingUpdateDate",
				hide: true,	
				width: 150
			},
			{
				headerName: "Rolled Up",
				cellEditorFramework: BooleanEditorComponent,
				cellRendererFramework: BooleanRendererComponent,
				cellStyle: this.getBooleanCellStyle,
				editable: true,
				field: "rolledUp",
				width: 150
			},
			{
				headerName: "Rolled Up Last Update Date",
				cellStyle: this.getExtendedCellStyle,
				field: "rolledUpUpdateDate",
				hide: true,	
				width: 150
			},
			{
				headerName: "Override Small RA Adj",
				cellEditorFramework: BooleanEditorComponent,
				cellRendererFramework: BooleanRendererComponent,
				cellStyle: this.getBooleanCellStyle,
				editable: true,
				field: "overrideSmallRaAdjustment",
				width: 150
			},
			{
				headerName: "Toddler Item",
				cellEditorFramework: BooleanEditorComponent,
				cellRendererFramework: BooleanRendererComponent,
				cellStyle: this.getBooleanCellStyle,
				editable: true,
				field:"marketedToKids",
				width: 118
			},
			{
				headerName: "Replacement Code",
				cellRenderer: this.getNumValue,
				cellEditorFramework: NumericEditorComponent,
				cellStyle: this.getNumCellStyle,
				editable: true,
				field: "replacementCode",
				width:118
			},
			{
				headerName: "Comments",
				cellRenderer: this.getStringValue,
				cellEditorFramework: StringEditorComponent,
				cellStyle: this.getStringCellStyle,
				editable: true,
				field: "comments",
				width: 200
			},
			///////////////////////
			// STEP 1 RA Adjustments
			////////////////////////
			{
				headerName: "Adjusted RA",
				cellStyle: this.getRefAmountCellStyle,
				field:"adjustedReferenceAmount",
				hide: true,
				width:118
			},
			{
				headerName: "Sodium per RA",
				cellStyle: this.getRefAmountCellStyle,
				field:"sodiumPerReferenceAmount",
				hide: true,
				width:118
			},
			{
				headerName: "Sugar per RA",
				cellStyle: this.getRefAmountCellStyle,
				field:"sugarPerReferenceAmount",
				hide: true,
				width:118
			},
			{
				headerName: "TransFat per RA",
				cellStyle: this.getRefAmountCellStyle,
				field:"transFatPerReferenceAmount",
				hide: true,
				width:118
			},
			{
				headerName: "SatFat per RA",
				cellStyle: this.getRefAmountCellStyle,
				field:"satFatPerReferenceAmount",
				hide: true,
				width:118
			},
			{
				headerName: "TotalFat per RA",
				cellStyle: this.getRefAmountCellStyle,
				field:"fatPerReferenceAmount",
				hide: true,
				width:118
			},
			/////////////////////////////
			//// STEP 2 THRESHOLD RULES
			//////////////////////////////
			{
				headerName: "Low Sodium",
				cellStyle: this.getThresholdCellStyle,
				field:"lowSodium",
				hide: true,
				width: 118
			},
			{
				headerName: "High Sodium",
				cellStyle: this.getThresholdCellStyle,
				field:"highSodium",
				hide: true,
				width: 118
			},
			{
				headerName: "Low Sugar",
				cellStyle: this.getThresholdCellStyle,
				field:"lowSugar",
				hide: true,
				width: 118
			},
			{
				headerName: "High Sugar",
				cellStyle: this.getThresholdCellStyle,
				field:"highSugar",
				hide: true,
				width: 118
			},
			{
				headerName: "Low Transfat",
				cellStyle: this.getThresholdCellStyle,
				field:"lowTransFat",
				hide: true,
				width: 118
			},
			{
				headerName: "High Transfat",
				cellStyle: this.getThresholdCellStyle,
				field:"highTransFat",
				hide: true,
				width: 118
			},
			{
				headerName: "Low SatFat",
				cellStyle: this.getThresholdCellStyle,
				field:"lowSatFat",
				hide: true,
				width: 118
			},
			{
				headerName: "High SatFat",
				cellStyle: this.getThresholdCellStyle,
				field:"highSatFat",
				hide: true,
				width: 118
			},
			{
				headerName: "Low TotalFat",
				cellStyle: this.getThresholdCellStyle,
				field:"lowFat",
				hide: true,
				width: 118
			},
			{
				headerName: "High TotalFat",
				cellStyle: this.getThresholdCellStyle,
				field:"highFat",
				hide: true,
				width: 118
			},
			{
				headerName: "SatFat FOP Symbol",
				cellStyle: this.getThresholdCellStyle,
				field:"satFatFopWarning",
				hide: true,
				width: 118
			},
			{
				headerName: "Sugar FOP Symbol",
				cellStyle: this.getThresholdCellStyle,
				field:"sugarFopWarning",
				hide: true,
				width: 118
			},
			{
				headerName: "Sodium FOP Symbol",
				cellStyle: this.getThresholdCellStyle,
				field:"sodiumFopWarning",
				hide: true,
				width: 118
			},
			{
				headerName: "Initial CFG Code",
				cellStyle: this.getThresholdCellStyle,
				field:"initialCfgCode",
				hide: true,
				width: 118
			},
			////////////////////////////////////
			//STEP 3 ADJUSTMENT RULES
			//////////////////////////////////////
			{
				headerName: "Shift Tier",
				cellStyle: this.getAdjCellStyle,
				field:"shift",
				hide: true,
				width: 118
			},
			{
				headerName: "Absolute Tier",
				cellStyle: this.getAdjCellStyle,
				field:"tier",
				hide: true,
				width: 118
			},
			{
				headerName: "Final CFG Code",
				cellStyle: this.getFinalCfgCodeCellStyle,
				field: "classifiedCfgCode",
				hide: true,
				width: 118
			}
		];
	}

	ngOnInit() {
		this.route.params.subscribe(params =>{
			this.datasetId = params['id'];

			//todo fix this properly
			//if(this.datasetId == 'prod' || this.datasetId == 'sandbox'){
				//this.env = this.datasetId;
				//this.datasetId = undefined;
			//}
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
				this.dataset.status = "In Progress";
				this.setDataset(this.dataset);
			},
			(err) =>{
				console.log(err);
			});
	}

	private	setDataset(dataset:any){
		this.dataset=dataset;
		this.gridOptions.api.setRowData(dataset.data);
	}

	onSaveClick(userSave:boolean = false){
		let config = new MdDialogConfig();
		config.width = '600px';

		//if first time save
		if(this.dataset.name == undefined){
			let dialogRef = this.dialog.open(SaveViewComponent, config);
			dialogRef.afterClosed().subscribe(saveObj => {
				if (saveObj != "cancel"){
					this.dataset.name=saveObj.datasetName;
					this.dataset.status = "In Progress";
					this.dataset.owner = "Sydney Crosby";
					this.dataset.comments=saveObj.datasetComments;
					this.saveDataset(true);
				}
			});
		}else{
			this.saveDataset(userSave);
		}
	}

	saveDataset(userSave:boolean = false){
		//ToDo
		//if(status) this.dataset.status = status;

		// do not save classified state
		let datasetToSave = Object.assign({}, this.dataset);
		if (datasetToSave.status == 'Classified'){
			datasetToSave.status = 'Validated';
		}

		this.saveService.save(datasetToSave).subscribe(
			(res) => {
				//if first time save, assign id
				if(this.dataset.id == undefined){
					this.dataset.id = res.id;
				}
				console.log(res);
				
				if(userSave && this.validationFailed == false){
					this.element.nativeElement.dispatchEvent(
						new CustomEvent(
							'popup',
							{
								detail: {
									message: "Dataset successfully saved.",
									showOkButton: true
								},
								bubbles:true
							}
						)
					);
				}
				if(this.callbackSubmit){
					this.callbackSubmit = false;
					this.onSubmitClick();
				}
			},
			(err) => {
				console.log(err);
			});
	}

	ngAfterContentChecked(){
		if(this.agGrid._nativeElement.querySelector('.ag-body-container')){
			this.height = 68 + this.agGrid._nativeElement.querySelector('.ag-body-container').offsetHeight + 20;
		}

		if(this.gridPlaceHolder.nativeElement.clientHeight < this.height){
			this.height = this.gridPlaceHolder.nativeElement.clientHeight;
		}
	}

	private getExtendedCellStyle(params:any){
		if (params.context.mainInterface.dataset.status == 'Classified'){
			return params.node.rowIndex % 2 == 0 ? {backgroundColor: '#d9edf7'}/*light blue*/ : {backgroundColor: '#95B9C7'};
		}

		return;
	}

	private getRefAmountCellStyle(params:any){
		if (params.context.mainInterface.dataset.status == "Classified"){
			return params.node.rowIndex % 2 == 0 ? {backgroundColor: '#ffffcc'}/*yellow*/ : {backgroundColor: 'rgba(255,215,64,0.7)'};
		}
	}

	private getThresholdCellStyle(params:any){
		if (params.context.mainInterface.dataset.status == "Classified"){
			return params.node.rowIndex % 2 == 0 ? {backgroundColor: 'rgb(241,232,255)'}/*magenta*/ : {backgroundColor: 'rgb(170,131,179)'};
		}
	}
	
	private getAdjCellStyle(params:any){
		if (params.context.mainInterface.dataset.status == "Classified"){
			return params.node.rowIndex % 2 == 0 ? {backgroundColor: '#ffdecd'}/*red*/ : {backgroundColor: '#ff8d85'};
		}
	}

	getNumCellStyle(params:any):any{
		if(params.context.validationMode && (params.value==null||params.value.value==null)){
			return {backgroundColor: '#FFFFCC'};//light yellow
		}
		else if(params.value != null && params.value.modified == true){
			return {backgroundColor: '#FFBFBC'};//light red
		}else if(params.context.mainInterface.isExtendedData(params.column.colId)){
			return params.context.mainInterface.getExtendedCellStyle(params);
		}
	}

	private getFinalCfgCodeCellStyle(params:any):any{
		if(params.value && params.data.cfgCode.value != params.value){
			return params.node.rowIndex % 2 == 0 ? {backgroundColor: '#dff0d8'}/*light green*/ : {backgroundColor: 'rgb(181,214,168)'};
		}
	}
	
	getNameCellStyle(params:any):any{
		if(params.data.classifiedCfgCode && params.data.classifiedCfgCode != params.data.cfgCode.value){
			return params.node.rowIndex % 2 == 0 ? {backgroundColor: '#dff0d8'}/*light green*/ : {backgroundColor: 'rgb(181,214,168)'};
		}
	}


	getStringCellStyle(params:any):any{
		if(params.context.validationMode && (params.value==null||params.value.value==null)){
			return {backgroundColor: '#FFFFCC'};//light yellow
		}
		else if(params.value != null && params.value.modified == true){
			return {backgroundColor: '#FFBFBC'};//light red
		}else if(params.context.mainInterface.isExtendedData(params.column.colId)){
			return params.context.mainInterface.getExtendedCellStyle(params);
		}
	}

	getBooleanCellStyle(params:any):any{
		if (params.context.validationMode && (params.value==null||params.value.value==null)){
			return {backgroundColor: '#FFFFCC'};//light yellow
		}
		else if(params.value != null && params.value.modified == true){
			return {backgroundColor: '#FFBFBC'};
		}else if(params.context.mainInterface.isExtendedData(params.column.colId)){
			return params.context.mainInterface.getExtendedCellStyle(params);
		}
	}

	getNumValue(params:any):any{
		return params.value ? params.value.value : null;
	}

	getStringValue(param:any):any{
		return param.value ? param.value.value : null;
	}

	getBooleanValue(param:any):any{
		return param.value ? param.value.value: null;
	}

	onSubmitClick(){
		if(this.dataset.name == null){
			this.callbackSubmit=true;
			this.onSaveClick();
			return;
		}

		this.validateData();
		this.validationMode = true;
		this.gridOptions.context.validationMode = true;
		this.gridOptions.api.refreshView();
		this.saveDataset();

		if(this.validationFailed){
			this.element.nativeElement.dispatchEvent(
				new CustomEvent('popup', {
					detail:{
						message:"Validation failed, please verify all amber field values.",
						showOkButton: true
					},
					bubbles:true
				}
				)
			);
			this.showMissingDiv.nativeElement.style.display = "none";
			this.showAllDiv.nativeElement.style.display = "inline";
			this.gridOptions.api.onFilterChanged();
		}else{
			this.element.nativeElement.dispatchEvent(
				new CustomEvent('popup', {
					detail:{
						message:"Dataset sent to Canada Food Guide administrator.",
						showOkButton: true
					},
					bubbles:true
				}
				)
			);
		}
	}

	onValidateClick(){
		this.clearModifiedFlags();
		this.validationMode = false;
		this.gridOptions.context.validationMode = false;
		this.gridOptions.api.refreshView();
		this.dataset.status = "Validated";
		this.saveDataset();
	}

	onClassifyClick(env:string='prod'){
		if(env=='prod'){
			this.classifyService.classify(this.dataset.id).subscribe(
				(res) => {
					this.setBaseClassified();
					this.setDataset(res);
				},
				(err) => {
					console.log(err);
				}
			);
		}else if (env=='sandbox'){
			this.classifyService.classifySandbox(this.dataset).subscribe(
				(res) => {
					this.setBaseClassified();
					this.setDataset(res);
				},
				(err) => {
					console.log(err);
				}
			)
		}
	}

	onRejectClick(){
		this.dataset.status="Rejected";
		this.resetColumnVisibility();
		this.saveDataset();
	}

	onExportClick(){
		//save data
		let data = [];
		for (let field of this.dataset.data){
			data.push(Object.assign({}, field));
		}

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
			fileName: "classification_data.csv",
			columnSeparator: "\t"
		};

		this.unwrapData();
		this.gridOptions.api.exportDataAsCsv(params);

		//restore saved data
		this.dataset.data = data;
		this.setDataset(this.dataset);
		this.gridOptions.api.refreshView();
	}

	resetColumnVisibility(){
		for (let columnNum in this.gridOptions.columnDefs){
 			if(["name","type","code","cfgCode","energyKcal","sodiumAmountPer100g","sodiumImputationReference","sugarAmountPer100g","sugarImputationReference","transfatAmountPer100g","transfatImputationReference","satfatAmountPer100g","satfatImputationReference","totalFatAmountPer100g","containsAddedSodium","containsAddedSugar","containsFreeSugars","containsAddedFat","containsAddedTransfat","containsCaffeine","containsSugarSubstitutes","referenceAmountG","referenceAmountMeasure","foodGuideServingG","foodGuideServingMeasure","tier4ServingG","tier4ServingMeasure","rolledUp","overrideSmallRaAdjustment","marketedToKids","replacementCode","comments"].includes((<any>this.gridOptions.columnDefs[columnNum]).field)==true){
				(<any>this.gridOptions.columnDefs[columnNum]).hide = false;
			}else{
				(<any>this.gridOptions.columnDefs[columnNum]).hide = true;
			}
		}
		this.gridOptions.api.setColumnDefs(this.gridOptions.columnDefs);
	}
	
	private isExtendedData(colId:string):boolean{
		return ["energyKcal",
				"sodiumAmountPer100g",
				"sodiumImputationReference",
				"sugarAmountPer100g",
				"sugarImputationReference",
				"transfatAmountPer100g",
				"transfatImputationReference",
				"satfatAmountPer100g",
				"satfatImputationReference",
				"totalFatAmountPer100g",
				"containsAddedSodium",
				"containsAddedSugar",
				"containsFreeSugars",
				"containsAddedFat",
				"containsAddedTransfat",
				"containsCaffeine",
				"containsSugarSubstitutes",
				"referenceAmountG",
				"referenceAmountMeasure",
				"foodGuideServingG",
				"foodGuideServingMeasure",
				"tier4ServingG",
				"tier4ServingMeasure",
				"rolledUp",
				"overrideSmallRaAdjustment",
				"marketedToKids",
				"replacementCode",
				"comments"
				].includes(colId);
	}

	setBaseClassified(){
		for (let columnNum in this.gridOptions.columnDefs){
			if(["type","code","name","cfgCode","classifiedCfgCode"].includes((<any>this.gridOptions.columnDefs[columnNum]).field)==true){
				(<any>this.gridOptions.columnDefs[columnNum]).hide = false;
			}else{
				(<any>this.gridOptions.columnDefs[columnNum]).hide = true;
			}
		}
		this.gridOptions.api.setColumnDefs(this.gridOptions.columnDefs);
		this.gridOptions.api.sizeColumnsToFit();
	}

	toggleRA(){
		for (let columnNum in this.gridOptions.columnDefs){
			if(["adjustedReferenceAmount","sodiumPerReferenceAmount","sugarPerReferenceAmount","transFatPerReferenceAmount","satFatPerReferenceAmount","fatPerReferenceAmount"].includes((<any>this.gridOptions.columnDefs[columnNum]).field)==true){
				(<any>this.gridOptions.columnDefs[columnNum]).hide = !(<any>this.gridOptions.columnDefs[columnNum]).hide;
			}
		}
		this.gridOptions.api.setColumnDefs(this.gridOptions.columnDefs);
		this.gridOptions.api.ensureColumnVisible('adjustedReferenceAmount');
		this.gridOptions.api.ensureColumnVisible('sodiumPerReferenceAmount');
		this.gridOptions.api.ensureColumnVisible('sugarPerReferenceAmount');
		this.gridOptions.api.ensureColumnVisible('transFatPerReferenceAmount');
		this.gridOptions.api.ensureColumnVisible('satFatPerReferenceAmount');
		this.gridOptions.api.ensureColumnVisible('fatPerReferenceAmount');
	}

	toggleExt(){
		for (let columnNum in this.gridOptions.columnDefs){
			if(["energyKcal","sodiumAmountPer100g","sugarAmountPer100g","transfatAmountPer100g","satfatAmountPer100g","totalFatAmountPer100g","containsAddedSodium","containsAddedSugar","containsFreeSugars","containsAddedFat","containsAddedTransfat","containsCaffeine","containsSugarSubstitutes","referenceAmountG","rolledUp","overrideSmallRaAdjustment","marketedToKids","replacementCode"].includes((<any>this.gridOptions.columnDefs[columnNum]).field)==true){
				(<any>this.gridOptions.columnDefs[columnNum]).hide = !(<any>this.gridOptions.columnDefs[columnNum]).hide;
			}
		}
		this.gridOptions.api.setColumnDefs(this.gridOptions.columnDefs);
		this.gridOptions.api.ensureColumnVisible('energyKcal');
	}

	toggleThres(){
		for (let columnNum in this.gridOptions.columnDefs){
			if(["lowSodium","highSodium","lowSugar","highSugar","lowTransFat","highTransFat","lowSatFat","highSatFat","lowFat","highFat","satFatFopWarning","sugarFopWarning","sodiumFopWarning","initialCfgCode"].includes((<any>this.gridOptions.columnDefs[columnNum]).field)==true){

				(<any>this.gridOptions.columnDefs[columnNum]).hide = !(<any>this.gridOptions.columnDefs[columnNum]).hide;
			}
		}
		this.gridOptions.api.setColumnDefs(this.gridOptions.columnDefs);
		this.gridOptions.api.ensureColumnVisible('lowSodium');
		this.gridOptions.api.ensureColumnVisible('highSodium');
		this.gridOptions.api.ensureColumnVisible('lowSugar');
		this.gridOptions.api.ensureColumnVisible('highSugar');
		this.gridOptions.api.ensureColumnVisible('lowTransFat');
		this.gridOptions.api.ensureColumnVisible('highTransFat');
		this.gridOptions.api.ensureColumnVisible('lowSatFat');
		this.gridOptions.api.ensureColumnVisible('highSatFat');
		this.gridOptions.api.ensureColumnVisible('lowFat');
		this.gridOptions.api.ensureColumnVisible('highFat');
		this.gridOptions.api.ensureColumnVisible('satFatFopWarning');
		this.gridOptions.api.ensureColumnVisible('sugarFopWarning');
		this.gridOptions.api.ensureColumnVisible('sodiumFopWarning');
		this.gridOptions.api.ensureColumnVisible('initialCfgCode');
		this.gridOptions.api.ensureColumnVisible('lowSodium');
	}

	toggleAdj(){
		for (let columnNum in this.gridOptions.columnDefs){
			if(["shift","tier"].includes((<any>this.gridOptions.columnDefs[columnNum]).field)==true){

				(<any>this.gridOptions.columnDefs[columnNum]).hide = !(<any>this.gridOptions.columnDefs[columnNum]).hide;
			}
		}
		this.gridOptions.api.setColumnDefs(this.gridOptions.columnDefs);
		this.gridOptions.api.ensureColumnVisible('shift');
		this.gridOptions.api.ensureColumnVisible('tier');
	}

	/* 
	 * Unwraps the grid data object values.  Sets the grid data to equal the value property.  This
	 * is data loss so remember to save data prior if you need it.
	 */
	private unwrapData(){
		for (let columnNum in this.gridOptions.columnDefs){
			for (let num=0;num<this.dataset.data.length;num++){
				switch((<any>this.gridOptions.columnDefs[columnNum]).field){
					case "cfgCode":
						this.dataset.data[num].cfgCode = this.dataset.data[num].cfgCode.value;
						break;
					case "sodiumAmountPer100g":
						this.dataset.data[num].sodiumAmountPer100g= this.dataset.data[num].sodiumAmountPer100g.value;
						break;
					case "sodiumImputationReference":
						this.dataset.data[num].sodiumImputationReference= this.dataset.data[num].sodiumImputationReference.value;
						break;
					case "sugarAmountPer100g":
						this.dataset.data[num].sugarAmountPer100g = this.dataset.data[num].sugarAmountPer100g.value;
						break;
					case "sugarImputationReference":
						this.dataset.data[num].sugarImputationReference = this.dataset.data[num].sugarImputationReference.value;
						break;
					case "transfatAmountPer100g":
						this.dataset.data[num].transfatAmountPer100g = this.dataset.data[num].transfatAmountPer100g.value;
						break;
					case "transfatImputationReference":
						this.dataset.data[num].transfatImputationReference = this.dataset.data[num].transfatImputationReference.value;
						break;
					case "satfatAmountPer100g":
						this.dataset.data[num].satfatAmountPer100g = this.dataset.data[num].satfatAmountPer100g.value;
						break;
					case "satfatImputationReference":
						this.dataset.data[num].satfatImputationReference = this.dataset.data[num].satfatImputationReference.value;
						break;
					case "totalFatAmountPer100g":
						this.dataset.data[num].totalFatAmountPer100g = this.dataset.data[num].totalFatAmountPer100g.value;
						break;
					case "containsAddedSodium":
						this.dataset.data[num].containsAddedSodium = this.dataset.data[num].containsAddedSodium.value;
						break;
					case "containsAddedSugar":
						this.dataset.data[num].containsAddedSugar = this.dataset.data[num].containsAddedSugar.value;
						break;
					case "containsFreeSugars":
						this.dataset.data[num].containsFreeSugars = this.dataset.data[num].containsFreeSugars.value;
						break;
					case "containsAddedFat":
						this.dataset.data[num].containsAddedFat = this.dataset.data[num].containsAddedFat.value;
						break;
					case "containsAddedTransfat":
						this.dataset.data[num].containsAddedTransfat = this.dataset.data[num].containsAddedTransfat.value;
						break;
					case "containsCaffeine":
						this.dataset.data[num].containsCaffeine = this.dataset.data[num].containsCaffeine.value;
						break;
					case "containsSugarSubstitutes":
						this.dataset.data[num].containsSugarSubstitutes = this.dataset.data[num].containsSugarSubstitutes.value;
						break;
					case "foodGuideServingG":
						this.dataset.data[num].foodGuideServingG = this.dataset.data[num].foodGuideServingG.value;
						break;
					case "foodGuideServingMeasure":
						this.dataset.data[num].foodGuideServingMeasure = this.dataset.data[num].foodGuideServingMeasure.value;
						break;
					case "tier4ServingG":
						this.dataset.data[num].tier4ServingG = this.dataset.data[num].tier4ServingG.value;
						break;
					case "tier4ServingMeasure":
						this.dataset.data[num].tier4ServingMeasure = this.dataset.data[num].tier4ServingMeasure.value;
						break;
					case "rolledUp":
						this.dataset.data[num].rolledUp = this.dataset.data[num].rolledUp.value;
						break;
					case "replacementCode":
						this.dataset.data[num].replacementCode = this.dataset.data[num].replacementCode.value;
						break;
				}
			}
		}
	}

	/*
	//Searches mandatory fields and does a null check, if no nulls
	//found then sets status to pending validation
	 */
	private validateData(){
		this.validationFailed = false;

		for (let columnNum in this.gridOptions.columnDefs){
			for (let num=0;num<this.dataset.data.length;num++){
				// totalfatAmountPer100g
				if(columnNum=="0"){
					this.dataset.data[num].totalFatAmountPer100g.value = 69;
					this.dataset.data[num].missingData = false;
				}

				switch((<any>this.gridOptions.columnDefs[columnNum]).field){
						// Num values
					case "cfgCode":
					case "sodiumAmountPer100g":
					case "sugarAmountPer100g":
					case "transfatAmountPer100g":
					case "satfatAmountPer100g":
					case "totalFatAmountPer100g":
					case "foodGuideServingG":
					case "tier4ServingG":
						// String values	
					case "sodiumImputationReference":
					case "sugarImputationReference":
					case "transfatImputationReference":
					case "foodGuideServingMeasure":
					case "tier4ServingMeasure":
					case "satfatImputationReference":
						// boolean values
					case "containsAddedSodium":
					case "containsAddedSugar":
					case "containsFreeSugars":
					case "containsAddedFat":
					case "containsAddedTransfat":
					case "containsCaffeine":
					case "containsSugarSubstitutes":
					case "rolledUp":
					case "marketedToKids":
					case "overrideSmallRaAdjustment":
						if(this.dataset.data[num][(<any>this.gridOptions.columnDefs[columnNum]).field].value == null){
							console.log('Validation Failed: found null on field ' + (<any>this.gridOptions.columnDefs[columnNum]).field);
							if(!this.validationFailed){
								this.gridOptions.api.ensureColumnVisible((<any>this.gridOptions.columnDefs[columnNum]).field);
								this.gridOptions.api.ensureNodeVisible(this.dataset.data[num]);
							}
							this.validationFailed = true;
							this.dataset.data[num].missingData = true;
						}
						break;
				}
			}
		}

		if(this.validationFailed){
			return;
		}

		this.dataset.status = "Pending Validation";
	}

	/*
	//Sets all modified flags to false
	 */
	private clearModifiedFlags(){
		for (let columnNum in this.gridOptions.columnDefs){
			for (let num=0;num<this.dataset.data.length;num++){
				switch((<any>this.gridOptions.columnDefs[columnNum]).field){
						// Num values
					case "cfgCode":
					case "sodiumAmountPer100g":
					case "sugarAmountPer100g":
					case "transfatAmountPer100g":
					case "satfatAmountPer100g":
					case "totalFatAmountPer100g":
					case "foodGuideServingG":
					case "tier4ServingG":
						// String values	
					case "sodiumImputationReference":
					case "sugarImputationReference":
					case "transfatImputationReference":
					case "foodGuideServingMeasure":
					case "tier4ServingMeasure":
					case "satfatImputationReference":
					case "comments":
						// boolean values
					case "containsAddedSodium":
					case "containsAddedSugar":
					case "containsFreeSugars":
					case "containsAddedFat":
					case "containsAddedTransfat":
					case "containsCaffeine":
					case "containsSugarSubstitutes":
					case "rolledUp":
					case "replacementCode":
					case "marketedToKids":
					case "overrideSmallRaAdjustment":
						this.dataset.data[num][(<any>this.gridOptions.columnDefs[columnNum]).field].modified = false;
						break;
				}
			}
		}
	}

	private openColumnVisibility(){
		let config = new MdDialogConfig();
		config.width = '1100px';

		let columnVisibilityPopup = this.dialog.open(ColumnVisibilityComponent, config);
		columnVisibilityPopup.componentInstance.columns = this.getColumnVisibility();
		columnVisibilityPopup.componentInstance.datasetStatus = this.dataset.status;
		columnVisibilityPopup.afterClosed().subscribe(columns => {
			this.setColumnVisibility(columns);
		});
	}

	private getColumnVisibility():any{
		let columns = [];

		for (let columnNum in this.gridOptions.columnDefs){

			let column = {	name:(<any>this.gridOptions.columnDefs[columnNum]).headerName,
				field:(<any>this.gridOptions.columnDefs[columnNum]).field,
				selected:!(<any>this.gridOptions.columnDefs[columnNum]).hide
			};
			columns.push(column);
		}	

		return columns;
	}

	private setColumnVisibility(columns){
		for (let columnNum in this.gridOptions.columnDefs){
			(<any>this.gridOptions.columnDefs[columnNum]).hide = !columns[columnNum].selected;
		}

		this.gridOptions.api.setColumnDefs(this.gridOptions.columnDefs);
		//this.gridOptions.api.sizeColumnsToFit();
	}

	private onShowMissingClick(){
		this.showMissingDiv.nativeElement.style.display='none';
		this.showAllDiv.nativeElement.style.display='inline';
		this.gridOptions.api.onFilterChanged();
	}

	private isExternalFilterPresent(){
		if ((<any>this).context.mainInterface.dataset.status != 'In Progress'){
			return false;
		}

		return (<any>this).context.mainInterface.validationFailed;
	}

	private doesExternalFilterPass(node){
		if((<any>this).context.mainInterface.showMissingDiv.nativeElement.style.display=="inline"){
			return true;
		}
		return node.data.missingData;
	}

	private onShowAllClick($event){
		this.showMissingDiv.nativeElement.style.display='inline';
		this.showAllDiv.nativeElement.style.display='none';
		this.gridOptions.api.onFilterChanged();
	}
}
