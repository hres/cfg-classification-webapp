import { Component, OnInit, Directive } 	from '@angular/core';
import { FileSelectDirective, FileUploader }from 'ng2-file-upload';
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

	public customUploader:FileUploaderCustom = new FileUploaderCustom({url: environment.servicesUrl + 'service/upload'});

	private rulesetName:string;
	private authToken:string;

	constructor(private keycloakService: KeycloakService) {
		keycloakService.getToken().then((token)=>{
			this.authToken=token;
		})
	}

	ngOnInit() {}
	
	private uploadAll(){
		this.customUploader.options.additionalParameter={rulesetname:this.rulesetName};
		this.customUploader.authToken="bearer " + this.authToken;
		this.customUploader.uploadAllFiles();
	}

}
