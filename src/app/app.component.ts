import { Component, OnInit } 			from '@angular/core';
import { QueryService } 		from './services/query.service';
import { CfgModel } 			from './model/cfg.model';
import { KeycloakService } 	from './keycloak-service/keycloak.service';
import { PopupMessage }			from './popup-message/popup-message';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';

import { KeycloakHttp } 	from './keycloak-service/keycloak.http';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
	providers: [QueryService, CfgModel, KeycloakHttp]
})

export class AppComponent implements OnInit {
	public title = 'CFG Classification';
	private userFullName:string;

	constructor(private dialog:MatDialog, private keycloakService: KeycloakService, private cfgModel: CfgModel){}

	ngOnInit(){
		this.keycloakService.loadUserInfo()
			.success((userInfo:any) =>{
				this.cfgModel.userFullName = userInfo.name;
			})
			.error((error:any) =>{
				console.log('eror');
			});
		this.cfgModel.isCfgAdmin = this.keycloakService.hasRealmRole('cfg-admin');
		this.cfgModel.isAnalyst = this.keycloakService.hasRealmRole('analyst');
		
		if(!this.authenticated()){
			this.login();
		}
	}

	authenticated(): boolean {
		return this.keycloakService.authenticated();
	}

	login() {
		this.keycloakService.login();
	}

	logout(){
		this.keycloakService.logout();
	}

	popupMessage(event:CustomEvent){
		let config = new MatDialogConfig();
		config.disableClose = true;

		let dialogRef = this.dialog.open(PopupMessage, config);
		dialogRef.componentInstance.message = event.detail.message;
		dialogRef.componentInstance.showYesButton = event.detail.showYesButton;
		dialogRef.componentInstance.showNoButton = event.detail.showNoButton;
		dialogRef.componentInstance.showOkButton = event.detail.showOkButton;

		dialogRef.afterClosed().subscribe(
			retValue => {
				if(retValue =="yes"){
					event.detail.callback();
				}
			})
	}
}
