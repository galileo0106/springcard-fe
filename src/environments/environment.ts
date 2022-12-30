// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  timeout: 7000, // Timeout pour les appels au service
  nfcTemplatesCount: 4, // Nombre max. de templates NFC
  bleTemplatesCount: 1, // Nombre max. de templates BLE
  // googleOAuthUrl: 'http://localhost/backoffice/api/users/googleoauth',
  // googleOAuthUrl: 'http://localhost:8765/api/users/googleoauth',
  googleOAuthUrl: 'http://localhost:8765/auth/google',
  rootServiceUrl: 'http://127.0.0.1:3998/',
  wssUrl: 'ws://127.0.0.1:3997',
  //backendUrl: 'https://backofficedev.springcard.com/api/',
  backendUrl: 'http://localhost:8765/api/',
  firmwaresListUrl: 'https://files.springcard.com/api/sccompanion.php',
}; 
