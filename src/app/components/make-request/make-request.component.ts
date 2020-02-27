import { Component, OnInit, ErrorHandler } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RequestsService } from '../../services/requests.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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


  constructor(
    private fb: FormBuilder,
    private requestService: RequestsService,
    public dialogRef: MatDialogRef<MakeRequestComponent>,
  ) { }

  ngOnInit() {
    this.requestForm = this.fb.group({
      song: ['', [
        Validators.required
      ]],
      artist: ['', [
        Validators.required
      ]],
      tip: ['',],
      memo: ['',],
      event_id: ["705346f8-c9da-4dc4-b0b8-6898595dcaaf"],
      original_request_id: ["Not Sure on value"],
      status: ["pending"],
      requester_id: ["8ef9e7c9-8bfb-45ed-938b-152a7910b45c"],
      type: ["Not Sure on value"],
    });
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
    console.log(JSON.stringify(this.requestForm.value))
    this.makeRequest();
  }

  makeRequest() {
    const requestsResponseSubscription = this.requestService.makeRequest(JSON.stringify(this.requestForm.value))
      .subscribe(
        (res: any) => {
          // do something with the res
          console.log(res)
          this.loading = false;
          this.success = true;
        }, (err) => {
          console.log(err)
          this.errorHandler(err);
          this.success = false;
          this.errorMessage = true;
          this.loading = false;
        })
    // timeout is not working
    setTimeout(() => {
      requestsResponseSubscription.unsubscribe();
    }, 1000)
  }

  errorHandler(err: { status: number; }) {
    if (err.status === 422) {
      this.errorMsg = `This request already exists for this event.`
    }
    else {
      this.errorMsg = "Oh no! Something went wrong.";
    }
  }

}
