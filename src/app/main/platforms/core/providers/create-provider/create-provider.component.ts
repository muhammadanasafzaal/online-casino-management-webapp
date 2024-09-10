import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from "@ngx-translate/core";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { ConfigService } from 'src/app/core/services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Controllers, Methods } from 'src/app/core/enums';
import { take } from 'rxjs/operators';
import { CoreApiService } from '../../services/core-api.service';
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-create-provider',
  templateUrl: './create-provider.component.html',
  styleUrls: ['./create-provider.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    TranslateModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ],
})
export class CreateProviderComponent implements OnInit {
  formGroup: UntypedFormGroup;
  isSendingReqest = false;

  constructor(
    public dialogRef: MatDialogRef<CreateProviderComponent>,
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    private apiService: CoreApiService,
    private configService: ConfigService,
  ) { }

  ngOnInit() {

    this.createForm();

  }

  public createForm() {
    this.formGroup = this.fb.group({
      Id: [null, [Validators.required]],
      Name: [null, [Validators.required]],
      SessionExpireTime: [null, [Validators.required]],
    });
  }

  get errorControl() {
    return this.formGroup.controls;
  }

  close() {
    this.dialogRef.close();
  }



  onSubmit() {
    if (this.formGroup.invalid || this.isSendingReqest) {
      return;
    }
    this.isSendingReqest = true; 
    const obj = this.formGroup.getRawValue();
    this.apiService.apiPost(this.configService.getApiUrl, obj,
      true, Controllers.PRODUCT, Methods.SAVE_GAME_PROVIDER).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.dialogRef.close(data.ResponseObject);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
        this.isSendingReqest = false; 
      });


  }

}