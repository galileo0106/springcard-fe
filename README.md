# Springcard Companion, version web

Ce projet a été généré avec [Angular CLI](https://github.com/angular/angular-cli) version 1.6.6.

## Prérequis

Pour lancer l'application en mode développement ou en mode production il faut :

- Node.js (version >= 9.* de préférence) : https://nodejs.org/en/

- Installer Angular Cli en tapant, depuis une ligne de commande :

  - `npm install -g @angular/cli`

- Si le répertoire node_modules n'est pas présent, il faut taper, toujours depuis la ligne de commande :

  - `npm install`

## Lancement en mode développement

Pour lancer l'application  :

?    `npm run start:fr`

Angular va alors ouvrir le navigateur avec l'url suivante :  `http://localhost:4200/`

Pour ouvrir l'application sur un autre port, ajouter l'option suivante à la ligne de commande :

?    `--port=1234`

Une fois l'application lancée dans un navigateur, il est recommandé d'ouvrir les outils de développeurs afin de consulter le contenu de la console (`Ctrl + Shit + I` dans Google Chrome)

## Génération du code de production

Il faut taper, depuis la ligne de commande :

`prod.bat`

Le batch se charge de mettre à jour la version de l'application.

## Simulateur de la WebSocket

Le répertoire racine de celui-ci contient un dossier "simulateurws", il contient un script réalisé avec NodeJs qui permet de simuler les évènements générés par la Webscoket. Pour le lancer il faut taper, depuis la ligne de commande :

`node index.js`

## Extraction des chaînes de caractère à traduire

Depuis une invite de commande, taper :

`traductions.bat`

## Fusionner les tradcutions anglaises avec celles provenant de poeditor (**ne plus utiliser**)

Depuis une invite de commande, taper :

`php createfrenchtranslations.php`
