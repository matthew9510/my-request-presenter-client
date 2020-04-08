import { Component, OnInit, Inject, ErrorHandler } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { RequestsService } from "../../services/requests.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { translate } from "@ngneat/transloco";

@Component({
  selector: "app-make-request",
  templateUrl: "./make-request.component.html",
  styleUrls: ["./make-request.component.scss"],
})
export class MakeRequestComponent implements OnInit {
  requestForm: FormGroup;
  loading = false;
  success = false;
  errorMessage = false;
  errorMsg: string;
  title: string;
  isTopUp: boolean;
  // for setting autofocus on inputs
  private targetId = "input0";

  constructor(
    private fb: FormBuilder,
    private requestService: RequestsService,
    public dialogRef: MatDialogRef<MakeRequestComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (sessionStorage.getItem("firstName") == undefined) {
      sessionStorage.setItem("firstName", "");
    }
    if (sessionStorage.getItem("lastName") == undefined) {
      sessionStorage.setItem("lastName", "");
    }
  }

  ngOnInit() {
    this.isTopUp = this.data.isTopUp;
    this.title = this.data.dialogTitle;
    this.requestForm = this.fb.group({
      song: ["", [Validators.required]],
      artist: [null],
      amount: [0, [Validators.pattern(/^[0-9]\d{0,9}(\.\d{1,3})?%?$/)]],
      memo: [""],
      eventId: this.data.eventId,
      performerId: this.data.performerId,
      originalRequestId: [null],
      status: ["pending"],
      requesterId: ["8ef9e7c9-8bfb-45ed-938b-152a7910b45c"],
      // type: ["Not Sure on value"],
      firstName: [sessionStorage.getItem("firstName")],
      lastName: [sessionStorage.getItem("lastName")],
    });
    this.requestForm.patchValue(this.data);
    this.requestForm.valueChanges.subscribe((x) => {
      if (this.requestForm.value.firstName !== null) {
        sessionStorage.setItem("firstName", this.requestForm.value.firstName);
      }
      if (this.requestForm.value.lastName !== null) {
        sessionStorage.setItem("lastName", this.requestForm.value.lastName);
      }
    });
    this.requestForm.valueChanges.subscribe((x) => {
      if (this.requestForm.value.amount === null) {
        this.requestForm.value.amount = 0;
      }
    });
  }

  resetForm() {
    this.requestForm = this.fb.group({
      song: ["", [Validators.required]],
      artist: [null],
      amount: [null],
      memo: [""],
      eventId: this.data.eventId,
      performerId: this.data.performerId,
      originalRequestId: ["Not Sure on value"],
      status: ["pending"],
      requesterId: ["8ef9e7c9-8bfb-45ed-938b-152a7910b45c"],
      type: ["Not Sure on value"],
      firstName: [sessionStorage.getItem("firstName")],
      lastName: [sessionStorage.getItem("lastName")],
    });
  }

  confirmDialog() {
    this.dialogRef.close(true);
  }

  closeDialog() {
    this.dialogRef.close(false);
  }

  get song() {
    return this.requestForm.get("song");
  }

  get artist() {
    return this.requestForm.get("artist");
  }

  get firstName() {
    return this.requestForm.get("firstName");
  }

  get lastName() {
    return this.requestForm.get("lastName");
  }

  submitHandler() {
    this.loading = true;
    this.makeRequest();
  }

  makeRequest() {
    this.requestService.makeRequest(this.requestForm.value).subscribe(
      (res) => {
        // console.log(res);
        this.loading = false;
        this.success = true;
        this.dialogRef.close(true);
      },
      (err) => {
        console.log(err);
        this.errorHandler(err);
        this.success = false;
        this.errorMessage = true;
        this.loading = false;
      }
    );
  }

  errorHandler(err: { status: number }) {
    if (err.status === 422) {
      this.errorMsg = translate("422 error message");
    } else {
      this.errorMsg = translate("general error message");
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
