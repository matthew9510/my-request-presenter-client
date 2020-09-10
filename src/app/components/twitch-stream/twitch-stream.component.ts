import { Component, OnInit, AfterViewInit, Input } from "@angular/core";
import { Observable, empty } from "rxjs";

@Component({
  selector: "app-twitch-stream",
  templateUrl: "./twitch-stream.component.html",
  styleUrls: ["./twitch-stream.component.scss"],
})
export class TwitchStreamComponent implements OnInit, AfterViewInit {
  @Input() performerTwitchChannel;
  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.loadTwitchScript().subscribe({
      error: (err) => console.error(err),
      complete: () => {
        new Twitch.Embed("twitch-embed", {
          width: "100%",
          height: "100%",
          channel: this.performerTwitchChannel,
          theme: "light",
          layout: "video",
          autoplay: true,
          muted: false,
          allowfullscreen: true,
        });
      },
    });
  }

  // inject script element
  loadTwitchScript() {
    if (!document.getElementById("twitch-script")) {
      return new Observable((observer) => {
        const script = document.createElement("script");
        script.id = "twitch-script";
        script.type = "text/javascript";
        script.src = "https://embed.twitch.tv/embed/v1.js";
        script.onload = () => {
          observer.complete();
        };
        script.onerror = (err) => {
          observer.error({ err, type: "twitch error" });
        };
        // add to document in order to only import once with if statement above
        window.document.body.appendChild(script);
      });
    }
    return empty();
  }
}