import { Component, OnInit, Inject, ErrorHandler } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RequestsService } from '../../services/requests.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { translate } from '@ngneat/transloco';

@Component({
  selector: 'app-make-request',
  templateUrl: './make-request.component.html',
  styleUrls: ['./make-request.component.scss']
})
export class MakeRequestComponent implements OnInit {
  requestForm: FormGroup;
  loading = false;
  success = false;
  errorMessage = false;
  errorMsg: string;
  title: string;

  constructor(
    private fb: FormBuilder,
    private requestService: RequestsService,
    public dialogRef: MatDialogRef<MakeRequestComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.title = this.data.dialogTitle;
    this.requestForm = this.fb.group({
      song: ['', [
        Validators.required
      ]],
      artist: ['', [
        Validators.required
      ]],
      amount: [''],
      memo: [null],
      eventId: this.data.eventId,
      originalRequestId: ["Not Sure on value"],
      status: ["pending"],
      requesterId: ["8ef9e7c9-8bfb-45ed-938b-152a7910b45c"],
      type: ["Not Sure on value"],
    });
    this.requestForm.patchValue(this.data);
    // this.requestForm.valueChanges.subscribe(); 
    // only do this if you want to get value changes
  }

  confirmDialog() {
    this.dialogRef.close(true)
  }

  closeDialog() {
    this.dialogRef.close(false);
  }

  get song() {
    return this.requestForm.get('song');
  }

  get artist() {
    return this.requestForm.get('artist');
  }

  submitHandler() {
    this.loading = true;
    // console.log(JSON.stringify(this.requestForm.value));
    this.makeRequest();
  }

  makeRequest() {
    this.requestService.makeRequest(this.requestForm.value)
      .subscribe(
        (res: any) => {
          // console.log(res);
          this.loading = false;
          this.success = true;
          this.dialogRef.close(true);
        }, (err) => {
          console.log(err)
          this.errorHandler(err);
          this.success = false;
          this.errorMessage = true;
          this.loading = false;
        })
  }

  errorHandler(err: { status: number; }) {
    if (err.status === 422) {
      this.errorMsg = translate('422 error message');
    }
    else {
      this.errorMsg = translate('general error message');
    }
  }

}
