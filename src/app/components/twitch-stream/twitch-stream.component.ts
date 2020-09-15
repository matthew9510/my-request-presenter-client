import { Component, OnInit, Input, AfterViewInit } from "@angular/core";

@Component({
  selector: "app-twitch-stream",
  templateUrl: "./twitch-stream.component.html",
  styleUrls: ["./twitch-stream.component.scss"],
})
export class TwitchStreamComponent implements OnInit, AfterViewInit {
  twitterIframeUrl: string;
  @Input() performerTwitchChannel: string;
  constructor() {}
  ngAfterViewInit(): void {}

  ngOnInit() {
    this.twitterIframeUrl =
      "https://player.twitch.tv/?channel=" +
      this.performerTwitchChannel +
      "&muted=false&autoplay=false" +
      "&parent=localhost" +
      "&parent=develop.d2875do098zx8f.amplifyapp.com" +
      "&parent=app.myrequest.ssflabs.net";
  }
}
