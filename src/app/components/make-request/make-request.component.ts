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
  // for setting autofocus on inputs
  private targetId = 'input0';

  constructor(
    private fb: FormBuilder,
    private requestService: RequestsService,
    public dialogRef: MatDialogRef<MakeRequestComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.title = this.data.dialogTitle;
    this.requestForm = this.fb.group({
      song: [null, [
        Validators.required
      ]],
      artist: [null],
      amount: [null],
      memo: [null],
      eventId: this.data.eventId,
      performerId: this.data.performerId,
      originalRequestId: ["Not Sure on value"],
      status: ["pending"],
      requesterId: ["8ef9e7c9-8bfb-45ed-938b-152a7910b45c"],
      type: ["Not Sure on value"],
      firstname: [sessionStorage.getItem('firstname')],
      lastname: [sessionStorage.getItem('lastname')]
    });
    this.requestForm.patchValue(this.data);
    this.requestForm.valueChanges.subscribe(x => {
      sessionStorage.setItem('firstname', this.requestForm.value.firstname);
      sessionStorage.setItem('lastname', this.requestForm.value.lastname);
    });
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

  get firstname() {
    return this.requestForm.get('firstname');
  }

  get lastname() {
    return this.requestForm.get('lastname');
  }


  submitHandler() {
    this.loading = true;
    this.makeRequest();
  }

  makeRequest() {
    this.requestService.makeRequest(this.requestForm.value)
      .subscribe(
        (res) => {
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

  // these two methods set autofocus on the first input of each step of the stepper
  setFocus() {
    const targetElem = document.getElementById(this.targetId);
    targetElem.focus();
  }

  setTargetId(event: any) {
    this.targetId = `input${event.selectedIndex}`;
  }

}