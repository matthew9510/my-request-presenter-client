import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import {
  Component,
  OnInit,
  Inject,
  ElementRef,
  ViewChild,
} from "@angular/core";
import { RequesterService } from "@services/requester.service";

@Component({
  selector: "app-end-user-license-agreement",
  templateUrl: "./end-user-license-agreement.component.html",
  styleUrls: ["./end-user-license-agreement.component.scss"],
})
export class EndUserLicenseAgreementComponent implements OnInit {
  @ViewChild("scroll", { static: false, read: ElementRef })
  public scroll: ElementRef<any>;
  title: string;
  loading = false;
  showSubmitErrorMessage = false;
  submitErrorMessage: string;
  constructor(
    public requesterService: RequesterService,
    public dialogRef: MatDialogRef<EndUserLicenseAgreementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.title = this.data.dialogTitle;
  }

  submitHandler() {
    // Show spinner
    this.loading = true;

    // Preparation of payload
    let payload = { signedEndUserLicenseAgreement: true };
    let requesterId = localStorage.getItem(
      this.requesterService.cognitoIdentityStorageKey
    );

    // Save user signature to database
    this.requesterService.postRequester(requesterId, payload).subscribe(
      (res: any) => {
        // Assign requesterService values
        this.requesterService.requester = res.body;

        //Assign local storage // save this to a service or localStorage for when the requester joins other events
        localStorage.setItem("requesterSignedEndUserLicenseAgreement", "true");

        // Hide spinner
        this.loading = false;
        // Close the dialog
        this.dialogRef.close(true);
      },
      (err) => {
        this.showSubmitErrorMessage = true;
        this.submitErrorMessage = "Error submitting try again.";
        this.loading = false;
        console.error(err);
      }
    );
  }
}
