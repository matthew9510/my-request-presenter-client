import { Component, Inject } from '@angular/core';
import Amplify, { PubSub, Auth } from 'aws-amplify';
import { AWSIoTProvider } from '@aws-amplify/pubsub/lib/Providers';

Amplify.configure({
  Auth: {
    identityPoolId: "us-west-2:68ff65f5-9fd0-42c9-80e1-325e03d9c1e9",
    region: "us-west-2",
    userPoolId: "us-west-2_cyimjlwtU",
    userPoolWebClientId: "2vah6r61ekscqp62f0oari1spr"
  }
})

// Amplify.addPluggable(new AWSIoTProvider({
//   aws_pubsub_region: 'us-west-2',
//   aws_pubsub_endpoint: 'wss://apf6hmlwvx9ez-ats.iot.us-west-2.amazonaws.com/mqtt',
// }));

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'My Request Requester';

  // constructor() {
  //   Amplify.PubSub.subscribe('request-app').subscribe({
  //     next: data => console.log('Message received', data),
  //     error: error => console.error(error),
  //     close: () => console.log('Done'),
  //   });
  // }

  ngOnInit() {
    setTimeout(this.getUser, 1000);
  }

  getUser() {
    //   Auth.currentAuthenticatedUser({
    //     bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    //   }).then(user => console.log('user: ' + user))
    //     .catch(err => console.log('error: ' + err));
    // };

    Auth.currentCredentials()
      .then((data) => {
        // console.log("data: " + data['sessionToken']);
        localStorage.setItem('sessionToken', data['sessionToken']);
      })
      .catch(err => console.log("error: " + err))
  }

}
