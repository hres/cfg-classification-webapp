import { Component } from '@angular/core';
import { QueryService } from './services/query.service';
import { CfgModel } 	from './model/cfg.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [QueryService, CfgModel]
})

export class AppComponent {
  title = 'CFG Classification';
}
