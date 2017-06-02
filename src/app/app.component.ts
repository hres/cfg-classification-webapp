import { Component } 		from '@angular/core';
import { QueryService } 	from './services/query.service';
import { CfgModel } 		from './model/cfg.model';
import { KeycloakService } 	from './keycloak-service/keycloak.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
	providers: [QueryService, CfgModel]
})

export class AppComponent {
	public title = 'CFG Classification';

	constructor(private kc: KeycloakService){}

	authenticated(): boolean {
		return this.kc.authenticated();
	}

	login() {
		this.kc.login();
	}
}
