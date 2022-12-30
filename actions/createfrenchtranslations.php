<?php
/**
 * Recrée un fichier correct des traductions en français
 * Script à lancer 1 seule fois, dès qu'on en a terminé avec poeditor.com
 *
 * @author : Hervé Thouzard <herve.t@springcard.com>
 * @date : 2021-01-28
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
    $domcat  = $domdict->ownerDocument->importNode($domcat, TRUE);
    // Append the <cat> to <c> in the dictionary
    $domdict->appendChild($domcat);
}
exit("NE PLUS UTILISER");

$xmlModel = getParsedXmlFromFile('src/locales/modele.xlf');
$xmlDocFr = getParsedXmlFromFile('src/locales/Companion_web_French.xlf');
$xmlDocEn = getParsedXmlFromFile('src/locales/messages.xlf');

//$modelChildren = $xmlModel->file->body->children();
$modelChildren = $xmlModel->file->body;

// ****************************
// * 1) analyse du fichier Fr *
// ****************************
echo "Analyse du fichier en français\n";
$frenchNodesTranslations = $xmlDocFr->file->body->children();

// Clé = trans-unit id, Valeur = la traduction
$frenchTransUnitIdTarget = [];
// Clé = target, valeur = traduction
$frenchSourceTarget = [];
foreach ($frenchNodesTranslations as $transUnit) {
    if (isset($transUnit->source)) {
        $source = (string) $transUnit->source;
        $target = (string) $transUnit->target;
        $transUnitId = (string) $transUnit['id'];
        if (!is_null($target)) {    //  && $target !== $source
            $frenchTransUnitIdTarget[$transUnitId] = $target;
            $frenchSourceTarget[$source] = $target;
        }
    }
}

// ****************************
// * 2) analyse du fichier En *
// ****************************
echo "Analyse du fichier en anglais\n";
$transUnitToTranslateCount = 0;
$englishTransUnits = $xmlDocEn->file->body->children();
foreach ($englishTransUnits as $englishTransUnit) {
    $englishTransUnitId = (string) $englishTransUnit['id'];
    $source = (string) $englishTransUnit->source;

    if (array_key_exists($englishTransUnitId, $frenchTransUnitIdTarget)) {
        $englishTransUnit->addChild('target', $frenchTransUnitIdTarget[$englishTransUnitId]);
    } elseif (array_key_exists($source, $frenchSourceTarget)) {
        $englishTransUnit->addChild('target', $frenchSourceTarget[$source]);
    } else {    // Trad introuvable, on l'ajoute "à blanc"
        $englishTransUnit->addChild('target', '');
        $transUnitToTranslateCount++;
        echo "Trans-unit à traduire: $englishTransUnitId\n";
    }
    append_simplexml($modelChildren, $englishTransUnit);   // To, From
}

$xmlModel->saveXML('src/locales/messages.fr.xlf');
echo "Nombre de trans-unit à traduire : $transUnitToTranslateCount\n";
echo "Terminé\n";

