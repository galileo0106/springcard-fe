import { ITemplatesList } from '@shared/models/Device/ideviceslist.model';

export const TemplatesList: ITemplatesList[] =
[
    {
        "id": "id_only",
        "title": "ID Only Template",
        "description": "<p>A Template-specific Prefix, that is added after the Reader's global Prefix.<\/p>",
        "component": "IdOnlyComponent",
        "isBleTemplate": false,
        "selector": "app-id-only",
        "lkl": [
            {
                "value": "FF",
                "title": "All supported protocols"
            },
            {
                "value": "01",
                "title": "NFC-A - ISO\/IEC 14443 type A"
            },
            {
                "value": "02",
                "title": "NFC-B - ISO\/IEC 14443 type B"
            },
            {
                "value": "03",
                "title": "NFC-A and NFC-B - ISO\/IEC 14443 types A and B"
            },
            {
                "value": "04",
                "title": "NFC-V - ISO\/IEC 15693"
            },
            {
                "value": "07",
                "title": "NFC-A, NFC-B and NFC-V - ISO\/IEC 14443 types A and B and ISO\/IEC 15693"
            },
            {
                "value": "08",
                "title": "NFC-F"
            },
            {
                "value": "0F",
                "title": "All NFC and ISO\/IEC protocols"
            },
            {
                "value": "20",
                "title": "ThinFilm \/ Kovio RF Barcodes"
            },
            {
                "value": "21",
                "title": "Innovision Topaz\/Jewel - NFC T1T"
            },
            {
                "value": "22",
                "title": "ST MicroElectronics ST Family"
            },
            {
                "value": "23",
                "title": "ASK CTS 256B and CTS 512B"
            },
            {
                "value": "24",
                "title": "Inside Secure PicoTag (including HID iClass), protocol B"
            },
            {
                "value": "28",
                "title": "FeliCa"
            },
            {
                "value": "2A",
                "title": "Inside Secure PicoTag (including HID iClass), protocol V"
            },
            {
                "value": "2C",
                "title": "Innovatron Radio Protocol (legacy Calypso cards)"
            }
        ]
    },
    {
        "id": "a_7816_4",
        "title": "7816-4 Template",
        "description": "<p>A Template-specific Prefix, that is added after the Reader's global Prefix.<\/p>",
        "component": "A78164Component",
        "isBleTemplate": false,
        "selector": "app-a-7816-4",
        "lkl": [
            {
                "value": "13",
                "title": "ISO-DEP on NFC-A and NFC-B - ISO\/IEC 14443-4 'T=CL' types A and B"
            },
            {
                "value": "11",
                "title": "ISO-DEP on NFC-A - ISO\/IEC 14443-4 'T=CL' type A"
            },
            {
                "value": "12",
                "title": "ISO-DEP on NFC-B - ISO\/IEC 14443-4 'T=CL' type B"
            },
            {
                "value": "72",
                "title": "Innovatron Radio Protocol (legacy Calypso cards)"
            }
        ]
    },
    {
        "id": "ndef_data",
        "title": "NDEF Data Template",
        "description": "<p>A Template-specific Prefix, that is added after the Reader's global Prefix.<\/p>",
        "component": "NdefDataComponent",
        "isBleTemplate": false,
        "selector": "app-ndef-data",
        "lkl": [
            {
                "value": "4E",
                "title": "All NFC Forum Tags"
            },
            {
                "value": "4F",
                "title": "All NFC Forum Tags and SNEP peers (P2P mode)"
            },
            {
                "value": "41",
                "title": "NFC Forum type 1 Tags (T1T)"
            },
            {
                "value": "42",
                "title": "NFC Forum type 2 Tags (T2T \/ NFC-A)"
            },
            {
                "value": "43",
                "title": "NFC Forum type 3 Tags (T3T \/ NFC-F)"
            },
            {
                "value": "44",
                "title": "NFC Forum type 4 Tags (T4T on NFC-A and NFC-B)"
            },
            {
                "value": "45",
                "title": "NFC Forum type 5 Tags (T5T \/ NFC-V)"
            },
            {
                "value": "4A",
                "title": "NFC Forum type 4A Tags (T4T on NFC-A only)"
            },
            {
                "value": "4B",
                "title": "NFC Forum type 4B Tags (T4T on NFC-B only)"
            },
            {
                "value": "40",
                "title": "SNEP peers (P2P mode)"
            }
        ]
    },
    {
        "id": "desfire_id",
        "title": "Desfire ID Template",
        "description": "<p>A Template-specific Prefix, that is added after the Reader's global Prefix.<\/p>",
        "component": "DesfireIdComponent",
        "isBleTemplate": false,
        "selector": "app-desfire-id",
        "lkl": [
            {
                "value": "70",
                "title": "(Desfire ID)"
            }
        ]
    },
    {
        "id": "desfire_file",
        "title": "Desfire File Template",
        "description": "<p>A Template-specific Prefix, that is added after the Reader's global Prefix.<\/p>",
        "component": "DesfireFileComponent",
        "isBleTemplate": false,
        "selector": "app-desfire-file",
        "lkl": [
            {
                "value": "71",
                "title": "(Desfire File)"
            }
        ]
    },
    {
        "id": "mifare_ultralight",
        "title": "Mifare UltraLight Template",
        "description": "<p>A Template-specific Prefix, that is added after the Reader's global Prefix.<\/p>",
        "component": "MifareUltralightComponent",
        "isBleTemplate": false,
        "selector": "app-mifare-ultralight",
        "lkl": [
            {
                "value": "62",
                "title": "(Mifare UltraLight)"
            }
        ]
    },
    {
        "id": "mifare_classic",
        "title": "Mifare Classic Template",
        "description": "<p>If this register is set, the Reader adds a token to its output to tell the receiver what kind of credential has been read.<\/p>",
        "component": "MifareClassicComponent",
        "isBleTemplate": false,
        "selector": "app-mifare-classic",
        "lkl": [
            {
                "value": "61",
                "title": "(Mifare Classic)"
            }
        ]
    },
    {
        "id": "mifare_plus_sl3",
        "title": "Mifare Plus SL3 Template",
        "description": "<p>A Template-specific Prefix, that is added after the Reader's global Prefix.<\/p>",
        "component": "MifarePlusSl3Component",
        "isBleTemplate": false,
        "selector": "app-mifare-plus-sl3",
        "lkl": [
            {
                "value": "63",
                "title": "(Mifare Plus SL3)"
            }
        ]
    },
    {
        "id": "iso_15693_memory",
        "title": "ISO 15693 Memory Template",
        "description": "<p>A Template-specific Prefix, that is added after the Reader's global Prefix.<\/p>",
        "component": "Iso15693MemoryComponent",
        "isBleTemplate": false,
        "selector": "app-iso-15693-memory",
        "lkl": [
            {
                "value": "54",
                "title": "(ISO 15693 Memory)"
            }
        ]
    },
    {
        "id": "em4134_memory",
        "title": "EM4134 Memory Template",
        "description": "<p>A Template-specific Prefix, that is added after the Reader's global Prefix.<\/p>",
        "component": "Em4134MemoryComponent",
        "isBleTemplate": false,
        "selector": "app-em4134-memory",
        "lkl": [
            {
                "value": "56",
                "title": "(EM4134 Memory)"
            }
        ]
    },
    {
        "id": "springblue",
        "title": "SpringBlue Template",
        "description": "<p>Read a credential from <strong>SpringCard<\/strong>'s SpringBlue mobile app.<\/p>",
        "component": "SpringblueComponent",
        "isBleTemplate": false,
        "selector": "app-springblue",
        "lkl": [
            {
                "value": "B0",
                "title": "(SpringBlue)"
            }
        ]
    },
    {
        "id": "orange_nfc_retail",
        "title": "Orange NFC Retail Template",
        "description": "<p>Read an identifier from the Orange NFC Retail application running on a smartphone.\nOrange NFC APIs for Retail is a framework for NFC services, offered by Mobile Network Operator Orange. It targets loyalty, couponing and alike applications.\nThe services rely on a general-purpose cardlet, loaded into a NFC-enabled smartphone's SIM card. Merchants and service providers are identified by a unique RetailerId (on 4 bytes). Every user \u201cbelonging\u201d to this merchant or service provider is identified by either a unique HolderId (on 20 bytes), assigned by Orange to this very user, a CustomerId, defined freely by the merchant or service provider in association with a customer account, a LoyaltyId, defined freely by the merchant or service provider in association with a loyalty card or coupons.<\/p>",
        "component": "OrangeNfcRetailComponent",
        "isBleTemplate": false,
        "selector": "app-orange-nfc-retail",
        "lkl": [
            {
                "value": "C0",
                "title": "(Orange NFC Retail)"
            }
        ]
    },
    {
        "id": "orange_nfc_office",
        "title": "Orange NFC Office Template",
        "description": "<p>Read an identifier from the Orange NFC Office application running on a smartphone.\nUse this template to read an identifier from the Orange NFC Office application running on a smartphone.\nOrange NFC APIs for Office is a framework for NFC services, offered by Mobile Network Operator Orange. It targets user identification applications (access control, private e-purse, car park &amp; card sharing, and alikes). The services are provided by the smartphone either in host-based card emulation mode (HCE) or through a SIM card. Organisations are identified by an ApplicationId (variable length) and their organisation units by a ZoneId (on 6 bytes). A diversified AES key protects the data. Every user \u201cbelonging\u201d to the organisation is identified by a Badge number on 10 bytes.<\/p>",
        "component": "OrangeNfcOfficeComponent",
        "isBleTemplate": false,
        "selector": "app-orange-nfc-office",
        "lkl": [
            {
                "value": "C1",
                "title": "(Orange NFC Office)"
            }
        ]
    },
    {
        "id": "apple_vas",
        "title": "Apple VAS Template",
        "description": "<p>A Template-specific Prefix, that is added after the Reader's global Prefix.<\/p>",
        "component": "AppleVasComponent",
        "isBleTemplate": false,
        "selector": "app-apple-vas",
        "lkl": [
            {
                "value": "D1",
                "title": "(Apple VAS)"
            }
        ]
    },
    {
        "id": "google_smarttap",
        "title": "Google SmartTap Template",
        "description": "",
        "component": "GoogleSmarttapComponent",
        "isBleTemplate": false,
        "selector": "app-google-smarttap",
        "lkl": [
            {
                "value": "D2",
                "title": "(Google SmartTap)"
            }
        ]
    },
    {
        "id": "pan",
        "title": "PAN Template",
        "description": "<p>Read a 16-digit PAN<\/p>",
        "component": "PanComponent",
        "isBleTemplate": false,
        "selector": "app-pan",
        "lkl": [
            {
                "value": "73",
                "title": "(PAN)"
            }
        ]
    }
];
