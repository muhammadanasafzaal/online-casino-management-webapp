import {Component, Inject, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CommonDataService, ConfigService} from "../../../../../../../../core/services";
import {ActivatedRoute} from "@angular/router";
import {take} from "rxjs/operators";
import {SnackBarHelper} from "../../../../../../../../core/helpers/snackbar.helper";
import { PoolBettingApiService } from 'src/app/main/platforms/sportsbook/services/pool-betting-api.service';
import { PBControllers, PBMethods } from 'src/app/core/enums';

@Component({
  selector: 'app-add-edit-translations',
  templateUrl: './add-edit-translations.component.html',
  styleUrls: ['./add-edit-translations.component.scss']
})
export class AddEditTranslationsComponent implements OnInit {
  public menuItem;
  public menuItemId;
  public items;
  public currentItem;
  public translations = [];
  public formGroup: UntypedFormGroup;
  public partnerId;

  constructor(public dialogRef: MatDialogRef<AddEditTranslationsComponent>,
              private apiService: PoolBettingApiService,
              private _snackBar: MatSnackBar,
              public configService: ConfigService,
              private activateRoute: ActivatedRoute,
              private fb: UntypedFormBuilder,
              public commonDataService: CommonDataService,
              @Inject(MAT_DIALOG_DATA) private data) {
  }

  ngOnInit(): void {
    this.partnerId = this.activateRoute.snapshot.queryParams.partnerId;
    this.menuItem = this.data;
    this.menuItemId = this.data.Id;
    this.getTranslations();
  }

  close() {
    this.dialogRef.close();
  }

  getTranslations() {
    this.apiService.apiPost(PBControllers.COMMON, PBMethods.GET_TRANSLATIONS, {SubMenuItemId: this.menuItemId})
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.items = JSON.parse(JSON.stringify(data.ResponseObject));
          this.currentItem = data.ResponseObject;
          this.translations = data.ResponseObject.Translations;
        } else {
          SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
        }
      });
  }

  submit() {
    let translations = this.currentItem.Translations.map((item) => {
      item.ObjectTypeId = 25;
      item.TranslationId = this.currentItem.TranslationId;
      return item;
    })
    let changed = [];
    for (let i = 0; i < translations.length; i++) {
      if (translations[i].Text != this.items.Translations[i].Text)
        changed.push(this.currentItem.Translations[i]);
    }
    if (changed.length === 0) {
      return
    } else {
      this.apiService.apiPost(PBControllers.COMMON, PBMethods.SAVE_TRANSLATION_ENTRIES, {Translations: changed})
        .pipe(take(1))
        .subscribe(data => {
          if (data.Code === 0) {
            this.dialogRef.close(data.ResponseObject);
          } else {
            SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
          }
        });
    }

  }

  get errorControl() {
    return this.formGroup.controls;
  }

}
