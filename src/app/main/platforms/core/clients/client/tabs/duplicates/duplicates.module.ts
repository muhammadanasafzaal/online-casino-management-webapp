import {RouterModule, Routes} from "@angular/router";

import {NgModule} from "@angular/core";
import {CommonModule, DatePipe} from "@angular/common";
import {AgGridModule} from "ag-grid-angular";
import {MatButtonModule} from "@angular/material/button";

import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatInputModule} from "@angular/material/input";

import {MatNativeDateModule} from "@angular/material/core";
import {FormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import { MatSelectModule } from '@angular/material/select';
import { PartnerDateFilterComponent } from "../../../../../../components/partner-date-filter/partner-date-filter.component";
import { DuplicatesComponent } from "./duplicates.component";

const routes: Routes = [
  {
    path: '',
    component: DuplicatesComponent
  }
];
@NgModule({
    declarations: [DuplicatesComponent],
    providers: [DatePipe],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        AgGridModule,
        MatButtonModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatInputModule,
        MatSelectModule,
        TranslateModule,
        PartnerDateFilterComponent
    ]
})
export class DuplicatesModule {

}
