import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  HostListener,
  Output,
  EventEmitter,
  Input,
} from "@angular/core";
import { from, Observable, throwError, empty } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { StripeService } from "@services/stripe.service";
import { environment } from "@ENV";

@Component({
  selector: "app-stripe-payment-form",
  templateUrl: "./stripe-payment-form.component.html",
  styleUrls: ["./stripe-payment-form.component.scss"],
})
export class StripePaymentFormComponent implements AfterViewInit {
  @ViewChild("cardForm", { static: true }) cardForm: ElementRef;
  @ViewChild("stripeError", { static: true }) stripeError: ElementRef;

  @Input() performerStripeId;
  @Output() stripeValid = new EventEmitter();

  stripe;
  elements;
  card;
  stripeErrorMessage;
  shouldHighlightOutline = false;

  // Trigger the stripe element input field to change to desired color
  @HostListener("click", ["$event"])
  clickHandler(event) {
    if (event.target.classList.contains("mat-form-field-infix")) {
      this.cardForm.nativeElement.querySelector("input").focus();
    }
  }

  // Trigger the stripe element input field to change to desired color
  @HostListener("mouseover", ["$event"])
  hoverHandler(event) {
    if (event.target.classList.contains("mat-form-field-infix")) {
      this.cardForm.nativeElement.querySelector("input").focus();
    }
  }

  elementConfig = {
    style: {
      empty: {
        color: "#FF4081",
      },
      base: {
        color: "rgb(0, 0, 0 , 0.87)",
        fontWeight: 400,
        fontFamily: 'Roboto, "Helvetica Neue", sans-serif',
        fontSize: "12px",
        "::placeholder": {
          color: "rgb(63, 81, 181)",
        },
        ":hover": {
          color: "rgb(63, 81, 181)",
        },
      },
      invalid: {
        color: "#FF4081",

        "::placeholder": {
          color: "#FFCCA5",
        },
      },
    },
    classes: {
      focus: "focused",
    },
  };

  constructor(private stripeService: StripeService) {}

  ngAfterViewInit() {
    this.loadStripeScript().subscribe({
      error: (err) => console.error(err),
      complete: () => {
        this.stripe = Stripe(environment.stripePublicKey, {
          stripeAccount: this.performerStripeId,
        });
        this.elements = this.stripe.elements();
        this.card = this.elements.create("card", this.elementConfig);
        this.card.mount(this.cardForm.nativeElement);

        // event to signal stripe elements are  filled with valid values.
        this.card.on("change", (event) => {
          if (event.error) {
            this.stripeError.nativeElement.textContent = event.error.message;
          } else {
            this.stripeError.nativeElement.textContent = "";
          }
          this.stripeValid.emit(event.complete);
        });
      },
    });
  }

  ngDoCheck() {
    this.shouldHighlightOutline = this.cardForm.nativeElement.classList.contains(
      "focused"
    )
      ? true
      : false;
  }

  submitCardPayment(performerStripeId, paidRequest): Observable<any> {
    return from(this.stripe.createToken(this.card)).pipe(
      mergeMap(({ token, error }) => {
        return error
          ? throwError(error)
          : this.stripeService.createPaymentIntent(
              performerStripeId,
              paidRequest
            );
      })
    );
  }

  // inject script element
  loadStripeScript() {
    if (!document.getElementById("stripe-script")) {
      return new Observable((observer) => {
        const script = document.createElement("script");
        script.id = "stripe-script";
        script.type = "text/javascript";
        script.src = "https://js.stripe.com/v3/";
        script.onload = () => {
          observer.complete();
        };
        script.onerror = (err) => {
          observer.error({ err, type: "stripe error" });
        };
        // add to document in order to only import once with if statement above
        window.document.body.appendChild(script);
      });
    }
    return empty();
  }
}
