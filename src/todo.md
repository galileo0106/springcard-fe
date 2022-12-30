# TODO

* Traduire les textes des templates
* Créer une favicon animée pour indiquer la progression du flash : https://twitter.com/mgechev/status/1420240151087927297
* Créer un service qui enregistre les différentes erreurs (page + messages d'erreur) et qui permet d'en retrouver la liste sur la page de support.
* Utiliser ce composant pour les adresses IP : https://github.com/JsDaddy/ngx-mask
* Modifier le fichier D:\Dev\sccompanion\angular\tsconfig.json pour ajouter la ligne suivante dans "angularCompilerOptions": {
    "strictTemplates": true
* Quand on a une erreur réseau, proposer de contacter le support avec les informations de la requête
* Ajouter les templates (Apple VAS par exemple) qui manquent
* Mettre en place un attribut important dans les fichiers xml pour forcer l'utilisateur à modifier certains champs dans les écrans de configuration
* Ajouter un écran permettant d'avoir toutes les informations sur un lecteur (object Device + Firmware info (https://docs.springcard.com/books/Companion/REST_API/Utilities/Routes/Firmware_info))
  + Read the device-specific part of the configuration (https://docs.springcard.com/books/Companion/REST_API/Devices/Routes/Configuration/Config_Specific_(Get))
  + Get device data https://docs.springcard.com/books/Companion/REST_API/Devices/Routes/Device
  + Restore device's factory defaults (https://docs.springcard.com/books/Companion/REST_API/Devices/Routes/Configuration/Config_(Delete))
* Passer tous les modules en lazy loading => Ça  ne marche pas si les composants utilisent des services partagés (putain de bordel de merde)
* Bouton présent sur les formulaires de configuration et indiquant le statut du formulaire
   * En cas d'erreur :

<button class="mine" mat-fab [color]="statusColor" [matTooltip]="statusTooltip">
  <mat-icon>{{statusIcon}}</mat-icon>
</button>

* Individuals :
  * Champ password, double saisie + type password
* \n\t
* Passer à NgRx
* Quand l'utilisateur upload un firmware depuis son disque, renseigner les informations en provenance de la route précédente dans la table firmwares_used, ajouter les metas retournées.
* Quand un champ (c'est surtout vrai pour les champs en hexa) a une longueur maxi et/ou mini, ajouter l'info au label
* Déplacer tous les messages d'attente dans un composant (voir comment c'est fait dans la formation sur Angular (via un service et un composant))
* Dans les formulaires de configuration ajouter une recherche, comme dans les préférences de Chrome (pour chercher une option de configuration)
* Recopier les données de src\environments\environment.ts vers src\environments\environment.prod.ts
* Mettre en place dans les subscribe des observables :
    this.firmwaresService.getFirmwaresList(product)
      .pipe(
        finalize(() => this.isDownloadingFirmwareList = false)
      )
      .subscribe({
* Dans les écoutes de la WS, au premier traitement du contenu, vérifier qu'on a bien le texte "jsonrpc" dans la réponse, sinon ce n'est pas la peine de chercher à parser
* Dans les MatDialog, mettre en place les afterClosed() :
  editCourse(course: Course) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';

    dialogConfig.data = course;
    const dialogRef = this.dialog.open(CourseDialogComponent, dialogConfig);

    dialogRef.afterClosed()
      .pipe(
        filter(val => !!val),
        tap(() => this.coursesChanged.emit())

      ).subscribe();
  }
* Mettre en place des Partials et utiliser les backticks pour les routes, et mettre en place les shareReplay() sur les puts :
    saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
        return this.http.put(`/api/courses/${courseId}`, changes)
            .pipe(
                shareReplay()
            );
    }
* Dans les boîtes de dialogue, voir les options suivantes :
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';

    dialogConfig.data = course;
    const dialogRef = this.dialog.open(CourseDialogComponent, dialogConfig);
* Utiliser des Query progress bar : https://material.angular.io/components/progress-bar/overview
  `<mat-progress-bar mode="query"></mat-progress-bar>`
* Passer cette classe CSS en global et la supprimer des composants locaux :
    .full-width {
      width: 100%;
      display: block;
    }
* Pour les références des produits, voir https://docs.google.com/spreadsheets/d/12ieTko3znBjlR-k0LMooLmo-7V59jQvZcW16_493-Sw/edit#gid=0
* Dans TemplatesComponent trouver la source de ce message d'erreur :
ERROR Error: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked. Previous value for 'mat-form-field-should-float': 'false'. Current value: 'true'.
    at throwErrorIfNoChangesMode (core.js:8096)
    at bindingUpdated (core.js:19852)
    at checkStylingProperty (core.js:23434)
    at ɵɵclassProp (core.js:23334)
    at MatFormField_HostBindings (form-field.js:1124)
    at setHostBindingsByExecutingExpandoInstructions (core.js:11535)
    at refreshView (core.js:11904)
    at refreshComponent (core.js:13295)
    at refreshChildComponents (core.js:11586)
    at refreshView (core.js:11909)
Ca pourrait venir de setFocusToFirstFieldWithError() à vérifier
* Voir dans quelle mesure un Service Worker pourrait être utile (par exemple pour être notifié lorsqu'on met une configuration à disposition d'un client), voir https://angular.io/guide/service-worker-getting-started
  ou quand on change de plan.
* Dans les templates html des templates, remplacer les appels à fieldValue() par `getFieldValue(this.configurationForm, fieldName);`
* On doit afficher les templats BLE ssi le bit 0 du registre 02C2 === 1 (voir https://docs.springcard.com/books/SpringCore/Non-volatile_memory/Configuration/Main_configuration/BLE_options)
* Dans la classe Device (du fichier D:\Dev\sccompanion\angular\src\app\modules\shared\classes\Device.ts), dégager le tableau `private devicesList: IDeviceList[] = DevicesList;` et le passer sous la forme d'une classe instanciée dans le DetectionService et passée à chaque `const deviceObject = new Device(device);`
* Dans le XML d'un produit, inclure un lien vers la fiche du produit sur notre site internet
* Trouver "quelque chose" qui affiche la liste de toutes les erreurs sur le formulaire de saisie d'une configuration
* Obtenir la liste de toutes les erreurs d'un formulaire pour les afficher
* Trouver un meilleur debug que console.log :
    * https://github.com/sindresorhus/electron-debug
    * https://github.com/sindresorhus/electron-timber
    * https://www.npmjs.com/package/debug
    * https://github.com/avwo/whistle
* Sauvegarde des préférences de l'application :
    https://github.com/sindresorhus/electron-store


```typescript
interface User {
  type: 'authenticated' | 'anonymous';
  name: string;
}

interface AuthenticatedUser extends User {
  type: 'authenticated';
  loggedSince: number;
}

interface AnonymousUser extends User {
  type: 'anonymous';
  visitingSince: number;
}

function onWebsiteSince(user: User): number {
  if (user.type === 'authenticated') { // this is a LoggedUser
    return (user as AuthenticatedUser).loggedSince;
  } else if (user.type === 'anonymous') { // this is an AnonymousUser
    return (user as AnonymousUser).visitingSince;
  }
  // TS still doesn't know every possibility was covered so we have to return something here
  return 0;
}


interface BaseUser {
  name: string;
}

interface AuthenticatedUser extends BaseUser {
  type: 'authenticated';
  loggedSince: number;
}

interface AnonymousUser extends BaseUser {
  type: 'anonymous';
  visitingSince: number;
}

type User = AuthenticatedUser | AnonymousUser;

function onWebsiteSince(user: User): number {
  if (user.type === 'authenticated') { // this is inferred as a LoggedUser
    return user.loggedSince;
  } else { // this is narrowed as an AnonymousUser without even testing the type!
    return user.visitingSince;
  }
// no need to return a default value as TS knows that we covered every possibility!
}
```
