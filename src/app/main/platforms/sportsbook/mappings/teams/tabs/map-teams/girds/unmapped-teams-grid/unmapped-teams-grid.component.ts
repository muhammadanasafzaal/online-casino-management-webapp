import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';

import { MatSnackBar } from '@angular/material/snack-bar';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import 'ag-grid-enterprise';
import { take } from 'rxjs/operators';

import { Paging } from 'src/app/core/models';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { SportsbookApiService } from 'src/app/main/platforms/sportsbook/services/sportsbook-api.service';
import { AgDropdownFilter } from 'src/app/main/components/grid-common/ag-dropdown-filter/ag-dropdown-filter.component';

@Component({
  selector: 'app-unmapped-teams-grid',
  templateUrl: './unmapped-teams-grid.component.html',
  styleUrls: ['./unmapped-teams-grid.component.scss'],
})
export class UnmappedTeamsGridComponent extends BasePaginatedGridComponent implements OnInit {

  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;
  @Output() valueEmitted: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() sports: any[] = [];
  @Input() providers: any[] = [];
  @Input() sportId: number | null;

  rowData = [];
  isCanNotSelect = true;

  frameworkComponents = {
    agDropdownFilter: AgDropdownFilter,
  };

  typeNames = [
    {Id: 0, Name: 'Team' },
    {Id: 1, Name: 'Member' },
    {Id: 2, Name: 'Special' },
  ]


  constructor(
    protected injector: Injector,
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
  ) {
    super(injector);
  }


  ngOnInit(): void {
    setTimeout(() => {
      this.setColumtDefs()
    }, 500)
  }

  setColumtDefs() {
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ExternalId',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Common.Type',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TypeName',
        resizable: true,
        sortable: true,
        filter: false,
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'NickName',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Partners.Provider',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ProviderName',
        resizable: true,
        sortable: true,
        filter: 'agDropdownFilter',
        filterParams: {
          filterOptions: this.filterService.stateOptions,
          filterData: this.providers,
        },
      },
      {
        headerName: 'Sport.SportName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SportNickName',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Payments.Date',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CreationDate',
        sortable: true,
        filter: 'agDateColumnFilter',
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.CreationDate, 'medium');
          return `${dat}`;
        },
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
    ];
  }


  onGridReady(params) {
    super.onGridReady(params);
    this.agGrid?.api.setServerSideDatasource(this.createServerSideDatasource());
  }

  createServerSideDatasource() {
    return {
      getRows: (params) => {

        const paging = new Paging();
        paging.PageIndex = this.paginationPage - 1;
        paging.PageSize = this.cacheBlockSize;
        paging.ObjectTypeId = 4;
        paging.SportIds = null;

        if (this.sportId) {
          paging.SportIds = {
            IsAnd: true,
            ApiOperationTypeList: [{ IntValue: this.sportId, OperationTypeId: 1 }]
          };
        } else {
          delete paging.SportIds;
        }
        this.changeFilerName(params.request.filterModel,
          ['ProviderName', 'TypeName'], ['ProviderId', 'Type']);
        this.setSort(params.request.sortModel, paging);
        this.setFilter(params.request.filterModel, paging);

        this.apiService.apiPost('common/unknowns', paging,
        ).pipe(take(1)).subscribe(data => {
          if (data.Code === 0) {
            const mappedRows = data.Objects;
            mappedRows.forEach(sport => {
              let providerName = this.providers.find((provider) => {
                return provider.Id == sport.ProviderId;
              })
              if (providerName) {
                sport['ProviderName'] = providerName.Name;
              }
              sport.TypeName = this.typeNames.find((type) => {
                return type.Id == sport.Type;
              }).Name;
            })
            params.success({ rowData: mappedRows, rowCount: data.TotalCount });
          } else {
            SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
          }
        });
      },
    };
  }

  onPageSizeChanged() {
    this.agGrid.api.paginationSetPageSize(Number(this.cacheBlockSize));
  }

  onRowSelected() {
    this.valueEmitted.emit(false);
  }


}
