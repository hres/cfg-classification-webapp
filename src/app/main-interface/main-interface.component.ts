import { Component, OnInit, ViewChild, AfterContentChecked, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { GridOptions } from 'ag-grid';

import { QueryService } from '../services/query.service';
import { SaveService } from '../services/save.service';
import { OpenService } from '../services/open.service';
import { RulesetsService } from '../services/rulesets.service';
import { ClassifyService } from '../services/classify.service';
import { CfgModel }			from '../model/cfg.model';
import { SaveViewComponent } from '../save-view/save-view.component';
import { SpinnerComponent }			from '../spinner-component/spinner.component';
import { ColumnVisibilityComponent }	from '../column-visibility/column-visibility.component';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { NumericEditorComponent } from './numeric-editor/numeric-editor.component';
import { BooleanEditorComponent } from './boolean-editor/boolean-editor.component';
import { BooleanRendererComponent } from './boolean-renderer/boolean-renderer.component';
import { StringEditorComponent } from './string-editor/string-editor.component';
import { NoSelectionRendererComponent } from './no-selection-renderer/no-selection-renderer.component';
//import { CalendarHeaderComponent2 } 		from './calendar-header2/calendar-header2.component';
import { TwoDecimalRendererComponent }	from './two-decimal-renderer/two-decimal-renderer.component';

import { MissingNumericFilter } from './missing-numeric-filter/missing-numeric-filter.component';
import { MissingStringFilter }		from './missing-string-filter/missing-string-filter.component';
import { MissingBooleanFilter }		from './missing-boolean-filter/missing-boolean-filter.component';
import { FoodRecipeFilter }			from './custom-filters/food-recipe-filter/food-recipe-filter.component';

@Component({
	selector: 'app-main-interface',
	templateUrl: './main-interface.component.html',
	styleUrls: ['./main-interface.component.css'],
	providers: [SaveService, OpenService, ClassifyService, RulesetsService]
})

export class MainInterfaceComponent implements OnInit, AfterContentChecked {
	@ViewChild('agGrid')
	agGrid:any;

	@ViewChild('gridPlaceHolder')
	gridPlaceHolder:any;

	@ViewChild('showMissingDiv')
	showMissingDiv:any;

	@ViewChild('showInReviewDiv')
	showInReviewDiv:any;

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
	private rowCount:number = 0;

	private selectedRuleset: any;
	private	rulesets;

	constructor(private queryService: QueryService,
		private saveService: SaveService,
		private openService: OpenService,
		private classifyService: ClassifyService,
		private rulesetsService: RulesetsService,
		private dialog: MatDialog,
		private route:ActivatedRoute,
		private cfgModel:CfgModel,
		private element:ElementRef,
		private router:Router) {

		this.gridOptions={
			context:{validationMode:this.validationMode,
					 mainInterface:this
					},
			enableFilter: true,
			enableSorting: true,
			headerHeight: 48,
			enableColResize: true,
			isExternalFilterPresent: this.isExternalFilterPresent,
			doesExternalFilterPass: this.doesExternalFilterPass,
			rowSelection: 'multiple',
			suppressRowClickSelection: true,
		};

		this.gridOptions.debug = true;
		this.gridOptions.columnDefs=[
			{
				headerName: '',
				field: "selection",
				headerCheckboxSelection: true,
				headerCheckboxSelectionFilteredOnly: true,
				hide: true,
				pinned: "left",
				checkboxSelection: true,
				suppressSorting: true,
				suppressFilter: true,
				width: 25
			},
			///////////////
			//BASE ITEM DATA
			///////////////
			{
				headerName: "Food / Recipe Code",
				cellRendererFramework: NoSelectionRendererComponent,
				field: "code",
				filter: 'number',
				pinned: "left",
				width: 104
			},
			{
				headerName: "Food / Recipe Name",
				cellStyle: this.getNameCellStyle,
				cellRendererFramework: NoSelectionRendererComponent,
				field: "name",
				pinned: "left",
				width: 390
			},
			{
				headerName: "Type",
				cellRendererFramework: NoSelectionRendererComponent,
				field: "type",
				filterFramework: FoodRecipeFilter,
				width: 65
			},
			{
				headerName: "CNF Group Code",
				cellRendererFramework: NoSelectionRendererComponent,
				field: "cnfGroupCode",
				width: 92
			},
			{
				headerName: "CFG Code",
				//headerComponent: CalendarHeaderComponent2,
				cellRenderer: this.getNumValue,
				cellEditorFramework: NumericEditorComponent,
				cellStyle: this.getNumCellStyle,
				editable: true,
				field: "cfgCode",
				filter: "number",
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
				cellRendererFramework: NoSelectionRendererComponent,
				cellStyle: this.getExtendedCellStyle,
				field: "energyKcal",
				filter: 'number',
				valueFormatter: this.roundToTwoDecimal,
				width: 100
			},
			{
				headerName: "Sodium (mg/100g)",
				cellRendererFramework: TwoDecimalRendererComponent,
				cellEditorFramework: NumericEditorComponent,
				cellStyle: this.getNumCellStyle,
				editable: true,
				field: "sodiumAmountPer100g",
				filterFramework: MissingNumericFilter,
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
				cellRendererFramework: TwoDecimalRendererComponent,
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
				cellRendererFramework: TwoDecimalRendererComponent,
				cellEditorFramework: NumericEditorComponent,
				cellStyle: this.getNumCellStyle,
				field: "transfatAmountPer100g",
				filter: 'number',
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
				cellRendererFramework: TwoDecimalRendererComponent,
				cellEditorFramework: NumericEditorComponent,
				cellStyle: this.getNumCellStyle,
				field: "satfatAmountPer100g",
				filter: 'number',
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
				cellRendererFramework: TwoDecimalRendererComponent,
				cellEditorFramework: NumericEditorComponent,
				cellStyle: this.getNumCellStyle,
				field: "totalFatAmountPer100g",
				filter: 'number',
				width: 100
			},
			{
				headerName: "Contains Added Sodium",
				editable: true,
				cellEditorFramework: BooleanEditorComponent,
				cellRendererFramework: BooleanRendererComponent,
				cellStyle: this.getBooleanCellStyle,
				field: "containsAddedSodium",
				filterFramework: MissingBooleanFilter, 
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
				filterFramework: MissingBooleanFilter, 
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
				filterFramework: MissingBooleanFilter, 
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
				filterFramework: MissingBooleanFilter, 
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
				filterFramework: MissingBooleanFilter, 
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
				filterFramework: MissingBooleanFilter, 
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
				filterFramework: MissingBooleanFilter, 
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
				cellRendererFramework: NoSelectionRendererComponent,
				cellStyle: this.getExtendedCellStyle,
				field: "referenceAmountG",
				filter: 'number',
				valueFormatter: this.roundToTwoDecimal,
				width: 100
			},
			{
				headerName: "Reference Amount (measure)",
				cellRendererFramework: NoSelectionRendererComponent,
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
				cellRendererFramework: TwoDecimalRendererComponent,
				cellEditorFramework: NumericEditorComponent,
				cellStyle: this.getNumCellStyle,
				field: "foodGuideServingG",
				filter: 'number',
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
				cellRendererFramework: TwoDecimalRendererComponent,
				cellEditorFramework: NumericEditorComponent,
				cellStyle: this.getNumCellStyle,
				field: "tier4ServingG",
				filter: 'number',
				width: 150
			},
			{
				headerName: "Tier 4 Serving (measure)",
				cellRenderer: this.getStringValue,
				cellEditorFramework: StringEditorComponent,
				cellStyle: this.getStringCellStyle,
				editable: true,
				field: "tier4ServingMeasure",
				filterFramework: MissingStringFilter,
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
				filterFramework: MissingBooleanFilter,
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
				filterFramework: MissingBooleanFilter,
				width: 150
			},
			{
				headerName: "Toddler Item",
				cellEditorFramework: BooleanEditorComponent,
				cellRendererFramework: BooleanRendererComponent,
				cellStyle: this.getBooleanCellStyle,
				editable: true,
				field:"marketedToKids",
				filterFramework: MissingBooleanFilter,
				width: 118
			},
			{
				headerName: "Replacement Code",
				cellRenderer: this.getNumValue,
				cellEditorFramework: NumericEditorComponent,
				cellStyle: this.getNumCellStyle,
				editable: true,
				field: "replacementCode",
				filter: 'number',
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
				valueFormatter: this.roundToTwoDecimal,
				width:118
			},
			{
				headerName: "Sodium per RA",
				cellStyle: this.getRefAmountCellStyle,
				field:"sodiumPerReferenceAmount",
				hide: true,
				valueFormatter: this.roundToTwoDecimal,
				width:118
			},
			{
				headerName: "Sugar per RA",
				cellStyle: this.getRefAmountCellStyle,
				field:"sugarPerReferenceAmount",
				hide: true,
				valueFormatter: this.roundToTwoDecimal,
				width:118
			},
			{
				headerName: "TransFat per RA",
				cellStyle: this.getRefAmountCellStyle,
				field:"transFatPerReferenceAmount",
				hide: true,
				valueFormatter: this.roundToTwoDecimal,
				width:118
			},
			{
				headerName: "SatFat per RA",
				cellStyle: this.getRefAmountCellStyle,
				field:"satFatPerReferenceAmount",
				hide: true,
				valueFormatter: this.roundToTwoDecimal,
				width:118
			},
			{
				headerName: "TotalFat per RA",
				cellStyle: this.getRefAmountCellStyle,
				field:"fatPerReferenceAmount",
				hide: true,
				valueFormatter: this.roundToTwoDecimal,
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
				cellRenderer: this.getValueHideZero,
				cellStyle: this.getAdjCellStyle,
				field:"shift",
				hide: true,
				width: 118
			},
			{
				headerName: "Absolute Tier",
				cellRenderer: this.getValueOnAbsoluteTrue,
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
		//if (!this.cfgModel.isCfgAdmin && !this.cfgModel.isAnalyst){ // is a read only user
		//gridOptions.fu
		//}

		this.route.params.subscribe(params =>{
			this.datasetId = params['id'];

			//todo fix this properly
			//if(this.datasetId == 'prod' || this.datasetId == 'sandbox'){
				//this.env = this.datasetId;
				//this.datasetId = undefined;
			//}
		})

		this.rulesetsService.getRulesets().subscribe(
			(res) => {
				this.rulesets = res.rulesets;

				for(let ruleset of this.rulesets){
					if (ruleset.isProd){
						// Set initial ruleset
						this.selectedRuleset = ruleset.rulesetId;
					}
				}
			}
		)

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
				this.dataset.status = "New";
				this.setDataset(this.dataset);
			},
			(err) =>{
				console.log(err);
			});
	}

	private	setDataset(dataset:any){
		this.dataset=dataset;
		this.gridOptions.api.setRowData(dataset.data);
		
		if(dataset.status == 'Review'){
			this.showAllDiv.nativeElement.style.display = "inline";
			this.gridOptions.api.onFilterChanged();
		}

		this.gridOptions.api.setColumnDefs(this.gridOptions.columnDefs);
		
		this.setSelectedRows();
	}

	private hasValidatedColumn():boolean{
		switch(this.dataset.status){
			case "Pending Validation":
				return true;
		}

		return false;
	}

	onSaveClick(userSave:boolean = false){
		let config = new MatDialogConfig();
		config.width = '600px';

		//if first time save
		if(this.dataset.name == undefined){
			this.dataset.owner = this.cfgModel.userFullName;
			let dialogRef = this.dialog.open(SaveViewComponent, config);
			dialogRef.afterClosed().subscribe(saveObj => {
				if (saveObj != "cancel"){
					this.dataset.name=saveObj.datasetName;
					this.dataset.status = "In Progress";
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
			this.height = 67 + this.agGrid._nativeElement.querySelector('.ag-body-container').offsetHeight;
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
			return params.node.rowIndex % 2 == 0 ? {backgroundColor: '#dff0d8'}/*green*/ : {backgroundColor: 'rgb(181,214,168)'};
		}
	}

	private isNonMandatoryEditable(field:string):boolean{
		return ['replacementCode','comments'].indexOf(field) > -1;
	}

	getNumCellStyle(params:any):any{
		if(params.context.validationMode && !params.context.mainInterface.isNonMandatoryEditable(params.colDef.field) && (params.value==null||params.value.value==null)){
			return {backgroundColor: '#FFFFCC'};//light yellow
		}else if (params.context.validationMode && params.column.colId == 'cfgCode' && (params.value.value.toString().length < 3 || params.value.value.toString().length > 4)){
			return {backgroundColor: '#FFFFCC'};//light yellow
		}else if(params.value != null && params.value.modified == true){
			return {backgroundColor: '#FFBFBC'};//light red
		}else if(params.context.mainInterface.isExtendedData(params.column.colId)){
			return params.context.mainInterface.getExtendedCellStyle(params);
		}
	}

	private getFinalCfgCodeCellStyle(params:any):any{
		if(params.value && params.data.cfgCode.value != params.value){
			return params.node.rowIndex % 2 == 0 ? {backgroundColor: '#ffdecd'}/*light red*/ : {backgroundColor: '#ff8d85'};
		}
	}
	
	getNameCellStyle(params:any):any{
		if(params.data.classifiedCfgCode && params.data.classifiedCfgCode != params.data.cfgCode.value){
			return params.node.rowIndex % 2 == 0 ? {backgroundColor: '#ffdecd'}/*light red*/ : {backgroundColor: '#ff8d85'};
		}
	}


	getStringCellStyle(params:any):any{
		if(params.context.validationMode && !params.context.mainInterface.isNonMandatoryEditable(params.colDef.field) && (params.value==null||params.value.value==null||params.value.value=="")){
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
		return params.value ? params.value.value.toString() : null;
	}

	getStringValue(param:any):any{
		return param.value ? param.value.value : null;
	}

	getBooleanValue(param:any):any{
		return param.value ? param.value.value: null;
	}

	getValueOnAbsoluteTrue(params:any):any{
		return params.data.absolute ? params.value : null;
	}

	getValueHideZero(params:any):any{
		return params.value == 0 ? null : params.value;
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
		this.gridOptions.api.redrawRows();
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
		}else{ //successfully passed data validation
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
			this.router.navigate(['/datasets']);
		}
	}

	private setSelectedRows(){
		// Set checkbox selections
		this.gridOptions.api.forEachNode(
			(node) => {
				if(node.data.validated == undefined){
					node.data.validated = false;
				}else if(node.data.validated){
					node.setSelected(true);
				}
			}
		);

		if (this.cfgModel.isCfgAdmin){
			this.gridOptions.columnApi.setColumnVisible('selection', this.hasValidatedColumn());
		}
	}

	onValidateClick(){
		this.clearModifiedFlags();
		this.validationMode = false;
		this.gridOptions.context.validationMode = false;
		this.gridOptions.columnApi.setColumnVisible('selection', false);
		this.gridOptions.api.redrawRows();
		this.dataset.status = "Validated";
		this.saveDataset();
	}

	onClassifyClick(env:string='prod', rulesetId:number=0){
		let config = new MatDialogConfig();
		config.width = '600px';
		config.height= '400px';
		config.disableClose = true;
		config.panelClass = 'cfg-spinner';

		let dialogRef = this.dialog.open(SpinnerComponent, config);
		
		if(env=='prod'){
			this.classifyService.classify(this.dataset.id).subscribe(
				(res) => {
					this.setBaseClassified();
					this.setDataset(res);
				},
				(err) => {
					console.log(err);
				},
				() => {
					dialogRef.close();
				}
			);
		}else if (env=='sandbox'){
			this.classifyService.classifySandbox(this.dataset, rulesetId).subscribe(
				(res) => {
					this.setBaseClassified();
					this.setDataset(res);
				},
				(err) => {
					console.log(err);
				},
				() => {
					dialogRef.close();
				}
			)
		}
	}

	onUndoClick(){
		this.dataset.status="Validated";
		this.resetColumnVisibility();
	}

	onSendForReviewClick(){
		var selectedCount = this.gridOptions.api.getSelectedNodes().length;

		if(selectedCount == this.dataset.data.length){
			this.element.nativeElement.dispatchEvent(
						new CustomEvent(
							'popup',
							{
								detail: {
									message: "A minimum of one food/recipe item must be deselected to send for a review.",
									showOkButton: true
								},
								bubbles:true
							}
						)
					);

			this.gridOptions.columnApi.setColumnVisible('selection', true);
			return;
		}

		this.dataset.status="Review";
		this.saveDataset();
		this.router.navigate(['/datasets']);
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

		this.exportData();
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
	private exportData(){
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
					case "overrideSmallRaAdjustment":
						this.dataset.data[num].overrideSmallRaAdjustment = this.dataset.data[num].overrideSmallRaAdjustment.value;
						break;
					case "marketedToKids":
						this.dataset.data[num].marketedToKids = this.dataset.data[num].marketedToKids.value;
						break;
					case "replacementCode":
						this.dataset.data[num].replacementCode = this.dataset.data[num].replacementCode.value;
						break;
					case "comments":
						this.dataset.data[num].comments = this.dataset.data[num].comments.value;
						break;
				}
			}
		}
	}

	/*
	//Searches mandatory fields and does a null check, then validates cfgCode, then if all is good,
	//sets status to pending validation
	 */
	private validateData(){
		this.validationFailed = false;

		for (let columnNum in this.gridOptions.columnDefs){
			for (let num=0;num<this.dataset.data.length;num++){
				// totalfatAmountPer100g
				if(columnNum=="0"){
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
					//// String values	
					//case "sodiumImputationReference":
					//case "sugarImputationReference":
					//case "transfatImputationReference":
					case "foodGuideServingMeasure":
					case "tier4ServingMeasure":
					//case "satfatImputationReference":
					//// boolean values
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

		// cfgCode Validation
		for (let rowData of this.dataset.data){
			if(rowData.cfgCode.value && (rowData.cfgCode.value.toString().length < 3 || rowData.cfgCode.value.toString().length > 4)){
				if(!this.validationFailed){
					this.gridOptions.api.ensureColumnVisible('cfgCode');
					this.gridOptions.api.ensureNodeVisible(rowData);
				}
				
				this.validationFailed = true;
				rowData.missingData = true;
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
		let config = new MatDialogConfig();
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

	private onShowInReviewClick(){
		this.showInReviewDiv.nativeElement.style.display='none';
		this.showAllDiv.nativeElement.style.display='inline';
		this.gridOptions.api.onFilterChanged();
	}

	private onShowMissingClick(){
		this.showMissingDiv.nativeElement.style.display='none';
		this.showAllDiv.nativeElement.style.display='inline';
		this.gridOptions.api.onFilterChanged();
	}

	private isExternalFilterPresent(){
		if((<any>this).context.mainInterface.showAllDiv.nativeElement.style.display=="none"){
			return false;
		}else if ((<any>this).context.mainInterface.dataset.status == 'Review'){
			return true;
		}else if ((<any>this).context.mainInterface.dataset.status != 'In Progress'){
			return false;
		}

		return (<any>this).context.mainInterface.validationFailed;
	}

	private doesExternalFilterPass(node){
		if((<any>this).context.mainInterface.dataset.status == "Review"){
			console.log('validated == ' + node.data.validated);
			return node.data.validated == false;
		}
		return node.data.missingData;
	}

	private onShowAllClick($event){
		this.showAllDiv.nativeElement.style.display='none';

		if(this.dataset.status == 'Review'){
			this.showInReviewDiv.nativeElement.style.display='inline';
		}else if (this.dataset.status == 'In Progress'){
			this.showMissingDiv.nativeElement.style.display='inline';
		}else{
			console.log('No operation coded here...');
		}
		this.gridOptions.api.onFilterChanged();
	}
	
	private setRowCount():void{
		if(this.agGrid.api){
			this.rowCount = this.agGrid.api.rowModel.getRowCount();
		}
	}

	private readyToValidate:boolean;

	private onRowSelected($event){
		this.readyToValidate = this.itemsAllSelected();
		$event.node.data.validated = $event.node.isSelected();
	}

	private itemsAllSelected():boolean{
		let retValue:boolean = true;

		this.gridOptions.api.forEachNode(
			(node) => {
				if (!node.isSelected()){
					retValue = false;
				}
			}
		)

		return retValue;
	}

	private isReadOnlyUser():boolean{
		return !this.cfgModel.isCfgAdmin && !this.cfgModel.isAnalyst;
	}

	private isReadOnly():boolean{
		if(this.isReadOnlyUser()){
			return true;
		}else if(this.cfgModel.isAnalyst && (this.dataset.status != 'In Progress' || this.dataset.status != 'Review')){
			return true;
		}

		return false;
	}

	private roundToTwoDecimal(num):string{
		return "" + Math.floor(num.value*100) / 100;
	}
}

