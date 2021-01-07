import "hammerjs";
import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { AppModule } from "./app/app.module";
import { environment } from "./environments/environment";
import Amplify from "aws-amplify";
import { AWSIoTProvider } from "@aws-amplify/pubsub";

if (environment.production) {
  enableProdMode();
}

Amplify.configure({
  aws_project_region: environment.aws_project_region,
  aws_cognito_region: environment.aws_cognito_region,
  aws_user_pools_id: environment.aws_user_pools_id,
  aws_user_pools_web_client_id: environment.aws_user_pools_web_client_id,
  identityPoolId: environment.cognitoIdentityId,
});

// pub sub configuration
// Apply plugin with configuration
Amplify.addPluggable(
  new AWSIoTProvider({
    aws_pubsub_region: "us-west-2",
    aws_pubsub_endpoint:
      "wss://a2983euzfbsfbz-ats.iot.us-west-2.amazonaws.com/mqtt",
  })
);

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
