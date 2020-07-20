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
import { MinimumRequestAmount } from "../../validators/request-amount-validator";
import { PaidRequestsOnlyMinimumRequestAmount } from "../../validators/paid-requests-only-amount-validator";

import { StripeService } from "@services/stripe.service";

@Component({
  selector: "app-make-request",
  templateUrl: "./make-request.component.html",
  styleUrls: ["./make-request.component.scss"],
})
export class MakeRequestComponent implements OnInit, AfterContentInit {
  isPaidRequestsOnly: boolean;
  requestInfoForm: FormGroup;
  requestPaymentForm: FormGroup;
  isPaidRequest: boolean = false;

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
    public stripeService: StripeService,
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
    this.isPaidRequestsOnly = this.data.isPaidRequestsOnly;
    this.isTopUp = this.data.isTopUp;
    this.title = this.data.dialogTitle;
    this.performerStripeId = this.data.performerStripeId;

    this.requestInfoForm = this.fb.group({
      song: ["", [Validators.required]],
      artist: [null],
      amount: [""],
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

    // Create payment form
    this.requestPaymentForm = this.fb.group({
      stripe: [null, Validators.required],
    });

    // load form with data passed in
    this.requestInfoForm.patchValue(this.data);

    // if topup disable certain form fields from being manipulated
    if (this.isTopUp) {
      this.requestInfoForm.controls["song"].disable();
      this.requestInfoForm.controls["artist"].disable();
      this.requestInfoForm.controls["memo"].disable();
    }

    // set appropriate validators
    if (this.isPaidRequestsOnly || this.isTopUp) {
      this.requestInfoForm.controls["amount"].setValidators([
        PaidRequestsOnlyMinimumRequestAmount(
          this.stripeService.minimumRequestAmount.toString()
        ),
      ]);
    } else {
      this.requestInfoForm.controls["amount"].setValidators([
        MinimumRequestAmount(
          this.stripeService.minimumRequestAmount.toString()
        ),
      ]);
    }
    this.requestInfoForm.controls["amount"].updateValueAndValidity();

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

      if (
        Number(this.requestInfoForm.value.amount) >=
        this.stripeService.minimumRequestAmount
      ) {
        this.isPaidRequest = true;
      } else {
        this.isPaidRequest = false;
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
    if (this.isPaidRequestsOnly || this.isPaidRequest) this.makePaidRequest();
    else this.makeFreeRequest();
  }

  makeFreeRequest() {
    //convert amount value from empty string to a number 0
    let freeRequestObject = Object.assign(
      {},
      this.requestInfoForm.getRawValue()
    );
    freeRequestObject.amount = 0;

    this.requestService.makeRequest(freeRequestObject).subscribe(
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
        if (this.isTopUp) {
          setTimeout(() => {
            this.dialogRef.close({ requestSuccesful: true });
          }, 8000);
        } else {
          setTimeout(() => {
            this.dialogRef.close(true);
          }, 8000);
        }
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
    console.log(this.isPaidRequest);
    this.requestFormNumber += 1;

    // Update the amount to be in decimal format
    let amountFormControl = this.requestInfoForm.controls["amount"];
    if (
      Number(amountFormControl.value) >= this.stripeService.minimumRequestAmount
    ) {
      amountFormControl.setValue(Number(amountFormControl.value).toFixed(2));
    }
  }
}
