import { Component, Inject } from "@angular/core";
import Amplify, { PubSub, Auth } from "aws-amplify";
import { AWSIoTProvider } from "@aws-amplify/pubsub/lib/Providers";
import { environment } from "@ENV";
import { enableDebugTools } from "@angular/platform-browser";

// Amplify.addPluggable(new AWSIoTProvider({
//   aws_pubsub_region: 'us-west-2',
//   aws_pubsub_endpoint: 'a2983euzfbsfbz-ats.iot.us-west-2.amazonaws.com',
// }));

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "My Request Requester";

  // constructor() {
  //   Amplify.PubSub.subscribe('request-app').subscribe({
  //     next: data => console.log('Message received', data),
  //     error: error => console.error(error),
  //     close: () => console.log('Done'),
  //   });
  // }

  ngOnInit() {
    setTimeout(this.getUser, 1000);
    sessionStorage.setItem("userID", "1");
  }

  // async addMessage() {
  //   await PubSub.publish('request', { msg: 'Hello to all subscribers!' });
  //   console.log("done")
  // }

  getUser() {
    //   Auth.currentAuthenticatedUser({
    //     bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    //   }).then(user => console.log('user: ' + user))
    //     .catch(err => console.log('error: ' + err));
    // };

    Auth.currentCredentials()
      .then((data) => {
        // console.log("data: " + JSON.stringify(data));
        localStorage.setItem("sessionToken", data["sessionToken"]);
        localStorage.setItem(
          "secretKey",
          data["data"]["Credentials"]["SecretKey"]
        );
        localStorage.setItem(
          "accessKey",
          data["data"]["Credentials"]["AccessKeyId"]
        );
      })
      .catch((err) => console.log("error: " + err));
  }
}
