import { Component } from '@angular/core';

@Component({
	selector: 'app-popup-message',
	templateUrl: './popup-message.html',
	styleUrls: ['./popup-message.css']
})

export class PopupMessage {
	// retValues
	yesClicked:string = "yes";
	noClicked:string = "no";
	okClicked:string = "ok";

	message:string;
	showYesButton:boolean;
	showNoButton:boolean;
	showOkButton:boolean;

}
