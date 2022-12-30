<?php
/**
 * Interroge le back office de SC Companion pour obtenir une liste de la dernière version du firmware de chaque produit.
 * Le résultat de la demande auprès du back office est enregistré dans un fichier JSON qui est ensuite utilisé (intégré) dans le projet Angular
 */
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// La route à utiliser pour obtenir le fichier .json
//if (trim(getenv("PHP_ENV")) != '') {    //	On est en local (machine Hervé)
    //$url = 'http://sccompanion/internal/firmwares/products';
//} else {
    $url = 'https://backoffice.springcard.com/internal/firmwares/products';
//}

// Paramètres pour l'authentification sur la  route
$username = 'internal';
$password = 'v9mhwfXpxS23e8UpcM36SAngsrnBkyu8';

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPGET, true);
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type:application/json', 'Accept: application/json']);
curl_setopt($ch, CURLOPT_USERPWD, $username . ":" . $password);
$result = curl_exec($ch);
curl_close($ch);
file_put_contents('./src/assets/firmwares.json', $result);
