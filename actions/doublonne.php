<?php
/**
 * Remet en place les doublons dans les traductions ...
 *
 * Attention à supprimer les "espaces de nom"
 *
 * @author : Hervé Thouzard <herve.t@springcard.com>
 * @date : 2021-01-14
 */

// ******************************
// * NE PLUS UTILISER CE SCRIPT *
// ******************************

exit("NE PLUS UTILISER");

$xmlDocFr = null;
$xmlFr = file_get_contents('src/locales/messages.fr.xlf');
if ($xmlFr === false) {
    exit("Erreur, impossible de lire le contenu du fichier français.");
}

try {
    $xmlDocFr = new \SimpleXMLElement($xmlFr);
} catch (\Exception $e) {
    $this->errors[] = $e->getMessage();
    $this->_isValid = false;
    echo "Erreur durant la lecture du fichier xml\n";
    print_r($e->getMessage());
}

// ****************************
// * 1) analyse du fichier Fr *
// ****************************
echo "Analyse du fichier en français\n";
$frenchTranslations = $xmlDocFr->file->body->children();
// Clé = trans-unit id, Valeur = la traduction
$frenchTransUnits = [];
// Clé = source, valeur = traduction
$french = [];
foreach ($frenchTranslations as $transUnit) {
    if (isset($transUnit->source)) {
        $source = (string) $transUnit->source;
        $target = (string) $transUnit->target;
        if ($target !== $source) {
            $french[$source] = $target;
        }
        $id = (string) $transUnit['id'];
        $frenchTransUnits[$id] = $source;
    }
}
//print_r($frenchTransUnits);

// ****************************
// * 2) analyse du fichier En *
// ****************************
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

echo "Analyse du fichier en anglais\n";
$xmlDocEn = null;
$xmlEn = file_get_contents('src/locales/messages.xlf');
if ($xmlEn === false) {
    exit("Erreur, impossible de lire le contenu du fichier anglais.");
}

try {
    $xmlDocEn = new \SimpleXMLElement($xmlEn);
} catch (\Exception $e) {
    $this->errors[] = $e->getMessage();
    $this->_isValid = false;
    echo "Erreur durant la lecture du fichier xml\n";
    print_r($e->getMessage());
}
$transUnitNotFoundCount = 0;
$englishTranslations = $xmlDocEn->file->body->children();
foreach ($englishTranslations as $englishTransUnit) {
    $id = (string) $englishTransUnit['id'];
    $source = (string) $englishTransUnit->source;
    if (!array_key_exists($id, $frenchTransUnits)) {
        echo "Trans-unit introuvable: $id\n";
        if (!in_array($source, $frenchTransUnits)) {
            echo "Cette transunit n'existe pas du tout, source: $source\n";
            //$englishTransUnit->addChild('target', 'TRANSLATEME'.time());
            $englishTransUnit->addChild('target', '');
            //$xmlDocFr->file->body->addChild('trans-unit', $englishTransUnit);   // $frenchTranslations
            append_simplexml($frenchTranslations, $englishTransUnit);   // $xmlDocFr    To, From
            $transUnitNotFoundCount++;
        } else {
            if (array_key_exists($source, $french)) {
                echo "La transunit a été trouvée par son texte\n";
                $englishTransUnit->addChild('target', $french[$source]);
                append_simplexml($frenchTranslations, $englishTransUnit);   // $xmlDocFr    To, From
            }

            // @todo, trouver la bonne traduction française
            //$englishTransUnit->addChild('target', $frenchTransUnits[$frenchTransUnitId]);
            //append_simplexml($frenchTranslations, $englishTransUnit);   // $xmlDocFr    To, From
        }
    }
}
echo "Nombre de transunit non trouvées : $transUnitNotFoundCount\n";
$xmlDocFr->saveXML('src/locales/messages.fr.xlf');

