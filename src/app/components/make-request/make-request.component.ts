import {
  Component,
  OnInit,
  Inject,
  ErrorHandler,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { RequestsService } from "../../services/requests.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { translate } from "@ngneat/transloco";

@Component({
  selector: "app-make-request",
  templateUrl: "./make-request.component.html",
  styleUrls: ["./make-request.component.scss"],
})
export class MakeRequestComponent implements OnInit, AfterViewInit {
  requestForm: FormGroup;
  loading = false;
  success = false;
  showSubmitErrorMessage: boolean = false;
  submitErrorMessage: string;
  title: string;
  isTopUp: boolean;
  displayNextPage: boolean = false;

  // for setting autofocus on inputs
  private targetId = "input0";
  private autoFocusElements: any;
  @ViewChild("input0", { static: false }) input0: ElementRef;
  @ViewChild("input1", { static: false }) input1: ElementRef;
  @ViewChild("input2", { static: false }) input2: ElementRef;

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

  togglePage() {
    if (this.displayNextPage === false) {
      this.displayNextPage = true;
    } else {
      this.displayNextPage = false;
    }
  }

  ngAfterViewInit(): void {
    // initialize to assist setting autofocus on inputs
    this.autoFocusElements = {
      input0: this.input0,
      input1: this.input1,
      input2: this.input2,
    };
  }

  ngOnInit() {
    this.isTopUp = this.data.isTopUp;
    this.title = this.data.dialogTitle;
    this.requestForm = this.fb.group({
      song: ["", [Validators.required]],
      artist: [null],
      amount: [null, [Validators.pattern(/^[0-9]\d{0,9}(\.\d{1,2})?%?$/)]],
      memo: [""],
      eventId: this.data.eventId,
      performerId: this.data.performerId,
      originalRequestId: [null],
      status: ["pending"],
      requesterId: [
        localStorage.getItem(
          "aws.cognito.identity-id.us-west-2:68ff65f5-9fd0-42c9-80e1-325e03d9c1e9"
        ),
      ],
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
      originalRequestId: [null],
      status: ["pending"],
      requesterId: [
        localStorage.getItem(
          "aws.cognito.identity-id.us-west-2:68ff65f5-9fd0-42c9-80e1-325e03d9c1e9"
        ),
      ],
      // type: ["Not Sure on value"],
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

  get amount() {
    return this.requestForm.get("amount");
  }

  submitHandler() {
    this.loading = true;
    this.makeRequest();
  }

  makeRequest() {
    this.requestForm.value.amount = Number(this.requestForm.value.amount);
    // console.log(Number(this.requestForm.value.amount));
    this.requestService.makeRequest(this.requestForm.value).subscribe(
      (res) => {
        // console.log(res);
        this.loading = false;
        this.success = true;
        setTimeout(() => {
          this.dialogRef.close(true);
        }, 8000);
      },
      (err) => {
        console.log(err);
        this.errorHandler(err);
        this.success = false;
        this.showSubmitErrorMessage = true;
        this.loading = false;
      }
    );
  }

  errorHandler(err: { status: number }) {
    if (err.status === 422) {
      this.submitErrorMessage = translate("422 error message");
    } else {
      this.submitErrorMessage = translate("general error message");
    }
  }

  /* These two methods below set autofocus on the first input of each step of the stepper */
  setFocus() {
    let targetElem: { nativeElement: { focus: () => void } }; // target appropriate viewchild using targetId

    // assign the target element accordingly
    if (this.targetId === "input2") {
      targetElem = this.autoFocusElements[this.targetId]._elementRef;
    } else {
      targetElem = this.autoFocusElements[this.targetId];
    }

    // set focus on the element
    targetElem.nativeElement.focus();
  }

  setTargetId(event: any) {
    this.targetId = `input${event.selectedIndex}`;
  }
}
