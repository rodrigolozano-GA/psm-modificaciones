// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {

  production: false,
  WS: "http://172.16.1.35/apis/psm/public/",
  WSDev: "http://127.0.0.1/",
  PublicWS: "http://172.16.1.35/apis/psm/public/",
  LogoImg: "assets/img/grupo-armstrong.png" 

/*
  production: false,
  WS: "./",
  WSDev: "http://127.0.0.1:8000/",
  PublicWS: "./apis/psm/public/",
  LogoImg: "assets/img/grupo-armstrong.png" 
*/

}; 
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
