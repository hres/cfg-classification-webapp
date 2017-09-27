import { Injectable } from '@angular/core';

@Injectable()
export class CfgModel {

	public sandboxMode:boolean=false;

	// User Info
	public userFullName:string;
	public isCfgAdmin:boolean;

}
