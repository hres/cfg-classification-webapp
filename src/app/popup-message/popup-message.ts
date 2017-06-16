import { Component } from '@angular/core';

@Component({
	selector: 'app-popup-message',
	templateUrl: './popup-message.html',
	styleUrls: ['./popup-message.css']
})

export class PopupMessage {

	message:string;
	showYesButton:boolean;
	showNoButton:boolean;
	showOkButton:boolean;

}
