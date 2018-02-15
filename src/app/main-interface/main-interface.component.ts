import { Component, OnInit, ViewChild, AfterContentChecked, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { GridOptions } from 'ag-grid';

import { QueryService } from '../services/query.service';
import { SaveService } from '../services/save.service';
import { OpenService } from '../services/open.service';
import { RulesetsService } from '../services/rulesets.service';
import { ClassifyService } from '../services/classify.service';
import { CommitService } from '../services/commit.service';
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
import * as moment 			from 'moment';

@Component({
	selector: 'app-main-interface',
	templateUrl: './main-interface.component.html',
	styleUrls: ['./main-interface.component.css'],
	providers: [SaveService, OpenService, ClassifyService, RulesetsService, CommitService]
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
	width=25;
	private validationMode:boolean = false;
	private	dataset:any = {"name":null,status:'New'};
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
	private modified:boolean=false;
	private isSearchResult:boolean=false;

	constructor(private queryService: QueryService,
		private saveService: SaveService,
		private openService: OpenService,
		private classifyService: ClassifyService,
		private commitService: CommitService,
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
				checkboxSelection: true,
				field: "selection",
				headerCheckboxSelection: true,
				headerCheckboxSelectionFilteredOnly: true,
				hide: true,
				pinned: "left",
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
				editable: !this.isReadOnly(),
				field: "cfgCode",
				filter: "number",
				valueGetter: this.getObjectValue,
				width: 90
			},
			{
				headerName: "CFG Code Last Update",
				field: "cfgCodeUpdateDate",
				hide: true,
				valueFormatter: this.getDate,
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
				editable: this.isEditableSodiumPer100,
				field: "sodiumAmountPer100g",
				filterFramework: MissingNumericFilter,
				valueGetter: this.getObjectValue,
				width: 127
			},
			{
				headerName: "Sodium Imputation Reference",
				editable: this.isEditableSodiumImputation,
				cellRenderer: this.getStringValue,
				cellEditorFramework: StringEditorComponent,
				cellStyle: this.getStringCellStyle,
				field: "sodiumImputationReference",
				valueGetter: this.getObjectValue,
				width: 142
			},
			{
				headerName: "Sodium Imputation Last Update",
				cellStyle: this.getExtendedCellStyle,
				field: "sodiumImputationDate",
				hide: true,
				valueFormatter: this.getDate,
				width: 150
			},
			{
				headerName: "Sugar (g/100g)",
				cellRendererFramework: TwoDecimalRendererComponent,
				cellEditorFramework: NumericEditorComponent,
				cellStyle: this.getNumCellStyle,
				editable: this.isEditableSugarPer100,
				field: "sugarAmountPer100g",
				valueGetter: this.getObjectValue,
				width: 151
			},
			{
				headerName: "Sugar Imputation Reference",
				cellRenderer: this.getStringValue,
				cellEditorFramework: StringEditorComponent,
				cellStyle: this.getStringCellStyle,
				editable: this.isEditableSugarImputation,
				field: "sugarImputationReference",
				valueGetter: this.getObjectValue,
				width: 151
			},
			{
				headerName: "Sugar Imputation Last Update",
				cellStyle: this.getExtendedCellStyle,
				field: "sugarImputationDate",
				hide: true,
				valueFormatter: this.getDate,
				width: 156
			},
			{
				headerName: "TransFat (g/100g)",
				editable: this.isEditableTransfatPer100,
				cellRendererFramework: TwoDecimalRendererComponent,
				cellEditorFramework: NumericEditorComponent,
				cellStyle: this.getNumCellStyle,
				field: "transfatAmountPer100g",
				filter: 'number',
				valueGetter: this.getObjectValue,
				width: 151
			},
			{
				headerName: "Transfat Imputation Reference",
				cellRenderer: this.getStringValue,
				cellEditorFramework: StringEditorComponent,
				cellStyle: this.getStringCellStyle,
				editable: this.isEditableTransfatImputation,
				field: "transfatImputationReference",
				valueGetter: this.getObjectValue,
				width: 152
			},

			{
				headerName: "TransFat Imputation Last Update",
				cellStyle: this.getExtendedCellStyle,
				field: "transfatImputationDate",
				hide: true,
				valueFormatter: this.getDate,
				width: 151
			},
			{
				headerName: "SatFat (g/100g)",
				editable: this.isEditableSatfatPer100,
				cellRendererFramework: TwoDecimalRendererComponent,
				cellEditorFramework: NumericEditorComponent,
				cellStyle: this.getNumCellStyle,
				field: "satfatAmountPer100g",
				filter: 'number',
				valueGetter: this.getObjectValue,
				width: 152
			},
			{
				headerName: "SatFat Imputation Reference",
				editable: this.isEditableSatfatImputation,
				cellRenderer: this.getStringValue,
				cellEditorFramework: StringEditorComponent,
				cellStyle: this.getStringCellStyle,
				field: "satfatImputationReference",
				valueGetter: this.getObjectValue,
				width: 124
			},
			{
				headerName: "SatFat Imputation Last Update",
				cellStyle: this.getExtendedCellStyle,
				field: "satfatImputationDate",
				hide: true,	
				valueFormatter: this.getDate,
				width: 100
			},
			{
				headerName: "Total Fat (g/100g)",
				editable: this.isEditableTotalFatPer100,
				cellRendererFramework: TwoDecimalRendererComponent,
				cellEditorFramework: NumericEditorComponent,
				cellStyle: this.getNumCellStyle,
				field: "totalFatAmountPer100g",
				filter: 'number',
				valueGetter: this.getObjectValue,
				width: 100
			},
			{
				headerName: "Total Fat Imputation Reference",
				editable: this.isEditableTotalfatImputation,
				cellRenderer: this.getStringValue,
				cellEditorFramework: StringEditorComponent,
				cellStyle: this.getStringCellStyle,
				field: "totalFatImputationReference",
				valueGetter: this.getObjectValue,
				width: 124
			},
			{
				headerName: "Total Fat Imputation Last Update",
				cellStyle: this.getExtendedCellStyle,
				field: "totalFatImputationDate",
				hide: true,	
				valueFormatter: this.getDate,
				width: 100
			},
			{
				headerName: "Contains Added Sodium",
				editable: !this.isReadOnly(),
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
				valueFormatter: this.getDate,
				width: 170
			},
			{
				headerName: "Contains Added Sugar",
				editable: !this.isReadOnly(),
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
				field: "containsAddedSugarUpdateDate",
				hide: true,
				valueFormatter: this.getDate,
				width: 165
			},
			{
				headerName: "Contains Free Sugars",
				editable: !this.isReadOnly(),
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
				valueFormatter: this.getDate,
				width: 165
			},
			{
				headerName: "Contains Added Fat",
				editable: !this.isReadOnly(),
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
				valueFormatter: this.getDate,
				width: 165
			},
			{
				headerName: "Contains TransFat",
				editable: !this.isReadOnly(),
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
				valueFormatter: this.getDate,
				width: 180
			},
			{
				headerName: "Contains Caffeine",
				cellEditorFramework: BooleanEditorComponent,
				cellRendererFramework: BooleanRendererComponent,
				cellStyle: this.getBooleanCellStyle,
				editable: !this.isReadOnly(),
				field: "containsCaffeine",
				filterFramework: MissingBooleanFilter, 
				width: 128
			},
			{
				headerName: "Contains Caffeine Last Update Date",
				cellStyle: this.getExtendedCellStyle,
				field: "containsCaffeineUpdateDate",
				hide: true,	
				valueFormatter: this.getDate,
				width: 150
			},
			{
				headerName: "Contains Sugar Substitutes",
				cellEditorFramework: BooleanEditorComponent,
				cellRendererFramework: BooleanRendererComponent,
				cellStyle: this.getBooleanCellStyle,
				editable: !this.isReadOnly(),
				field: "containsSugarSubstitutes",
				filterFramework: MissingBooleanFilter, 
				width: 116
			},
			{
				headerName: "Contains Sugar Substitutes Last Update Date",
				cellStyle: this.getExtendedCellStyle,
				field: "containsSugarSubstitutesUpdateDate",
				hide: true,	
				valueFormatter: this.getDate,
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
				headerName: "Food Guide Serving (g)",
				editable: !this.isReadOnly(),
				cellRendererFramework: TwoDecimalRendererComponent,
				cellEditorFramework: NumericEditorComponent,
				cellStyle: this.getNumCellStyle,
				field: "foodGuideServingG",
				filter: 'number',
				valueGetter: this.getObjectValue,
				width: 150
			},
			{
				headerName: "Food Guide Serving (measure)",
				editable: !this.isReadOnly(),
				cellRenderer: this.getStringValue,
				cellEditorFramework: StringEditorComponent,
				cellStyle: this.getStringCellStyle,
				field: "foodGuideServingMeasure",
				valueGetter: this.getObjectValue,
				width: 150
			},
			{
				headerName: "FG Serving Last Update Date",
				cellStyle: this.getExtendedCellStyle,
				field: "foodGuideUpdateDate",
				hide: true,	
				valueFormatter: this.getDate,
				width: 150
			},
			{
				headerName: "Tier 4 Serving (g)",
				editable: !this.isReadOnly(),
				cellRendererFramework: TwoDecimalRendererComponent,
				cellEditorFramework: NumericEditorComponent,
				cellStyle: this.getNumCellStyle,
				field: "tier4ServingG",
				filter: 'number',
				valueGetter: this.getObjectValue,
				width: 150
			},
			{
				headerName: "Tier 4 Serving (measure)",
				cellRenderer: this.getStringValue,
				cellEditorFramework: StringEditorComponent,
				cellStyle: this.getStringCellStyle,
				editable: !this.isReadOnly(),
				field: "tier4ServingMeasure",
				filterFramework: MissingStringFilter,
				valueGetter: this.getObjectValue,
				width: 150
			},
			{
				headerName: "Tier 4 Serving Last Update Date",
				cellStyle: this.getExtendedCellStyle,
				field: "tier4ServingUpdateDate",
				hide: true,	
				valueFormatter: this.getDate,
				width: 150
			},
			{
				headerName: "Rolled Up",
				cellEditorFramework: BooleanEditorComponent,
				cellRendererFramework: BooleanRendererComponent,
				cellStyle: this.getBooleanCellStyle,
				editable: !this.isReadOnly(),
				field: "rolledUp",
				filterFramework: MissingBooleanFilter,
				width: 150
			},
			{
				headerName: "Rolled Up Last Update Date",
				cellStyle: this.getExtendedCellStyle,
				field: "rolledUpUpdateDate",
				hide: true,	
				valueFormatter: this.getDate,
				width: 150
			},
			{
				headerName: "Override Small RA Adj",
				cellEditorFramework: BooleanEditorComponent,
				cellRendererFramework: BooleanRendererComponent,
				cellStyle: this.getBooleanCellStyle,
				editable: !this.isReadOnly(),
				field: "overrideSmallRaAdjustment",
				filterFramework: MissingBooleanFilter,
				width: 150
			},
			{
				headerName: "Override Small RA Adj Last Update Date",
				cellStyle: this.getExtendedCellStyle,
				field: "overrideSmallRaAdjustmentUpdateDate",
				hide: true,	
				valueFormatter: this.getDate,
				width: 150
			},
			{
				headerName: "Toddler Item",
				cellEditorFramework: BooleanEditorComponent,
				cellRendererFramework: BooleanRendererComponent,
				cellStyle: this.getBooleanCellStyle,
				editable: !this.isReadOnly(),
				field:"marketedToKids",
				filterFramework: MissingBooleanFilter,
				width: 118
			},
			{
				headerName: "Toddler Item Last Update Date",
				cellStyle: this.getExtendedCellStyle,
				field: "marketedToKidsUpdateDate",
				hide: true,	
				valueFormatter: this.getDate,
				width: 150
			},
			{
				headerName: "Replacement Code",
				editable: !this.isReadOnly(),
				cellRenderer: this.getNumValue,
				cellEditorFramework: NumericEditorComponent,
				cellStyle: this.getNumCellStyle,
				field: "replacementCode",
				filter: 'number',
				valueGetter: this.getObjectValue,
				width:118
			},
			{
				headerName: "Replacement Code Last Update Date",
				cellStyle: this.getExtendedCellStyle,
				field: "replacementCodeUpdateDate",
				hide: true,	
				valueFormatter: this.getDate,
				width: 150
			},
			{
				headerName: "Comments",
				editable: !this.isReadOnly(),
				cellRenderer: this.getStringValue,
				cellEditorFramework: StringEditorComponent,
				cellStyle: this.getStringCellStyle,
				field: "comments",
				valueGetter: this.getObjectValue,
				width: 200
			},
			{
				headerName: "Comments Last Update Date",
				cellStyle: this.getExtendedCellStyle,
				field: "commentsUpdateDate",
				hide: true,	
				valueFormatter: this.getDate,
				width: 150
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
		this.route.params.subscribe(params =>{
			if(params['id'] != undefined)
				this.cfgModel.datasetId = params['id'];
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

		if(this.cfgModel.datasetId != undefined){
			this.openService.open(this.cfgModel.datasetId).subscribe(
				(res) => {
					this.setDataset(res);
				},
				(err) => {
					console.log(err);
				}
			)
		}else{
			this.isSearchResult = true;
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
		this.modified = false;
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

	/**
	 * @param route The route to navigate to on successful save
	 */
	saveDataset(userSave:boolean = false, route:string = null){
		let datasetToSave = Object.assign({}, this.dataset);

		// do not save classified state, 
		if (datasetToSave.status == 'Classified' || (datasetToSave.status == 'Committed') && userSave == true){
			datasetToSave.status = 'Validated';
		}


		this.saveService.save(datasetToSave).subscribe(
			(res) => {
				this.modified = false;

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
				}else if (route != null){
					this.router.navigate([route]);
				}
			},
			(err) => {
				console.log(err);
			});
	}

	ngAfterContentChecked(){
		let footerActionButtonHeight=0;

		if(this.agGrid._nativeElement.querySelector('.ag-body-container')){
			this.height = 67 + this.agGrid._nativeElement.querySelector('.ag-body-container').offsetHeight;
			this.width = this.getGridWidth();
		}

		if(this.showMissingDiv.nativeElement.style.display=='inline' 
			|| this.showAllDiv.nativeElement.style.display=='inline'
			|| this.showInReviewDiv.nativeElement.style.display=='inline'){
			footerActionButtonHeight = 35;
		}

		// correction for large vertical grid, set grid height to fit screen size, grid will show scroll bars
		if((this.gridPlaceHolder.nativeElement.clientHeight - footerActionButtonHeight) < this.height){
			this.height = this.gridPlaceHolder.nativeElement.clientHeight - footerActionButtonHeight;
		}

		// horizontal grid correction, grid is smaller than container
		if(this.width < (this.gridPlaceHolder.nativeElement.clientWidth - 30)/*padding*/){
			this.width = 2 + this.getGridWidth();   // The 2 here seems to prevent the scroll bar from appearing.
		}
	}

	private getGridWidth():number
	{
		let gridWidth = 0;

		for (let columnNum in this.gridOptions.columnDefs){
			if((<any>this.gridOptions.columnDefs[columnNum]).hide == false || (<any>this.gridOptions.columnDefs[columnNum]).hide == undefined){
				gridWidth += (<any>this.gridOptions.columnDefs[columnNum]).width;
			}
		}

		// grid doesn't fit, use max container size
		if((this.gridPlaceHolder.nativeElement.clientWidth - 30) < gridWidth){
			gridWidth = this.gridPlaceHolder.nativeElement.clientWidth - 30/*padding*/;
		}

		return gridWidth;
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
		return ['sodiumAmountPer100g','sodiumImputationReference','sugarAmountPer100g','sugarImputationReference','transfatAmountPer100g',
				'transfatImputationReference','satfatAmountPer100g','satfatImputationReference','totalFatAmountPer100g','totalFatImputationReference',
				'containsAddedSodium','containsAddedSugar','containsFreeSugars','containsAddedFat','containsAddedTransfat','containsCaffeine',
				'containsSugarSubstitutes','foodGuideServingG','foodGuideServingMeasure','tier4ServingG','tier4ServingMeasure','rolledUp',
				'overrideSmallRaAdjustment','marketedToKids','replacementCode','comments'].indexOf(field) > -1;
	}

	getNumCellStyle(params:any):any{
		if(params.context.validationMode && !params.context.mainInterface.isNonMandatoryEditable(params.colDef.field) && params.value == null){
			return {backgroundColor: '#FFFFCC'};//light yellow
		}else if (params.context.validationMode && params.column.colId == 'cfgCode' && (params.value.toString().length < 3 || params.value.toString().length > 4)){
			return {backgroundColor: '#FFFFCC'};//light yellow
		}else if(params.node.data[params.column.colId].modified == true){
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
		else if(params.node.data[params.column.colId].modified == true){
			return {backgroundColor: '#FFBFBC'};//light red
		}else if(params.context.mainInterface.isExtendedData(params.column.colId)){
			return params.context.mainInterface.getExtendedCellStyle(params);
		}
	}

	getBooleanCellStyle(params:any):any{
		if (params.context.validationMode && !params.context.mainInterface.isNonMandatoryEditable(params.colDef.field) && (params.value==null||params.value.value==null)){
			return {backgroundColor: '#FFFFCC'};//light yellow
		}
		else if(params.value != null && params.value.modified == true){
			return {backgroundColor: '#FFBFBC'};//light red
		}else if(params.context.mainInterface.isExtendedData(params.column.colId)){
			return params.context.mainInterface.getExtendedCellStyle(params);
		}
	}

	getNumValue(params:any):any{
		return params.value ? params.value.toString() : null;
	}

	getStringValue(params:any):any{
		return params.value ? params.value.toString() : null;
	}

	getBooleanValue(params:any):any{
		return params.value ? params.value.value: null;
	}

	getValueOnAbsoluteTrue(params:any):any{
		return params.data.absolute ? params.value : null;
	}

	getValueHideZero(params:any):any{
		return params.value == 0 ? null : params.value;
	}

	onSubmitClick(){
		if(this.dataset.name == null){
			console.log("is this still happening?, seems like this shouldn't be possible anymore with the save button.");
			this.callbackSubmit=true;
			this.onSaveClick();
			return;
		}

		this.validateData();
		this.validationMode = true;
		this.gridOptions.context.validationMode = true;
		this.gridOptions.api.redrawRows();

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
			this.saveDataset(false, '/datasets');
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

				node.addEventListener('rowSelected',
					(event)=>{
						event.node.gridApi.gridCore.eGridDiv.dispatchEvent(
							new CustomEvent('userRowSelected')
						);
					}
				)
			}
		);

		if (this.cfgModel.isCfgAdmin){
			this.gridOptions.columnApi.setColumnVisible('selection', this.hasValidatedColumn());
		}
	}

	private onUserRowSelected($event){
		this.modified = true;
	}

	onValidateClick(){
		this.validateData();
		this.validationMode = true;
		this.gridOptions.context.validationMode = true;
		this.gridOptions.api.redrawRows();

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

			return;
		}

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
		this.toggleEditables();

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

	onBackClick(){
		if(this.dataset.status=="Classified"){
			this.dataset.status="Validated";
			this.resetColumnVisibility();
			this.toggleEditables();
		}

		this.openService.open(this.cfgModel.datasetId).subscribe(
			(res) => {
				this.setDataset(res);
			},
			(err) => {
				console.log(err);
			}
		)
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
		this.saveDataset(false, '/datasets');
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

	onBackArrowClick(){
		if(this.modified){
			this.element.nativeElement.dispatchEvent(new CustomEvent('popup', {
				detail:{message: "Are you sure you want to exit without saving?",
						showYesButton: true,
						showNoButton: true,
						callback: this.exitConfirmed
				},
				bubbles:true
			}));
		}else{
			this.exitConfirmed();
		}
	}

	private exitConfirmed = () => {
		if(this.isSearchResult){
			this.router.navigate(['/query']);
		}else{
			this.router.navigate(['/datasets']);
		}
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
	
	toggleEditables(){
		console.log("toggleEditables()");
		for (let columnNum in this.gridOptions.columnDefs){
			if(["cfgCode",
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
				"foodGuideServingG",
				"tier4ServingG",
				"tier4ServingMeasure",
				"rolledUp",
				"overrideSmallRaAdjustment",
				"marketedToKids",
				"replacementCode",
				"comments"].includes((<any>this.gridOptions.columnDefs[columnNum]).field)==true){
				(<any>this.gridOptions.columnDefs[columnNum]).editable = !(<any>this.gridOptions.columnDefs[columnNum]).editable;
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
	 * Converts all dates to human readable format.
	 */
	private exportData(){
		for (let columnNum in this.gridOptions.columnDefs){
			for (let num=0;num<this.dataset.data.length;num++){
				switch((<any>this.gridOptions.columnDefs[columnNum]).field){
					case "cfgCode":
						this.dataset.data[num].cfgCode = this.dataset.data[num].cfgCode.value;
						break;
					case "cfgCodeUpdateDate":
						this.dataset.data[num].cfgCodeUpdateDate = this.dataset.data[num].cfgCodeUpdateDate == null ? null : moment(this.dataset.data[num].cfgCodeUpdateDate).format('YYYY-MM-DD');
						break;
					case "sodiumAmountPer100g":
						this.dataset.data[num].sodiumAmountPer100g= this.dataset.data[num].sodiumAmountPer100g.value;
						break;
					case "sodiumImputationReference":
						this.dataset.data[num].sodiumImputationReference= this.dataset.data[num].sodiumImputationReference.value;
						break;
					case "sodiumImputationDate":
						this.dataset.data[num].sodiumImputationDate = this.dataset.data[num].sodiumImputationDate == null ? null : moment(this.dataset.data[num].sodiumImputationDate).format('YYYY-MM-DD');
						break;
					case "sugarAmountPer100g":
						this.dataset.data[num].sugarAmountPer100g = this.dataset.data[num].sugarAmountPer100g.value;
						break;
					case "sugarImputationReference":
						this.dataset.data[num].sugarImputationReference = this.dataset.data[num].sugarImputationReference.value;
						break;
					case "sugarImputationDate":
						this.dataset.data[num].sugarImputationDate = this.dataset.data[num].sugarImputationDate == null ? null : moment(this.dataset.data[num].sugarImputationDate).format('YYYY-MM-DD');
						break;
					case "transfatAmountPer100g":
						this.dataset.data[num].transfatAmountPer100g = this.dataset.data[num].transfatAmountPer100g.value;
						break;
					case "transfatImputationReference":
						this.dataset.data[num].transfatImputationReference = this.dataset.data[num].transfatImputationReference.value;
						break;
					case "transfatImputationDate":
						this.dataset.data[num].transfatImputationDate = this.dataset.data[num].transfatImputationDate == null ? null : moment(this.dataset.data[num].transfatImputationDate).format('YYYY-MM-DD');
						break;
					case "satfatAmountPer100g":
						this.dataset.data[num].satfatAmountPer100g = this.dataset.data[num].satfatAmountPer100g.value;
						break;
					case "satfatImputationReference":
						this.dataset.data[num].satfatImputationReference = this.dataset.data[num].satfatImputationReference.value;
						break;
					case "satfatImputationDate":
						this.dataset.data[num].satfatImputationDate = this.dataset.data[num].satfatImputationDate == null ? null : moment(this.dataset.data[num].satfatImputationDate).format('YYYY-MM-DD');
						break;
					case "totalFatAmountPer100g":
						this.dataset.data[num].totalFatAmountPer100g = this.dataset.data[num].totalFatAmountPer100g.value;
						break;
					case "totalFatImputationReference":
						this.dataset.data[num].totalFatImputationReference = this.dataset.data[num].totalFatImputationReference.value;
						break;
					case "totalFatImputationDate":
						this.dataset.data[num].totalFatImputationDate = this.dataset.data[num].totalFatImputationDate == null ? null : moment(this.dataset.data[num].totalFatImputationDate).format('YYYY-MM-DD');
						break;
					case "containsAddedSodium":
						this.dataset.data[num].containsAddedSodium = this.dataset.data[num].containsAddedSodium.value;
						break;
					case "containsAddedSodiumUpdateDate":
						this.dataset.data[num].containsAddedSodiumUpdateDate = this.dataset.data[num].containsAddedSodiumUpdateDate == null ? null : moment(this.dataset.data[num].containsAddedSodiumUpdateDate).format('YYYY-MM-DD');
						break;
					case "containsAddedSugar":
						this.dataset.data[num].containsAddedSugar = this.dataset.data[num].containsAddedSugar.value;
						break;
					case "containsAddedSugarUpdateDate":
						this.dataset.data[num].containsAddedSugarUpdateDate = this.dataset.data[num].containsAddedSugarUpdateDate == null ? null : moment(this.dataset.data[num].containsAddedSugarUpdateDate).format('YYYY-MM-DD');
						break;
					case "containsFreeSugars":
						this.dataset.data[num].containsFreeSugars = this.dataset.data[num].containsFreeSugars.value;
						break;
					case "containsFreeSugarsUpdateDate":
						this.dataset.data[num].containsFreeSugarsUpdateDate = this.dataset.data[num].containsFreeSugarsUpdateDate == null ? null : moment(this.dataset.data[num].containsFreeSugarsUpdateDate).format('YYYY-MM-DD');
						break;
					case "containsAddedFat":
						this.dataset.data[num].containsAddedFat = this.dataset.data[num].containsAddedFat.value;
						break;
					case "containsAddedFatUpdateDate":
						this.dataset.data[num].containsAddedFatUpdateDate = this.dataset.data[num].containsAddedFatUpdateDate == null ? null : moment(this.dataset.data[num].containsAddedFatUpdateDate).format('YYYY-MM-DD');
						break;
					case "containsAddedTransfat":
						this.dataset.data[num].containsAddedTransfat = this.dataset.data[num].containsAddedTransfat.value;
						break;
					case "containsAddedTransfatUpdateDate":
						this.dataset.data[num].containsAddedTransfatUpdateDate = this.dataset.data[num].containsAddedTransfatUpdateDate == null ? null : moment(this.dataset.data[num].containsAddedTransfatUpdateDate).format('YYYY-MM-DD');
						break;
					case "containsCaffeine":
						this.dataset.data[num].containsCaffeine = this.dataset.data[num].containsCaffeine.value;
						break;
					case "containsCaffeineUpdateDate":
						this.dataset.data[num].containsCaffeineUpdateDate = this.dataset.data[num].containsCaffeineUpdateDate == null ? null : moment(this.dataset.data[num].containsCaffeineUpdateDate).format('YYYY-MM-DD');
						break;
					case "containsSugarSubstitutes":
						this.dataset.data[num].containsSugarSubstitutes = this.dataset.data[num].containsSugarSubstitutes.value;
						break;
					case "containsSugarSubstitutesUpdateDate":
						this.dataset.data[num].containsSugarSubstitutesUpdateDate = this.dataset.data[num].containsSugarSubstitutesUpdateDate == null ? null : moment(this.dataset.data[num].containsSugarSubstitutesUpdateDate).format('YYYY-MM-DD');
						break;
					case "foodGuideServingG":
						this.dataset.data[num].foodGuideServingG = this.dataset.data[num].foodGuideServingG.value;
						break;
					case "foodGuideServingMeasure":
						this.dataset.data[num].foodGuideServingMeasure = this.dataset.data[num].foodGuideServingMeasure.value;
						break;
					case "foodGuideUpdateDate":
						this.dataset.data[num].foodGuideUpdateDate = this.dataset.data[num].foodGuideUpdateDate == null ? null : moment(this.dataset.data[num].foodGuideUpdateDate).format('YYYY-MM-DD');
						break;
					case "tier4ServingG":
						this.dataset.data[num].tier4ServingG = this.dataset.data[num].tier4ServingG.value;
						break;
					case "tier4ServingMeasure":
						this.dataset.data[num].tier4ServingMeasure = this.dataset.data[num].tier4ServingMeasure.value;
						break;
					case "tier4ServingUpdateDate":
						this.dataset.data[num].tier4ServingUpdateDate = this.dataset.data[num].tier4ServingUpdateDate == null ? null : moment(this.dataset.data[num].tier4ServingUpdateDate).format('YYYY-MM-DD');
						break;
					case "rolledUp":
						this.dataset.data[num].rolledUp = this.dataset.data[num].rolledUp.value;
						break;
					case "rolledUpUpdateDate":
						this.dataset.data[num].rolledUpUpdateDate = this.dataset.data[num].rolledUpUpdateDate == null ? null : moment(this.dataset.data[num].rolledUpUpdateDate).format('YYYY-MM-DD');
						break;
					case "overrideSmallRaAdjustment":
						this.dataset.data[num].overrideSmallRaAdjustment = this.dataset.data[num].overrideSmallRaAdjustment.value;
						break;
					case "overrideSmallRaAdjustmentUpdateDate":
						this.dataset.data[num].overrideSmallRaAdjustmentUpdateDate = this.dataset.data[num].overrideSmallRaAdjustmentUpdateDate == null ? null : moment(this.dataset.data[num].overrideSmallRaAdjustmentUpdateDate).format('YYYY-MM-DD');
						break;
					case "marketedToKids":
						this.dataset.data[num].marketedToKids = this.dataset.data[num].marketedToKids.value;
						break;
					case "marketedToKidsUpdateDate":
						this.dataset.data[num].marketedToKidsUpdateDate = this.dataset.data[num].marketedToKidsUpdateDate == null ? null : moment(this.dataset.data[num].marketedToKidsUpdateDate).format('YYYY-MM-DD');
						break;
					case "replacementCode":
						this.dataset.data[num].replacementCode = this.dataset.data[num].replacementCode.value;
						break;
					case "replacementCodeUpdateDate":
						this.dataset.data[num].replacementCodeUpdateDate = this.dataset.data[num].replacementCodeUpdateDate == null ? null : moment(this.dataset.data[num].replacementCodeUpdateDate).format('YYYY-MM-DD');
						break;
					case "comments":
						this.dataset.data[num].comments = this.dataset.data[num].comments.value;
						break;
					case "commentsUpdateDate":
						this.dataset.data[num].commentsUpdateDate = this.dataset.data[num].commentsUpdateDate == null ? null : moment(this.dataset.data[num].commentsUpdateDate).format('YYYY-MM-DD');
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
				if(columnNum=="0"){
					this.dataset.data[num].missingData = false;
				}

				switch((<any>this.gridOptions.columnDefs[columnNum]).field){
					case "cfgCode":
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

		if(!this.validationFailed){
			this.dataset.status = "Pending Validation";
		}
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
		console.log(columns);
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
		}else if ((<any>this).context.mainInterface.dataset.status == 'Review' ||
					(<any>this).context.mainInterface.dataset.status == 'Pending Validation'){
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
		}else if (this.dataset.status == 'In Progress' || this.dataset.status == 'Pending Validation'){
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
		}else if(this.cfgModel.isAnalyst && !(this.dataset.status == "New" || this.dataset.status == 'In Progress' || this.dataset.status == 'Review')){
			return true;
		}else if(this.dataset.status=="Classified"){
			return true;
		}

		return false;
	}

	private roundToTwoDecimal(num):string{
		return "" + Math.floor(num.value*100) / 100;
	}

	private isEditableSodiumPer100(params:any):boolean{
		if(params.context.mainInterface.isReadOnly()){
			return false;
		}

		return params.node.data.sodiumAmountPer100g.value == undefined || params.node.data.sodiumImputationReference.value != undefined;
	}

	private isEditableSodiumImputation(params:any):boolean{
		if(params.context.mainInterface.isReadOnly()){
			return false;
		}

		return params.node.data.sodiumImputationReference.value != undefined;
	}

	private isEditableSugarPer100(params:any):boolean{
		if(params.context.mainInterface.isReadOnly()){
			return false;
		}

		return params.node.data.sugarAmountPer100g.value == undefined || params.node.data.sugarImputationReference.value != undefined;
	}

	private isEditableSugarImputation(params:any):boolean{
		if(params.context.mainInterface.isReadOnly()){
			return false;
		}

		return params.node.data.sugarImputationReference.value != undefined;
	}

	private isEditableTransfatPer100(params:any):boolean{
		if(params.context.mainInterface.isReadOnly()){
			return false;
		}

		return params.node.data.transfatAmountPer100g.value == undefined || params.node.data.transfatImputationReference.value != undefined;
	}

	private isEditableTransfatImputation(params:any):boolean{
		if(params.context.mainInterface.isReadOnly()){
			return false;
		}

		return params.node.data.transfatImputationReference.value != undefined;
	}

	private isEditableSatfatPer100(params:any):boolean{
		if(params.context.mainInterface.isReadOnly()){
			return false;
		}

		return params.node.data.satfatAmountPer100g.value == undefined || params.node.data.satfatImputationReference.value != undefined;
	}

	private isEditableSatfatImputation(params:any):boolean{
		if(params.context.mainInterface.isReadOnly()){
			return false;
		}

		return params.node.data.satfatImputationReference.value != undefined;
	}
	
	private isEditableTotalFatPer100(params:any):boolean{
		if(params.context.mainInterface.isReadOnly()){
			return false;
		}

		return params.node.data.totalFatAmountPer100g.value == undefined || params.node.data.totalFatImputationReference.value != undefined;
	}

	private isEditableTotalfatImputation(params:any):boolean{
		if(params.context.mainInterface.isReadOnly()){
			return false;
		}

		return params.node.data.totalFatImputationReference.value != undefined;
	}

	private onCommitClick():void{
		this.onValidateClick();
		if(this.validationFailed){
			return;
		}

		let modifiedFoods = [];

		for(let foodItem of this.dataset.data){
			let changedItem:any = {"code":foodItem.code};

			if (foodItem.cfgCodeUpdateDate != null && foodItem.cfgCodeUpdateDate > this.dataset.creationDate){
				changedItem.cfgCode = foodItem.cfgCode.value;
			}

			if (foodItem.classifiedCfgCode != foodItem.cfgCode.value){
				changedItem.cfgCode=foodItem.classifiedCfgCode;
			}

			if(foodItem.sodiumImputationDate != null && foodItem.sodiumImputationDate > this.dataset.creationDate){
				changedItem.sodiumAmountPer100g = foodItem.sodiumAmountPer100g.value;
				changedItem.sodiumImputationReference = foodItem.sodiumImputationReference.value;
			}

			
			if (foodItem.sugarImputationDate != null && foodItem.sugarImputationDate > this.dataset.creationDate){
				changedItem.sugarAmountPer100g = foodItem.sugarAmountPer100g.value;
				changedItem.sugarImputationReference = foodItem.sugarImputationReference.value;
			}

			if (foodItem.transfatImputationDate != null && foodItem.transfatImputationDate > this.dataset.creationDate){
				changedItem.transfatAmountPer100g = foodItem.transfatAmountPer100g.value;
				changedItem.transfatImputationReference = foodItem.transfatImputationReference.value;
			}

			if (foodItem.satfatImputationDate != null && foodItem.satfatImputationDate > this.dataset.creationDate){
				changedItem.satfatAmountPer100g = foodItem.satfatAmountPer100g.value;
				changedItem.satfatImputationReference = foodItem.satfatImputationReference.value;
			}

			if (foodItem.totalFatImputationDate != null && foodItem.totalFatImputationDate > this.dataset.creationDate){
				changedItem.totalFatAmountPer100g = foodItem.totalFatAmountPer100g.value;
				changedItem.totalFatImputationReference = foodItem.totalFatImputationReference.value;
			}

			if (foodItem.containsAddedSodiumUpdateDate != null && foodItem.containsAddedSodiumUpdateDate > this.dataset.creationDate){
				changedItem.containsAddedSodium = foodItem.containsAddedSodium.value;
			}

			if (foodItem.containsAddedSugarUpdateDate != null && foodItem.containsAddedSugarUpdateDate > this.dataset.creationDate){
				changedItem.containsAddedSugar = foodItem.containsAddedSugar.value;
			}

			if (foodItem.containsFreeSugarsUpdateDate != null && foodItem.containsFreeSugarsUpdateDate > this.dataset.creationDate){
				changedItem.containsFreeSugars = foodItem.containsFreeSugars.value;
			}

			if (foodItem.containsAddedFatUpdateDate != null && foodItem.containsAddedFatUpdateDate > this.dataset.creationDate){
				changedItem.containsAddedFat = foodItem.containsAddedFat.value;
			}

			if (foodItem.containsAddedTransfatUpdateDate != null && foodItem.containsAddedTransfatUpdateDate > this.dataset.creationDate){
				changedItem.containsAddedTransfat = foodItem.containsAddedTransfat.value;
			}

			if (foodItem.containsCaffeineUpdateDate != null && foodItem.containsCaffeineUpdateDate > this.dataset.creationDate){
				changedItem.containsCaffeine = foodItem.containsCaffeine.value;
			}

			if (foodItem.containsSugarSubstitutesUpdateDate != null && foodItem.containsSugarSubstitutesUpdateDate > this.dataset.creationDate){
				changedItem.containsSugarSubstitutes = foodItem.containsSugarSubstitutes.value;
			}

			if (foodItem.foodGuideUpdateDate != null && foodItem.foodGuideUpdateDate > this.dataset.creationDate){
				changedItem.foodGuideServingG = foodItem.foodGuideServingG.value;
				changedItem.foodGuideServingMeasure = foodItem.foodGuideServingMeasure.value;
			}

			if (foodItem.tier4ServingUpdateDate != null && foodItem.tier4ServingUpdateDate > this.dataset.creationDate){
				changedItem.tier4ServingG = foodItem.tier4ServingG.value;
				changedItem.tier4ServingMeasure = foodItem.tier4ServingMeasure.value;
			}

			if (foodItem.rolledUpUpdateDate != null && foodItem.rolledUpUpdateDate > this.dataset.creationDate){
				changedItem.rolledUp = foodItem.rolledUp.value;
			}

			if (foodItem.overrideSmallRaAdjustmentUpdateDate != null && foodItem.overrideSmallRaAdjustmentUpdateDate > this.dataset.creationDate){
				changedItem.overrideSmallRaAdjustment = foodItem.overrideSmallRaAdjustment.value;
			}

			if (foodItem.marketedToKidsUpdateDate != null && foodItem.marketedToKidsUpdateDate > this.dataset.creationDate){
				changedItem.marketedToKids = foodItem.marketedToKids.value;
			}

			if (foodItem.replacementCodeUpdateDate != null && foodItem.replacementCodeUpdateDate > this.dataset.creationDate){
				changedItem.replacementCode = foodItem.replacementCode.value;
			}

			if (foodItem.commentsUpdateDate != null && foodItem.commentsUpdateDate > this.dataset.creationDate){
				changedItem.comments = foodItem.comments.value;
			}

			if(Object.keys(changedItem).length > 1){
				modifiedFoods.push(changedItem);
			}
		}

		if(modifiedFoods.length > 0){
			this.commitService.commit(modifiedFoods, this.dataset.id).subscribe(
				(res) => {
					this.dataset.status = "Committed";
					this.element.nativeElement.dispatchEvent(
						new CustomEvent(
							'popup',
							{
								detail: {
									message: "CFG Classification database successfully updated.",
									showOkButton: true
								},
								bubbles:true
							}
						)
					);
					this.replaceCfgCodes();
					this.saveDataset(false, '/datasets');
				},
				(err) => {
					console.log(err);
				}
			);
		}else{
			this.toggleEditables();
			this.element.nativeElement.dispatchEvent(
				new CustomEvent(
					'popup',
					{
						detail: {
							message: "No changes found in dataset.",
							showOkButton: true
						},
						bubbles:true
					}
				)
			);
		}
	}

	getObjectValue(params){
		if(params.data[params.column.colId] == null)
			return null;

		return params.data[params.column.colId].value === undefined ? params.data[params.column.colId] : params.data[params.column.colId].value;
	}

	getDate(params){
		if (params.value == null)
			return null;
		else
			return moment(params.value).format('YYYY-MM-DD')
	}

	private onValueChanged($event){
		this.stampLastUpdateDate($event.detail.colId, $event.detail.node);
	}

	private stampLastUpdateDate(colId:string, node:any){

		switch(colId){
			case "cfgCode":
				node.data.cfgCodeUpdateDate = (new Date()).getTime();
				break;
			case "sodiumAmountPer100g":
				node.data.sodiumImputationDate = (new Date()).getTime();
				break;
			case "sodiumImputationReference":
				node.data.sodiumImputationDate = (new Date()).getTime();
				break;
			case "sugarAmountPer100g":
				node.data.sugarImputationDate = (new Date()).getTime();
				break;
			case "sugarImputationReference":
				node.data.sugarImputationDate = (new Date()).getTime();
				break;
			case "transfatAmountPer100g":
				node.data.transfatImputationDate = (new Date()).getTime();
				break;
			case "transfatImputationReference":
				node.data.transfatImputationDate = (new Date()).getTime();
				break;
			case "satfatAmountPer100g":
				node.data.satfatImputationDate = (new Date()).getTime();
				break;
			case "satfatImputationReference":
				node.data.satfatImputationDate = (new Date()).getTime();
				break;
			case "totalFatAmountPer100g":
				node.data.totalFatImputationDate = (new Date()).getTime();
				break;
			case "totalFatImputationReference":
				node.data.totalFatImputationDate = (new Date()).getTime();
				break;
			case "containsAddedSodium":
				node.data.containsAddedSodiumUpdateDate = (new Date()).getTime();
				break;
			case "containsAddedSugar":
				node.data.containsAddedSugarUpdateDate = (new Date()).getTime();
				break;
			case "containsFreeSugars":
				node.data.containsFreeSugarsUpdateDate = (new Date()).getTime();
				break;
			case "containsAddedFat":
				node.data.containsAddedFatUpdateDate = (new Date()).getTime();
				break;
			case "containsAddedTransfat":
				node.data.containsAddedTransfatUpdateDate = (new Date()).getTime();
				break;
			case "containsCaffeine":
				node.data.containsCaffeineUpdateDate = (new Date()).getTime();
				break;
			case "containsSugarSubstitutes":
				node.data.containsSugarSubstitutesUpdateDate = (new Date()).getTime();
				break;
			case "foodGuideServingG":
				node.data.foodGuideUpdateDate = (new Date()).getTime();
				break;
			case "foodGuideServingMeasure":
				node.data.foodGuideUpdateDate = (new Date()).getTime();
				break;
			case "tier4ServingG":
				node.data.tier4ServingUpdateDate = (new Date()).getTime();
				break;
			case "tier4ServingMeasure":
				node.data.tier4ServingUpdateDate = (new Date()).getTime();
				break;
			case "rolledUp":
				node.data.rolledUpUpdateDate = (new Date()).getTime();
				break;
			case "overrideSmallRaAdjustment":
				node.data.overrideSmallRaAdjustmentUpdateDate = (new Date()).getTime();
				break;
			case "marketedToKids":
				node.data.marketedToKidsUpdateDate = (new Date()).getTime();
				break;
			case "replacementCode":
				node.data.replacementCodeUpdateDate = (new Date()).getTime();
				break;
			case "comments":
				node.data.commentsUpdateDate = (new Date()).getTime();
				break;
		}
	}


	private replaceCfgCodes(){
		for (let foodItem of this.dataset.data){
			foodItem.cfgCode.value = foodItem.classifiedCfgCode;
		}
	}

}
