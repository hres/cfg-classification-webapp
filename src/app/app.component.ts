import { Component } 			from '@angular/core';
import { QueryService } 		from './services/query.service';
import { CfgModel } 			from './model/cfg.model';
//import { KeycloakService } 	from './keycloak-service/keycloak.service';
import { PopupMessage }			from './popup-message/popup-message';
import { MdDialog, MdDialogRef, MdDialogConfig }from '@angular/material';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
	providers: [QueryService, CfgModel]
})

export class AppComponent {
	public title = 'CFG Classification';

	constructor(private dialog:MdDialog){}//, private kc: KeycloakService){}

	//authenticated(): boolean {
		//return this.kc.authenticated();
	//}

	//login() {
		//this.kc.login();
	//}

	popupMessage(event:CustomEvent){
		let config = new MdDialogConfig();
		config.disableClose = true;

		let dialogRef = this.dialog.open(PopupMessage, config);
		dialogRef.componentInstance.message = event.detail.message;
		dialogRef.componentInstance.showYesButton = event.detail.showYesButton;
		dialogRef.componentInstance.showNoButton = event.detail.showNoButton;
		dialogRef.componentInstance.showOkButton = event.detail.showOkButton;

		dialogRef.afterClosed().subscribe(
			(retValue) => {
				if(retValue =="yes"){
					event.detail.callback();
				}
			})
	}
}
