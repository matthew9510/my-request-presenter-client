import "hammerjs";
import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import Amplify from "aws-amplify";

Amplify.configure({
  aws_project_region: environment.aws_project_region,
  aws_cognito_region: environment.aws_cognito_region,
  aws_user_pools_id: environment.aws_user_pools_id,
  aws_user_pools_web_client_id: environment.aws_user_pools_web_client_id,
  identityPoolId: environment.cognitoIdentityId,
});

import { AppModule } from "./app/app.module";
import { environment } from "./environments/environment";

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
