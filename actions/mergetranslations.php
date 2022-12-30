<?php

/**
 * Ajoute, au fichier français des traductions, les traductions anglaises qui lui manque.
 * Script à lancer à chaque fois qu'il y a une modification dans les traductions.
 *
 * @author : Hervé Thouzard <herve.t@springcard.com>
 * @date : 2021-02-08
 */
function getParsedXmlFromFile($filename)
{
    $xmlContent = null;
    $xmlContent = file_get_contents($filename);
    if ($xmlContent === false) {
        exit("Erreur, impossible de lire le contenu du fichier $filename\n");
    }

    try {
        $xmlModel = new \SimpleXMLElement($xmlContent);
    } catch (\Exception $e) {
        echo "Erreur durant le parsing du fichier $filename\n";
        print_r($e->getMessage());
        exit();
    }
    return $xmlModel;
}

function append_simplexml(&$simplexml_to, &$simplexml_from)
{
    // Create new DOMElements from the two SimpleXMLElements
    $domdict = dom_import_simplexml($simplexml_to);
    $domcat  = dom_import_simplexml($simplexml_from);

    // Import the <cat> into the dictionary document
    $domcat  = $domdict->ownerDocument->importNode($domcat, true);
    // Append the <cat> to <c> in the dictionary
    $domdict->appendChild($domcat);
}

define('FRENCH_TRANSLATION_FILE', '../src/locales/messages.fr.xlf');

$xmlDocFr = getParsedXmlFromFile(FRENCH_TRANSLATION_FILE);
$xmlDocEn = getParsedXmlFromFile('../src/locales/messages.xlf');


// ****************************
// * 1) analyse du fichier Fr *
// ****************************
echo "Analyse du fichier en français\n";
$frenchNodesTranslations = $xmlDocFr->file->body->children();
$frenchNodes = $xmlDocFr->file->body;

// Clé = trans-unit id, Valeur = trans-unit id
$frenchTransUnits = [];
foreach ($frenchNodesTranslations as $transUnit) {
    $transUnitId = (string) $transUnit['id'];
    $frenchTransUnits[$transUnitId] = $transUnitId;
}

// ****************************
// * 2) analyse du fichier En *
// ****************************
echo "Analyse du fichier en anglais\n";
$transUnitToTranslateCount = 0;
$englishTransUnits = $xmlDocEn->file->body->children();
// Clé = trans-unit id, Valeur = trans-unit id
$englishTransUnitsIds = [];
foreach ($englishTransUnits as $englishTransUnit) {
    $englishTransUnitId = (string) $englishTransUnit['id'];
    $englishTransUnitsIds[$englishTransUnitId] = $englishTransUnitId;
    $source = (string) $englishTransUnit->source;

    if (!in_array($englishTransUnitId, $frenchTransUnits)) {
        echo "Trans-unit ajoutée au fichier français : $englishTransUnitId\n";
        $englishTransUnit->addChild('target', '');
        $transUnitToTranslateCount++;
        append_simplexml($frenchNodes, $englishTransUnit);   // To, From
    }
}

// ********************************
// * 3) Ménage dans le fichier fr *
// ********************************
$frenchTransUnitRemovedCount = 0;
foreach ($frenchTransUnits as $frenchTransUnitId) {
    if (!in_array($frenchTransUnitId, $englishTransUnitsIds)) {
        list($element) = $frenchNodes->xpath("//*[@id='$frenchTransUnitId']"); // xpath('/*/trans-unit[@id=""]');
        if ($element) {
            $frenchTransUnitRemovedCount++;
            echo "Suppression de la node $frenchTransUnitId\n";
            unset($element[0]);
        }
    }
}

// *********************************
// * 4 Infos + sauvegarde + backup *
// *********************************
echo "Nombre de trans-unit ajoutées (à traduire) : $transUnitToTranslateCount\n";
if ($transUnitToTranslateCount > 0 || $frenchTransUnitRemovedCount > 0) {
    $newName = str_replace('.fr', '.fr.' . date('Y-m-d-his'), FRENCH_TRANSLATION_FILE);
    rename(FRENCH_TRANSLATION_FILE, $newName);
    echo "Le fichier " . FRENCH_TRANSLATION_FILE . " a été renommé en " . $newName . "\n";
    $xmlDocFr->saveXML(FRENCH_TRANSLATION_FILE);
    //echo "Ne pas oublier de renommer src/locales/messages.fr2.xlf en src/locales/messages.fr.xlf";
}

echo "Terminé\n";
