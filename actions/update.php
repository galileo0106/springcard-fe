<?php
/**
 * Mise à jour de la date de compilation dans le fichier package.json.
 * Le script met aussi à jour le fichier \src\app\modules\shared\services\current-title.service.ts avec le numéro de version contenu dans le package.json
 * Utilisé, de préférence, avant le déploiement de l'application
 */

 // *****************************************
 // * Mise à jour de la date de compilation *
 // *****************************************
$packagejon = file_get_contents('package.json');
file_put_contents('package_backup.json', $packagejon);
if ($packagejon === false) {
    exit("Erreur durant la lecture du fichier package.json");
}
$package = json_decode($packagejon);
$version = (string) $package->version;
$pos = strrpos($version, '.') + 1;
$minor_version = strval(((int)substr($version, $pos)) + 1);
$new_version = substr_replace($version, $minor_version, $pos);

print_r($new_version);

$package->compilationDate = date('Ymd.His');
$package->version = $new_version;
file_put_contents('package.json', json_encode($package, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));


// *******************************************************
// * Mise à jour statique de la version de l'application *
// *******************************************************
$currentTitleServiceFileName = 'src/app/modules/shared/services/current-title.service.ts';
$currentTitleServiceFile = file_get_contents($currentTitleServiceFileName);
if ($currentTitleServiceFile === false) {
    echo "\n\tErreur, impossible de lire le contenu du fichier $currentTitleServiceFileName\n";
    exit;
}
$pattern = 'public appVersion';
$lines = explode("\n", $currentTitleServiceFile);
$output = [];
foreach ($lines as $line) {
    if (substr(trim($line), 0, strlen($pattern))=== $pattern) {
        $startingPos = strpos($line, "'");
        $endingPos = strrpos($line, "'");
        if ($startingPos === false || $endingPos === false) {
            exit("Erreur, impossible de trouver la position de départ ou de fin du motif de vesion");
        }
        $line = substr($line, 0, ($startingPos + 1)) . $new_version . substr($line, $endingPos);
    }
    $output[] = $line;
}

file_put_contents($currentTitleServiceFileName, implode("\n", $output));
