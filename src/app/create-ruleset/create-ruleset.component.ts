import { Component, OnInit, Directive } 	from '@angular/core';
//import { FileSelectDirective, FileUploader }from 'ng2-file-upload';
import { Router } from '@angular/router';
import { FileSelectDirective, FileItem, FileUploaderOptions, ParsedResponseHeaders, FileUploader,}from 'ng2-file-upload';

import { environment } 						from '../../environments/environment';
import { FileUploaderCustom } 				from './file-uploader-custom';
import { KeycloakService }					from '../keycloak-service/keycloak.service';

@Component({
	selector: 'app-create-ruleset',
	templateUrl: './create-ruleset.component.html',
	styleUrls: ['./create-ruleset.component.css'],
})

@Directive({selector:'[ng2FileSelect]'})

export class CreateRulesetComponent implements OnInit {

	constructor(private keycloakService: KeycloakService) {
		keycloakService.getToken().then((token)=>{
			this.authToken=token;
		});
	}

	public customUploader:FileUploaderCustom = new FileUploaderCustom({url: environment.servicesUrl + 'service/upload'});

	public  staticReference = CreateRulesetComponent;
	private rulesetName:string;
	private authToken:string;
	

	private disableRefamt:boolean;
	private disableFop:boolean;
	private disableShortcut:boolean;
	private disableThresholds:boolean;
	private disableInit:boolean;
	private disableTier:boolean;
	
	
	
	static showErrorMessage:boolean;
	static showSuccessMessage:boolean;
	static showStatusMessage:boolean

	static errorMessage: string = '';
	static successMessage: string = '';
	static statusMessage: string = '';

	get showErrorMessage() {
		return CreateRulesetComponent.showErrorMessage;
	  }

	get showSuccessMessage() {
		return CreateRulesetComponent.showSuccessMessage;
	}
	
	get showStatusMessage() {
		return CreateRulesetComponent.showStatusMessage;
		}

	get errorMessage() {
		return CreateRulesetComponent.errorMessage;
	  }

	get successMessage() {
		return CreateRulesetComponent.successMessage;
		}

	get statusMessage() {
		return CreateRulesetComponent.statusMessage;
		}
	

	ngOnInit() {
		CreateRulesetComponent.showErrorMessage = false;
		CreateRulesetComponent.showSuccessMessage = false;
		
		this.disableRefamt = false;
		this.disableFop = true;
		this.disableShortcut = true;
		this.disableThresholds = true;
		this.disableInit = true;
		this.disableTier = true;
	}
	
	private uploadAll(){
		this.customUploader.options.additionalParameter={rulesetname:this.rulesetName};
		this.customUploader.authToken="bearer " + this.authToken;
		this.customUploader.uploadAllFiles();
	};
	private refamt(){
		
		this.disableFop = false;
		this.disableRefamt = true;
		this.disableShortcut = true;
		this.disableThresholds = true;
		this.disableInit = true;
		this.disableTier = true;
	}
	private fop(){
		
		this.disableShortcut = false;
		this.disableFop = true;
		this.disableRefamt = true;
		this.disableThresholds = true;
		this.disableInit = true;
		this.disableTier = true;		
	}

	private shortcut(){
		
		this.disableThresholds = false;

		this.disableShortcut = true;
		this.disableRefamt = true;
		this.disableFop = true;
		this.disableInit = true;
		this.disableTier = true;	

	}

	private thresholds(){
		
		this.disableInit = false;
		this.disableThresholds = true;
		this.disableShortcut = true;
		this.disableRefamt = true;
		this.disableFop = true;
		this.disableTier = true;	

	}

	private init(){
		
		this.disableTier = false;
		this.disableInit = true;
		this.disableThresholds = true;
		this.disableShortcut = true;
		this.disableRefamt = true;
		this.disableFop = true;

	}

	private tier(){
		
		this.disableTier = true;
		this.disableInit = true;
		this.disableThresholds = true;
		this.disableShortcut = true;
		this.disableRefamt = true;
		this.disableFop = true;

	}
	
}
