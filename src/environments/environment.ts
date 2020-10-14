// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  frontendUrl: "https://dev.app.myrequest.live",
  eventsUrl:
    "https://e37h0xjzll.execute-api.us-west-2.amazonaws.com/dev/events",
  requestsUrl:
    "https://05wqrtg3r2.execute-api.us-west-2.amazonaws.com/dev/requests",
  requesterUrl:
    "https://1jeeiew5x4.execute-api.us-west-2.amazonaws.com/dev/requester",
  venuesUrl:
    "https://nuklbutl58.execute-api.us-west-2.amazonaws.com/dev/venues",
  performersUrl:
    "https://l4v3n2x6re.execute-api.us-west-2.amazonaws.com/dev/performers",
  stripeUrl:
    "https://tqy8ckgk2j.execute-api.us-west-2.amazonaws.com/dev/stripe",
  stripePublicKey: "pk_test_HYO7aDhiUc3b2uVbgPSQVAsO",
  aws_project_region: "us-west-2",
  aws_cognito_region: "us-west-2",
  aws_user_pools_id: "us-west-2_7vXlPMZyi",
  aws_user_pools_web_client_id: "22u2dgqtn0010o5lceheeglsg1",
  cognitoIdentityId: "us-west-2:97d3391d-18c4-40ec-9b8e-aede305849f9",
  cognitoIdentityIdPrefix: "aws.cognito.identity-id.",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
