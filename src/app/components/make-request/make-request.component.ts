import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef,
  AfterContentInit,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { RequestsService } from "../../services/requests.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { translate } from "@ngneat/transloco";

@Component({
  selector: "app-make-request",
  templateUrl: "./make-request.component.html",
  styleUrls: ["./make-request.component.scss"],
})
export class MakeRequestComponent implements OnInit, AfterContentInit {
  isPaidEvent: boolean;
  requestInfoForm: FormGroup;
  requestPaymentForm: FormGroup;

  loading = false;
  success = false;
  showSubmitErrorMessage: boolean = false;
  submitErrorMessage: string;
  title: string;
  isTopUp: boolean;
  displayNextPage: boolean = false;
  requestFormNumber: number = 1;

  // for focusing on desired inputs
  @ViewChild("songInput", { static: false }) songInput: ElementRef;
  @ViewChild("amountInput", { static: false }) amountInput: ElementRef;

  // Stripe dependencies
  @ViewChild("stripe", { static: false }) stripe;

  performerStripeId;

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

  ngAfterContentInit() {
    if (this.isTopUp) {
      setTimeout(() => this.amountInput.nativeElement.focus(), 500);
    } else {
      setTimeout(() => this.songInput.nativeElement.focus(), 500);
    }
  }

  ngOnInit() {
    this.isPaidEvent = this.data.isPaidEvent;
    this.isTopUp = this.data.isTopUp;
    this.title = this.data.dialogTitle;
    this.performerStripeId = this.data.performerStripeId;

    this.requestInfoForm = this.fb.group({
      song: ["", [Validators.required]],
      artist: [null],
      memo: [""],
      eventId: this.data.eventId,
      performerId: this.data.performerId,
      originalRequestId: [null],
      status: ["pending"],
      requesterId: [
        localStorage.getItem(this.requestService.cognitoIdentityStorageKey),
      ],
      firstName: [sessionStorage.getItem("firstName")],
      lastName: [sessionStorage.getItem("lastName")],
    });

    if (this.isPaidEvent) {
      // Add amount form control
      this.requestInfoForm.addControl(
        "amount",
        new FormControl(null, [
          Validators.pattern(/^[0-9]\d{0,9}(\.\d{1,2})?%?$/),
          Validators.min(1),
          Validators.required,
        ])
      );
      // Create payment form
      this.requestPaymentForm = this.fb.group({
        stripe: [null, Validators.required],
      });

      // if topup disable certain form fields from being manipulated
      if (this.isTopUp) {
        this.requestInfoForm.controls["song"].disable();
        this.requestInfoForm.controls["artist"].disable();
        this.requestInfoForm.controls["memo"].disable();
      }
    }

    this.requestInfoForm.patchValue(this.data);

    this.requestInfoForm.valueChanges.subscribe((x) => {
      if (this.requestInfoForm.value.firstName !== null) {
        sessionStorage.setItem(
          "firstName",
          this.requestInfoForm.value.firstName
        );
      }
      if (this.requestInfoForm.value.lastName !== null) {
        sessionStorage.setItem("lastName", this.requestInfoForm.value.lastName);
      }
    });
    this.requestInfoForm.valueChanges.subscribe((x) => {
      if (this.requestInfoForm.value.amount === null) {
        this.requestInfoForm.value.amount = 0;
      }
    });
  }

  confirmDialog() {
    this.dialogRef.close(true);
  }

  closeDialog() {
    this.dialogRef.close(false);
  }

  get song() {
    return this.requestInfoForm.get("song");
  }

  get artist() {
    return this.requestInfoForm.get("artist");
  }

  get firstName() {
    return this.requestInfoForm.get("firstName");
  }

  get lastName() {
    return this.requestInfoForm.get("lastName");
  }

  get amount() {
    return this.requestInfoForm.get("amount");
  }

  submitHandler() {
    this.loading = true;
    if (this.isPaidEvent) this.makePaidRequest();
    else this.makeFreeRequest();
  }

  makeFreeRequest() {
    this.requestService
      .makeRequest(this.requestInfoForm.getRawValue())
      .subscribe(
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

  makePaidRequest() {
    let paidRequestObject = Object.assign(
      {},
      this.requestInfoForm.getRawValue()
    );
    paidRequestObject.amount = Number(paidRequestObject.amount);

    const transaction$ = this.stripe.submitCardPayment(
      this.performerStripeId,
      paidRequestObject
    );

    transaction$.subscribe(
      (res: any) => {
        // change component flags
        this.loading = false;
        this.success = true;
        console.log(res);
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

  // runs when the stripe element input is altered in any way
  removeStripeControl(isStripeValid: Boolean) {
    if (isStripeValid) {
      return this.requestPaymentForm.removeControl("stripe"); // why are we doing this? because we don't want access to the secure info if we dont need to??
    }
    if (!this.requestPaymentForm.get("stripe")) {
      // if the element is changed after being valid capture that data (but we are not even technically 'capturing it, we are just making sure it is required?)
      return this.requestPaymentForm.addControl(
        "stripe",
        new FormControl(null, Validators.required)
      );
    }
    return;
  }

  errorHandler(err: { status: number }) {
    if (err.status === 422) {
      this.submitErrorMessage = translate("422 error message");
    } else {
      this.submitErrorMessage = translate("general error message");
    }
  }

  decrementFormStep() {
    this.requestFormNumber -= 1;
    if (this.isTopUp) {
      setTimeout(() => this.amountInput.nativeElement.focus(), 500);
    } else {
      setTimeout(() => this.songInput.nativeElement.focus(), 500);
    }
  }

  incrementFormStep() {
    this.requestFormNumber += 1;

    if (this.isPaidEvent) {
      // Update the amount to be in decimal format
      let amountFormControl = this.requestInfoForm.controls["amount"];
      amountFormControl.setValue(Number(amountFormControl.value).toFixed(2));
    }
  }
}
