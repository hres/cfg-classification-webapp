import { Component, OnInit, ViewChild, AfterContentChecked, ElementRef } from '@angular/core';
import { GridOptions } 			from 'ag-grid';

import { RulesetsService }		from '../services/rulesets.service';

import { RulesetComponent }		from './ruleset/ruleset.component';
import { RulesetEditorComponent }		from './ruleset-editor/ruleset-editor.component';

@Component({
	selector: 'app-manage-rulesets',
	templateUrl: './manage-rulesets.component.html',
	styleUrls: ['./manage-rulesets.component.css'],
	providers: [RulesetsService]
})

export class ManageRulesetsComponent implements OnInit, AfterContentChecked {
	@ViewChild('agGrid')agGrid;any

	private gridOptions: GridOptions;
	private height=200;

	//wma test start
	private showMessage = false;
	
	static message: string = '';

	get message() {
		return ManageRulesetsComponent.message;
	  }
	//wma test end

	constructor(private rulesetsService:RulesetsService) { 
		this.gridOptions = <GridOptions>{
			context:{componentParent:this},
			suppressCellSelection: true
		}
		this.gridOptions.columnDefs=[
			{
				headerName: "Ruleset Name",
				cellRendererFramework: RulesetComponent,
				cellEditorFramework: RulesetEditorComponent,
				editable: true,
				field: "name",
				width: 200
			}
		]
	}

	ngOnInit() {
		this.getRulesets();
	}

	ngAfterContentChecked(){
		if(this.agGrid._nativeElement.querySelector('.ag-body-container')){
			// padding top + headerheight + nativeElement body container
			this.height = 20 + 25 + 4 + this.agGrid._nativeElement.querySelector('.ag-body-container').offsetHeight;
			this.gridOptions.api.sizeColumnsToFit();
		}
	}

	private getRulesets(){
		this.showMessage = false;
		this.rulesetsService.getRulesets().subscribe(
			(res) => {
				this.gridOptions.api.setRowData(res.rulesets);
				this.gridOptions.api.sizeColumnsToFit();
			},
			(err) => {
				console.log(err);
			}
		);
	}

	private deleteRuleset(rulesetId:string){
		this.showMessage = false;
		this.rulesetsService.deleteRuleset(rulesetId).subscribe(
			(res) => {
				this.getRulesets();

				this.showMessage = true;
				ManageRulesetsComponent.message = res.message;
			},
			(err) => {
				console.log(err);
			}
		)
	}

	private promoteRuleset(rulesetId:string){
		this.showMessage = false;
		this.rulesetsService.promoteRuleset(rulesetId).subscribe(
			(res) => {
				this.getRulesets();

				this.showMessage = true;
				ManageRulesetsComponent.message = res.message;
			},
			(err) => {
				console.log(err);
			}
		)
	}
}
