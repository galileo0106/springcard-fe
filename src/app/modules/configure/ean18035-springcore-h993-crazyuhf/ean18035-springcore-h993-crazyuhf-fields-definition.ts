/**
 * La définition de chacun des champs qui permettent de composer les valeurs des registres
 */
export const Ean18035SpringcoreH993Crazyuhf_FieldsDefinition = {

"reg02c0_m6awtjl": {
  fieldType: "hidden",
  register: "02C0",
  initialValue: "0",
  bitmap: "80",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},

"reg02c0_eph722y": {
  fieldType: "hidden",
  register: "02C0",
  initialValue: "0",
  bitmap: "08",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},
// Primary profile
"reg02c0_kspmojd": {
  fieldType: "buttons",
  register: "02C0",
  initialValue: "0",
  bitmap: "07",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},
// Disable USB
"reg02c1_m6awtjl": {
  fieldType: "radios",
  register: "02C1",
  initialValue: "0",
  bitmap: "80",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},
// Disable serial number
"reg02c1_5ymphln_op23zml": {
  fieldType: "radios",
  register: "02C1",
  initialValue: "0",
  bitmap: "40",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},
// On USB bus reset event, does the product fully reset?
"reg02c1_5ymphln_ax7h6sl": {
  fieldType: "radios",
  register: "02C1",
  initialValue: "0",
  bitmap: "20",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},
// On USB bus resume event, does the product fully reset?
"reg02c1_5ymphln_t6r55rl": {
  fieldType: "radios",
  register: "02C1",
  initialValue: "0",
  bitmap: "10",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},
// Disable SpringCore direct as secondary USB interface.
"reg02c1_5ymphln_eph722y": {
  fieldType: "radios",
  register: "02C1",
  initialValue: "0",
  bitmap: "08",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},
// Behaviour of the product when USB VBUS is lost and the product is not allowed to keep running
"reg02c1_gcbfcky_riuquxn": {
  fieldType: "radios",
  register: "02C1",
  initialValue: "0",
  bitmap: "04",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},
// Behaviour of the product when USB VBUS is lost
"reg02c1_5ymphln_khxezgy": {
  fieldType: "radios",
  register: "02C1",
  initialValue: "0",
  bitmap: "03",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},

"reg02c4_snvp4xd": {
  fieldType: "hidden",
  register: "02C4",
  initialValue: "0",
  bitmap: "FE",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},
// Enable HID Ringer addon used by Telephony services (experimental).
"reg02c4_s27wvjn_ooba6wy": {
  fieldType: "radios",
  register: "02C4",
  initialValue: "0",
  bitmap: "01",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},
// Trace level
"reg02cd": {
  fieldType: "hex",
  register: "02CD",
  initialValue: "00000000",
  bitmap: "FFFFFFFF",
  isIndividual: false,
  registerDefaultValue: "00000000", registerSize: 4,},

"reg02ce_fe5kedn_kxpbr2l": {
  fieldType: "hidden",
  register: "02CE",
  initialValue: "0",
  bitmap: "C0",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},
// Use Syslog
"reg02ce_fe5kedn_ax7h6sl": {
  fieldType: "radios",
  register: "02CE",
  initialValue: "0",
  bitmap: "20",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},
// Show uptime
"reg02ce_fe5kedn_t6r55rl": {
  fieldType: "radios",
  register: "02CE",
  initialValue: "0",
  bitmap: "10",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},

"reg02ce_fe5kedn_l365cmn": {
  fieldType: "hidden",
  register: "02CE",
  initialValue: "0",
  bitmap: "0F",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},
// Application name
"reg0208": {
  fieldType: "text",
  register: "0208",
  initialValue: "",
  bitmap: "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
  isIndividual: false,
  registerSize: 32,},

"reg02d0_snvp4xd": {
  fieldType: "hidden",
  register: "02D0",
  initialValue: "0",
  bitmap: "FE",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},
// Host controlled
"reg02d0_ooba6wy": {
  fieldType: "radios",
  register: "02D0",
  initialValue: "0",
  bitmap: "01",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},
// Options for the main 4-LED ramp
"reg02d1": {
  fieldType: "hex",
  register: "02D1",
  initialValue: "00",
  bitmap: "FF",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},
// Color of the RGB LED(s) when the product is active, waiting for a card
"reg02d2_3iq5wdd": {
  fieldType: "radios",
  register: "02D2",
  initialValue: "9",
  bitmap: "F000",
  isIndividual: false,
  registerDefaultValue: "92A1", registerSize: 2,},

"reg02d2_ai7xezy": {
  fieldType: "hidden",
  register: "02D2",
  initialValue: "0",
  bitmap: "0C00",
  isIndividual: false,
  registerDefaultValue: "92A1", registerSize: 2,},
// State of the RGB LED(s) when the product is active, waiting for a card
"reg02d2_gjrcb2n": {
  fieldType: "radios",
  register: "02D2",
  initialValue: "2",
  bitmap: "0300",
  isIndividual: false,
  registerDefaultValue: "92A1", registerSize: 2,},
// Color of the RGB LED(s) when the product is inactive
"reg02d2_5sqf4yy": {
  fieldType: "radios",
  register: "02D2",
  initialValue: "10",
  bitmap: "00F0",
  isIndividual: false,
  registerDefaultValue: "92A1", registerSize: 2,},

"reg02d2_k4uiain": {
  fieldType: "hidden",
  register: "02D2",
  initialValue: "0",
  bitmap: "000C",
  isIndividual: false,
  registerDefaultValue: "92A1", registerSize: 2,},
// State of the RGB LED(s) when the product is inactive
"reg02d2_evlcwsl": {
  fieldType: "radios",
  register: "02D2",
  initialValue: "1",
  bitmap: "0003",
  isIndividual: false,
  registerDefaultValue: "92A1", registerSize: 2,},
// Light level when active
"reg02d3_lmh6e5y": {
  fieldType: "updown",
  register: "02D3",
  initialValue: "100",
  bitmap: "FF0000",
  isIndividual: false,
  registerDefaultValue: "644B0A", registerSize: 3,},
// Light level when idle
"reg02d3_gsqqlyn": {
  fieldType: "updown",
  register: "02D3",
  initialValue: "75",
  bitmap: "00FF00",
  isIndividual: false,
  registerDefaultValue: "644B0A", registerSize: 3,},
// Delay before switching to dimmed-level luminosity.
"reg02d3_rk4pgmy": {
  fieldType: "updown",
  register: "02D3",
  initialValue: "10",
  bitmap: "0000FF",
  isIndividual: false,
  registerDefaultValue: "644B0A", registerSize: 3,},
// Options for the auxiliary LEDs
"reg02d7": {
  fieldType: "hex",
  register: "02D7",
  initialValue: "00",
  bitmap: "FF",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},

"reg02d8_hxqkjly": {
  fieldType: "hidden",
  register: "02D8",
  initialValue: "0",
  bitmap: "F8",
  isIndividual: false,
  registerDefaultValue: "01", registerSize: 1,},
// Control whether the product is allowed to beep or define the Volume level. Set to 0 to disable sound. The maximum volume level depends on the product type.
"reg02d8_kspmojd": {
  fieldType: "hex",
  register: "02D8",
  initialValue: "01",
  bitmap: "07",
  isIndividual: false,
  registerDefaultValue: "01", registerSize: 1,},
// Product Specific
"reg02d9": {
  fieldType: "hex",
  register: "02D9",
  initialValue: "",
  bitmap: "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
  isIndividual: false,
  registerSize: 64,},
// Theme selection
"reg02da": {
  fieldType: "hex",
  register: "02DA",
  initialValue: "000000",
  bitmap: "FFFFFF",
  isIndividual: false,
  registerDefaultValue: "000000", registerSize: 3,},

"reg02a0_6ohabel_aeev4dd": {
  fieldType: "hidden",
  register: "02A0",
  initialValue: "0",
  bitmap: "E000000000",
  isIndividual: false,
  registerDefaultValue: "0003000200", registerSize: 5,},
// Insert / Remove
"reg02a0_6ohabel_oe4w4my": {
  fieldType: "radios",
  register: "02A0",
  initialValue: "0",
  bitmap: "1000000000",
  isIndividual: false,
  registerDefaultValue: "0003000200", registerSize: 5,},

"reg02a0_6ohabel_n2k4omn": {
  fieldType: "hidden",
  register: "02A0",
  initialValue: "0",
  bitmap: "0C00000000",
  isIndividual: false,
  registerDefaultValue: "0003000200", registerSize: 5,},
// Explicit activation
"reg02a0_6ohabel_ups3l5l": {
  fieldType: "radios",
  register: "02A0",
  initialValue: "0",
  bitmap: "0200000000",
  isIndividual: false,
  registerDefaultValue: "0003000200", registerSize: 5,},
// Activate on startup
"reg02a0_6ohabel_5g4gajl": {
  fieldType: "radios",
  register: "02A0",
  initialValue: "0",
  bitmap: "0100000000",
  isIndividual: false,
  registerDefaultValue: "0003000200", registerSize: 5,},

"reg02a0_6ohabel_43kxznd": {
  fieldType: "hidden",
  register: "02A0",
  initialValue: "0",
  bitmap: "00FC000000",
  isIndividual: false,
  registerDefaultValue: "0003000200", registerSize: 5,},
// Output protocol over a serial link
"reg02a0_6ohabel_rqjiszy": {
  fieldType: "radios",
  register: "02A0",
  initialValue: "3",
  bitmap: "0003000000",
  isIndividual: false,
  registerDefaultValue: "0003000200", registerSize: 5,},

"reg02a0_6ohabel_2j6me3l": {
  fieldType: "hidden",
  register: "02A0",
  initialValue: "0",
  bitmap: "0000FC0000",
  isIndividual: false,
  registerDefaultValue: "0003000200", registerSize: 5,},
// Output protocol over a Bluetooth link
"reg02a0_6ohabel_ysqcqsn": {
  fieldType: "radios",
  register: "02A0",
  initialValue: "0",
  bitmap: "0000030000",
  isIndividual: false,
  registerDefaultValue: "0003000200", registerSize: 5,},

"reg02a0_6ohabel_vkvtt3n": {
  fieldType: "hidden",
  register: "02A0",
  initialValue: "0",
  bitmap: "000000F800",
  isIndividual: false,
  registerDefaultValue: "0003000200", registerSize: 5,},
// Output format over a Network link
"reg02a0_6ohabel_sxs7v7d": {
  fieldType: "radios",
  register: "02A0",
  initialValue: "2",
  bitmap: "0000000700",
  isIndividual: false,
  registerDefaultValue: "0003000200", registerSize: 5,},

"reg02a0_6ohabel_flooq3d": {
  fieldType: "hidden",
  register: "02A0",
  initialValue: "0",
  bitmap: "00000000FC",
  isIndividual: false,
  registerDefaultValue: "0003000200", registerSize: 5,},
// Output format over a USB link
"reg02a0_6ohabel_jzirgky": {
  fieldType: "radios",
  register: "02A0",
  initialValue: "0",
  bitmap: "0000000003",
  isIndividual: false,
  registerDefaultValue: "0003000200", registerSize: 5,},
// Delay between 2 consecutive readings
"reg02a1_6ohabel_rj665vl": {
  fieldType: "hex",
  register: "02A1",
  initialValue: "0A",
  bitmap: "FF00",
  isIndividual: false,
  registerDefaultValue: "0A1E", registerSize: 2,},
// Delay before reading the same Tag again
"reg02a1_6ohabel_gpg5rzd": {
  fieldType: "hex",
  register: "02A1",
  initialValue: "1E",
  bitmap: "00FF",
  isIndividual: false,
  registerDefaultValue: "0A1E", registerSize: 2,},
// Keyboard layout
"reg02a6": {
  fieldType: "list",
  register: "02A6",
  initialValue: "0",
  bitmap: "FF",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},
// Misc. options when running in keyboard mode
"reg02a7": {
  fieldType: "hex",
  register: "02A7",
  initialValue: "00",
  bitmap: "FF",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},
// Prefix: string sent before the data in keyboard mode
"reg02a8": {
  fieldType: "text",
  register: "02A8",
  initialValue: "",
  bitmap: "FFFFFFFFFFFFFFFF",
  isIndividual: false,
  registerSize: 8,},
// Suffix: string sent after the data in keyboard mode
"reg02a9": {
  fieldType: "text",
  register: "02A9",
  initialValue: "\n",
  bitmap: "FFFFFFFFFFFFFFFF",
  isIndividual: false,
  registerDefaultValue: "0A", registerSize: 8,},
// Protect the firmware
"reg02f0_y4yzkmn": {
  fieldType: "radios",
  register: "02F0",
  initialValue: "0",
  bitmap: "00800000",
  isIndividual: false,
  registerDefaultValue: "00000000", registerSize: 4,},
// Limit sensitive instructions
"reg02f0_3m2xxun": {
  fieldType: "radios",
  register: "02F0",
  initialValue: "0",
  bitmap: "00400000",
  isIndividual: false,
  registerDefaultValue: "00000000", registerSize: 4,},
// Configuration
"reg02f0_noupivn": {
  fieldType: "radios",
  register: "02F0",
  initialValue: "0",
  bitmap: "00300000",
  isIndividual: false,
  registerDefaultValue: "00000000", registerSize: 4,},

"reg02f0_xajyakn": {
  fieldType: "hidden",
  register: "02F0",
  initialValue: "0",
  bitmap: "00080000",
  isIndividual: false,
  registerDefaultValue: "00000000", registerSize: 4,},
// Makes the configuration always readable
"reg02f0_ctwu2dn": {
  fieldType: "radios",
  register: "02F0",
  initialValue: "0",
  bitmap: "00040000",
  isIndividual: false,
  registerDefaultValue: "00000000", registerSize: 4,},
// Usage
"reg02f0_ch4wbsl": {
  fieldType: "radios",
  register: "02F0",
  initialValue: "0",
  bitmap: "00030000",
  isIndividual: false,
  registerDefaultValue: "00000000", registerSize: 4,},
// Counter to lock the Admin password in case of repeated authentication failures
"reg02f1_3iq5wdd": {
  fieldType: "updown",
  register: "02F1",
  initialValue: "0",
  bitmap: "F000",
  isIndividual: false,
  registerDefaultValue: "0000", registerSize: 2,},
// Counter to lock the User password in case of repeated authentication failures
"reg02f1_ytndzhn": {
  fieldType: "updown",
  register: "02F1",
  initialValue: "0",
  bitmap: "0F00",
  isIndividual: false,
  registerDefaultValue: "0000", registerSize: 2,},
// Counter to lock the Admin authentication key in case of repeated authentication failures
"reg02f1_5sqf4yy": {
  fieldType: "updown",
  register: "02F1",
  initialValue: "0",
  bitmap: "00F0",
  isIndividual: false,
  registerDefaultValue: "0000", registerSize: 2,},
// Counter to lock the User authentication key in case of repeated authentication failures
"reg02f1_rxpn6ed": {
  fieldType: "updown",
  register: "02F1",
  initialValue: "0",
  bitmap: "000F",
  isIndividual: false,
  registerDefaultValue: "0000", registerSize: 2,},
// Reserved for futur use
"id1326_Option": {
  fieldType: "checkboxes",
  register: "0261",
  initialValue: false,
  bitmap: "80",
  isIndividual: false,
  registerDefaultValue: "04", registerSize: 1,},
// Reserved for futur use
"id1327_Option": {
  fieldType: "checkboxes",
  register: "0261",
  initialValue: false,
  bitmap: "40",
  isIndividual: false,
  registerDefaultValue: "04", registerSize: 1,},
// Reserved for futur use
"id1328_Option": {
  fieldType: "checkboxes",
  register: "0261",
  initialValue: false,
  bitmap: "20",
  isIndividual: false,
  registerDefaultValue: "04", registerSize: 1,},
// Reserved for futur use
"id1329_Option": {
  fieldType: "checkboxes",
  register: "0261",
  initialValue: false,
  bitmap: "10",
  isIndividual: false,
  registerDefaultValue: "04", registerSize: 1,},
// Reserved for futur use
"id1330_Option": {
  fieldType: "checkboxes",
  register: "0261",
  initialValue: false,
  bitmap: "08",
  isIndividual: false,
  registerDefaultValue: "04", registerSize: 1,},
// EPC Class 1 Gen 2 UHF (ISO/IEC 18000-6C)
"id1331_Option": {
  fieldType: "checkboxes",
  register: "0261",
  initialValue: true,
  bitmap: "4",
  isIndividual: false,
  registerDefaultValue: "04", registerSize: 1,},
// Reserved for futur use
"id1332_Option": {
  fieldType: "checkboxes",
  register: "0261",
  initialValue: false,
  bitmap: "02",
  isIndividual: false,
  registerDefaultValue: "04", registerSize: 1,},
// Reserved for futur use
"id1333_Option": {
  fieldType: "checkboxes",
  register: "0261",
  initialValue: false,
  bitmap: "01",
  isIndividual: false,
  registerDefaultValue: "04", registerSize: 1,},
// Reserved for futur use
"id1341_Option": {
  fieldType: "checkboxes",
  register: "0263",
  initialValue: false,
  bitmap: "80",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},
// Reserved for futur use
"id1342_Option": {
  fieldType: "checkboxes",
  register: "0263",
  initialValue: false,
  bitmap: "40",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},
// Reserved for futur use
"id1343_Option": {
  fieldType: "checkboxes",
  register: "0263",
  initialValue: false,
  bitmap: "20",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},
// Reserved for futur use
"id1344_Option": {
  fieldType: "checkboxes",
  register: "0263",
  initialValue: false,
  bitmap: "10",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},
// Reserved for futur use
"id1345_Option": {
  fieldType: "checkboxes",
  register: "0263",
  initialValue: false,
  bitmap: "08",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},
// Reserved for futur use
"id1346_Option": {
  fieldType: "checkboxes",
  register: "0263",
  initialValue: false,
  bitmap: "04",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},
// Reserved for futur use
"id1347_Option": {
  fieldType: "checkboxes",
  register: "0263",
  initialValue: false,
  bitmap: "02",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},
// Use ST Reader Suite or not
"id1348_Option": {
  fieldType: "checkboxes",
  register: "0263",
  initialValue: false,
  bitmap: "1",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},
// Main carrier frequency
"reg0267": {
  fieldType: "hex",
  register: "0267",
  initialValue: "00",
  bitmap: "FF",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},

"reg029c_t2pgapn": {
  fieldType: "hidden",
  register: "029C",
  initialValue: "0",
  bitmap: "FE00",
  isIndividual: false,
  registerDefaultValue: "0103", registerSize: 2,},
// Control whether Legacy communication drives the UI automatically
"reg029c_jv4bm2d": {
  fieldType: "radios",
  register: "029C",
  initialValue: "1",
  bitmap: "0100",
  isIndividual: false,
  registerDefaultValue: "0103", registerSize: 2,},
// Number of seconds after which the RF field is switched OFF and the host is reported has missing
"reg029c_gpg5rzd": {
  fieldType: "hex",
  register: "029C",
  initialValue: "03",
  bitmap: "00FF",
  isIndividual: false,
  registerDefaultValue: "0103", registerSize: 2,},
};
