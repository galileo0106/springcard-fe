<?php
/**
 * Retraite le fichier source des traductions (l'anglais) pour :
 *
 * 1)
 *      a. Détecter les chaînes totalement identiques ainsi que les chaîne qui pourraient être identiques via un trim()
 *      b. Dédoubler les chaînes identiques (entre le html et les fichiers .ts)
 * 2) modifier les identifiants de traductions (trans-unit), en leur ajoutant `_multiconf_`,
 * `_templates_` ou tout autre texte présent dans une balise <note>
 *
 * @author : Hervé Thouzard <herve.t@springcard.com>
 * @date : 2020-12-22
 */

// ******************************
// * NE PLUS UTILISER CE SCRIPT *
// ******************************

exit("NE PLUS UTILISER");

$xmlDoc = null;
$xml = file_get_contents('src/locales/messages.xlf');
if ($xml === false) {
    exit("Erreur, impossible de lire le contenu du fichier xlif");
}

try {
    $xmlDoc = new \SimpleXMLElement($xml);
} catch (\Exception $e) {
    $this->errors[] = $e->getMessage();
    $this->_isValid = false;
    echo "Erreur durant la lecture du fichier xml\n";
    print_r($e->getMessage());
}

// *****************************
// * 1) Détection des doublons *
// *****************************
echo "Lecture pour analyse du fichier xml anglais\n";
$traductions = $xmlDoc->file->body->children();
$transUnits = [];
foreach ($traductions as $transUnit) {
    if (isset($transUnit->source)) {
        $source = (string) $transUnit->source;
        $id = (string) $transUnit['id'];
        $transUnits[$id] = $source;
    }
}
$transUnitsCount = count($transUnits);
echo "Nombre de transUnit : $transUnitsCount\n";

echo "Recherche de correspondances exactes\n";
$identical = 0;
$doubles = [];
foreach ($transUnits as $key1 => $traduction) {
    $key1 = trim($key1);
    //$traduction = trim($traduction);
    foreach ($transUnits as $key2 => $traduction2) {
        $key2 = trim($key2);
        //$traduction2 = trim($traduction2);
        if ($key1 === $key2) {
            continue;
        }

        /*if (trim(strtolower($traduction)) === trim(strtolower($traduction2))) {
            echo "/!\ :Xx: === :xx: : $key1 - $key2 : $traduction\n";
        }*/

        if ($traduction !== $traduction2 && trim($traduction) === trim($traduction2)) {
            echo "/!\ : xx : === :xx: : $key1 - $key2 : $traduction\n";
        }
        if ($traduction === $traduction2) {
            if (!in_array($key1 . '|' . $key2, $doubles) && !in_array($key2 . '|' . $key1, $doubles)) {
                $doubles[] = $key1 . '|' . $key2;
            }
        }
    }
}

$identical = count($doubles);
echo "Nombre de chaînes identiques : $identical\n";

foreach ($doubles as $key) {
    list($key1, $key2) = explode('|', $key);
    list($node1) = $xmlDoc->xpath("//*[@id='$key1']");
    if (!$node1) {
        continue;
    }
    list($node2) = $xmlDoc->xpath("//*[@id='$key2']");
    if (!$node2) {
        continue;
    }
    echo "Suppression de $key2\n";
    // Récupération de la note de la deuxième node si elle en a une et que la première node n'en a pas
    if (!isset($node1->note) && isset($node2->note)) {
        $noteNode2 = (string) $node2->note;
        echo "Ajout d'une note au doublon: $noteNode2\n";
        $note = $node1->addChild('note', $noteNode2);
        $note->addAttribute('priority', '1');
        $note->addAttribute('from', 'description');
    }

    // Récupération des noms des fichiers et des numéros de ligne
    foreach ($node2->{'context-group'} as $contextGroup) {
        echo "Ajout d'une contextGroup\n";
        $newContextGroup = $node1->addChild('context-group');
        $newContextGroup->addAttribute('purpose', 'location');
        foreach ($contextGroup->context as $context) {
            $nodeContent = (string) $context;
            $newContext = $newContextGroup->addChild('context', $nodeContent);
            $newContext->addAttribute('context-type', (string) $context['context-type']);
        }
    }
    unset($node2[0]);
}


// *******************************
// * 2) Ajout de l'espace de nom *
// *******************************

$cpt = 0;
$traductions = $xmlDoc->file->body->children();
foreach ($traductions as $transUnit) {
    if (isset($transUnit->note)) {
        $note = (string) $transUnit->note;
        $newId = $transUnit['id'] . trim($note);
        $transUnit['id'] = $newId;
        $cpt++;
    }
}
unlink('src/locales/messages.xlf');
$xmlDoc->saveXML('src/locales/messages.xlf');
echo "Terminé, nombre de modifications effectuée : ".$cpt."\n";
