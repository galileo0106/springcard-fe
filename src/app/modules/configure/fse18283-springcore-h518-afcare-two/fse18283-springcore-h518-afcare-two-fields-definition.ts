/**
 * La définition de chacun des champs qui permettent de composer les valeurs des registres
 */
export const Fse18283SpringcoreH518Afcare_two_FieldsDefinition = {

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
// Disable BLE
"reg02c2_m6awtjl": {
  fieldType: "radios",
  register: "02C2",
  initialValue: "0",
  bitmap: "80",
  isIndividual: false,
  registerDefaultValue: "20", registerSize: 1,},
// Disable BLE negociation (use default settings and avoid renegociation).
"reg02c2_bozlrly_op23zml": {
  fieldType: "radios",
  register: "02C2",
  initialValue: "0",
  bitmap: "40",
  isIndividual: false,
  registerDefaultValue: "20", registerSize: 1,},
// Use a different address (BT_ADDR) per profile
"reg02c2_bozlrly_ax7h6sl": {
  fieldType: "radios",
  register: "02C2",
  initialValue: "1",
  bitmap: "20",
  isIndividual: false,
  registerDefaultValue: "20", registerSize: 1,},
// Defines whether the BLE interface requires paired (bonded) connections, or not.
"reg02c2_bozlrly_t6r55rl": {
  fieldType: "radios",
  register: "02C2",
  initialValue: "0",
  bitmap: "10",
  isIndividual: false,
  registerDefaultValue: "20", registerSize: 1,},
// Disable SpringCore direct as secondary BLE interface.
"reg02c2_bozlrly_eph722y": {
  fieldType: "radios",
  register: "02C2",
  initialValue: "0",
  bitmap: "08",
  isIndividual: false,
  registerDefaultValue: "20", registerSize: 1,},
// Disable fast link (PHY 2M).
"reg02c2_bozlrly_riuquxn": {
  fieldType: "radios",
  register: "02C2",
  initialValue: "0",
  bitmap: "04",
  isIndividual: false,
  registerDefaultValue: "20", registerSize: 1,},
// Defines how the BLE interface is used.
"reg02c2_bozlrly_khxezgy": {
  fieldType: "radios",
  register: "02C2",
  initialValue: "0",
  bitmap: "03",
  isIndividual: false,
  registerDefaultValue: "20", registerSize: 1,},

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

"reg02c5_vtrhxcd": {
  fieldType: "hidden",
  register: "02C5",
  initialValue: "0",
  bitmap: "800000",
  isIndividual: false,
  registerDefaultValue: "000203", registerSize: 3,},
// Disable power button while connected
"reg02c5_s5gikod": {
  fieldType: "radios",
  register: "02C5",
  initialValue: "0",
  bitmap: "400000",
  isIndividual: false,
  registerDefaultValue: "000203", registerSize: 3,},
// Allow 1A charge mode (JCH test)
"reg02c5_yzwk5zd": {
  fieldType: "radios",
  register: "02C5",
  initialValue: "0",
  bitmap: "200000",
  isIndividual: false,
  registerDefaultValue: "000203", registerSize: 3,},
// Force High charge mode
"reg02c5_zgpuoyd": {
  fieldType: "radios",
  register: "02C5",
  initialValue: "0",
  bitmap: "100000",
  isIndividual: false,
  registerDefaultValue: "000203", registerSize: 3,},
// Sleep allowed on charger
"reg02c5_6xkls3d": {
  fieldType: "radios",
  register: "02C5",
  initialValue: "0",
  bitmap: "080000",
  isIndividual: false,
  registerDefaultValue: "000203", registerSize: 3,},
// Wake up provided by the BLE chip
"reg02c5_54cmvpd": {
  fieldType: "radios",
  register: "02C5",
  initialValue: "0",
  bitmap: "040000",
  isIndividual: false,
  registerDefaultValue: "000203", registerSize: 3,},
// behaviour when power loss
"reg02c5_5pbdr5n": {
  fieldType: "radios",
  register: "02C5",
  initialValue: "0",
  bitmap: "020000",
  isIndividual: false,
  registerDefaultValue: "000203", registerSize: 3,},
// behaviour when power arrives
"reg02c5_5r4ewkl": {
  fieldType: "radios",
  register: "02C5",
  initialValue: "0",
  bitmap: "010000",
  isIndividual: false,
  registerDefaultValue: "000203", registerSize: 3,},
// Power saving delay, unconnected
"reg02c5_gsqqlyn": {
  fieldType: "hex",
  register: "02C5",
  initialValue: "02",
  bitmap: "00FF00",
  isIndividual: false,
  registerDefaultValue: "000203", registerSize: 3,},
// Power saving delay, connected but idle
"reg02c5_rk4pgmy": {
  fieldType: "hex",
  register: "02C5",
  initialValue: "03",
  bitmap: "0000FF",
  isIndividual: false,
  registerDefaultValue: "000203", registerSize: 3,},
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
// Protect the firmware
"reg02f0_vjvofiy": {
  fieldType: "radios",
  register: "02F0",
  initialValue: "0",
  bitmap: "00008000",
  isIndividual: false,
  registerDefaultValue: "00000000", registerSize: 4,},
// Limit sensitive instructions
"reg02f0_rc6tnwl": {
  fieldType: "radios",
  register: "02F0",
  initialValue: "0",
  bitmap: "00004000",
  isIndividual: false,
  registerDefaultValue: "00000000", registerSize: 4,},
// Configuration
"reg02f0_5y4fpey": {
  fieldType: "radios",
  register: "02F0",
  initialValue: "0",
  bitmap: "00003000",
  isIndividual: false,
  registerDefaultValue: "00000000", registerSize: 4,},
// Disable Admin key
"reg02f0_awfi3xn": {
  fieldType: "radios",
  register: "02F0",
  initialValue: "0",
  bitmap: "00000800",
  isIndividual: false,
  registerDefaultValue: "00000000", registerSize: 4,},
// Disable User key
"reg02f0_loo4own": {
  fieldType: "radios",
  register: "02F0",
  initialValue: "0",
  bitmap: "00000400",
  isIndividual: false,
  registerDefaultValue: "00000000", registerSize: 4,},
// Usage
"reg02f0_4koytuy": {
  fieldType: "radios",
  register: "02F0",
  initialValue: "0",
  bitmap: "00000300",
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
// BLE Tx power
"reg0240": {
  fieldType: "hex",
  register: "0240",
  initialValue: "80",
  bitmap: "FF",
  isIndividual: false,
  registerDefaultValue: "80", registerSize: 1,},
// BLE minimal interval
"reg0241_bozlrly_rx2tm2y": {
  fieldType: "hex",
  register: "0241",
  initialValue: "0006",
  bitmap: "FFFF000000000000",
  isIndividual: false,
  registerDefaultValue: "0006000600000064", registerSize: 8,},
// BLE minimal interval
"reg0241_bozlrly_kf4jw3l": {
  fieldType: "hex",
  register: "0241",
  initialValue: "0006",
  bitmap: "0000FFFF00000000",
  isIndividual: false,
  registerDefaultValue: "0006000600000064", registerSize: 8,},
// BLE slave latency
"reg0241_bozlrly_n756ral": {
  fieldType: "hex",
  register: "0241",
  initialValue: "0000",
  bitmap: "00000000FFFF0000",
  isIndividual: false,
  registerDefaultValue: "0006000600000064", registerSize: 8,},
// BLE supervision timeout
"reg0241_bozlrly_ehbhexd": {
  fieldType: "hex",
  register: "0241",
  initialValue: "0064",
  bitmap: "000000000000FFFF",
  isIndividual: false,
  registerDefaultValue: "0006000600000064", registerSize: 8,},
// Notifications Registration Timeout
"reg0242": {
  fieldType: "hex",
  register: "0242",
  initialValue: "1E",
  bitmap: "FF",
  isIndividual: false,
  registerDefaultValue: "1E", registerSize: 1,},

"reg0243_bozlrly_hycivfd": {
  fieldType: "hidden",
  register: "0243",
  initialValue: "0",
  bitmap: "FC",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},
// Force legacy advertising frame.
"reg0243_bozlrly_mdwlall": {
  fieldType: "hex",
  register: "0243",
  initialValue: "00",
  bitmap: "02",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},
// Disable pairing re-initiator.
"reg0243_bozlrly_ooba6wy": {
  fieldType: "hex",
  register: "0243",
  initialValue: "00",
  bitmap: "01",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},

"reg0248_bozlrly_m6awtjl": {
  fieldType: "hidden",
  register: "0248",
  initialValue: "1",
  bitmap: "80",
  isIndividual: false,
  registerDefaultValue: "77", registerSize: 1,},
// set 1 (beacon).
"reg0248_bozlrly_dlvtahl": {
  fieldType: "hex",
  register: "0248",
  initialValue: "07",
  bitmap: "70",
  isIndividual: false,
  registerDefaultValue: "77", registerSize: 1,},

"reg0248_bozlrly_eph722y": {
  fieldType: "hidden",
  register: "0248",
  initialValue: "0",
  bitmap: "08",
  isIndividual: false,
  registerDefaultValue: "77", registerSize: 1,},
// set 0 (application).
"reg0248_bozlrly_kspmojd": {
  fieldType: "hex",
  register: "0248",
  initialValue: "07",
  bitmap: "07",
  isIndividual: false,
  registerDefaultValue: "77", registerSize: 1,},
// iBeacon ID
"reg0249": {
  fieldType: "hex",
  register: "0249",
  initialValue: "00000000",
  bitmap: "FFFFFFFF",
  isIndividual: false,
  registerDefaultValue: "00000000", registerSize: 4,},
// Auto pps
"reg0271_m6awtjl": {
  fieldType: "checkbox",
  register: "0271",
  initialValue: true,
  bitmap: "80",
  isIndividual: false,
  registerDefaultValue: "83", registerSize: 1,},
// HSP (Calypso SAM)
"reg0271_op23zml": {
  fieldType: "checkbox",
  register: "0271",
  initialValue: false,
  bitmap: "40",
  isIndividual: false,
  registerDefaultValue: "83", registerSize: 1,},
// Activation mode
"reg0271_6pga6ll": {
  fieldType: "radios",
  register: "0271",
  initialValue: "0",
  bitmap: "30",
  isIndividual: false,
  registerDefaultValue: "83", registerSize: 1,},

"reg0271_eph722y": {
  fieldType: "hidden",
  register: "0271",
  initialValue: "0",
  bitmap: "08",
  isIndividual: false,
  registerDefaultValue: "83", registerSize: 1,},
// Power class
"reg0271_kspmojd": {
  fieldType: "radios",
  register: "0271",
  initialValue: "3",
  bitmap: "07",
  isIndividual: false,
  registerDefaultValue: "83", registerSize: 1,},
// Auto pps
"reg0272_m6awtjl": {
  fieldType: "checkbox",
  register: "0272",
  initialValue: true,
  bitmap: "80",
  isIndividual: false,
  registerDefaultValue: "82", registerSize: 1,},
// HSP (Calypso SAM)
"reg0272_op23zml": {
  fieldType: "checkbox",
  register: "0272",
  initialValue: false,
  bitmap: "40",
  isIndividual: false,
  registerDefaultValue: "82", registerSize: 1,},
// Activation mode
"reg0272_6pga6ll": {
  fieldType: "radios",
  register: "0272",
  initialValue: "0",
  bitmap: "30",
  isIndividual: false,
  registerDefaultValue: "82", registerSize: 1,},

"reg0272_eph722y": {
  fieldType: "hidden",
  register: "0272",
  initialValue: "0",
  bitmap: "08",
  isIndividual: false,
  registerDefaultValue: "82", registerSize: 1,},
// Power class
"reg0272_kspmojd": {
  fieldType: "radios",
  register: "0272",
  initialValue: "2",
  bitmap: "07",
  isIndividual: false,
  registerDefaultValue: "82", registerSize: 1,},
// Auto pps
"reg0273_m6awtjl": {
  fieldType: "checkbox",
  register: "0273",
  initialValue: true,
  bitmap: "80",
  isIndividual: false,
  registerDefaultValue: "82", registerSize: 1,},
// HSP (Calypso SAM)
"reg0273_op23zml": {
  fieldType: "checkbox",
  register: "0273",
  initialValue: false,
  bitmap: "40",
  isIndividual: false,
  registerDefaultValue: "82", registerSize: 1,},
// Activation mode
"reg0273_6pga6ll": {
  fieldType: "radios",
  register: "0273",
  initialValue: "0",
  bitmap: "30",
  isIndividual: false,
  registerDefaultValue: "82", registerSize: 1,},

"reg0273_eph722y": {
  fieldType: "hidden",
  register: "0273",
  initialValue: "0",
  bitmap: "08",
  isIndividual: false,
  registerDefaultValue: "82", registerSize: 1,},
// Power class
"reg0273_kspmojd": {
  fieldType: "radios",
  register: "0273",
  initialValue: "2",
  bitmap: "07",
  isIndividual: false,
  registerDefaultValue: "82", registerSize: 1,},
// Default TC2
"reg0279_5znnnnn": {
  fieldType: "hex",
  register: "0279",
  initialValue: "00",
  bitmap: "FF",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},

"reg027a_3iq5wdd": {
  fieldType: "hidden",
  register: "027A",
  initialValue: "0",
  bitmap: "F000",
  isIndividual: false,
  registerDefaultValue: "0000", registerSize: 2,},
// WWT multiplier
"reg027a_ytndzhn": {
  fieldType: "updown",
  register: "027A",
  initialValue: "0",
  bitmap: "0F00",
  isIndividual: false,
  registerDefaultValue: "0000", registerSize: 2,},
// Total timeout for T=0 APDUs (in seconds)
"reg027a_gpg5rzd": {
  fieldType: "updown",
  register: "027A",
  initialValue: "0",
  bitmap: "00FF",
  isIndividual: false,
  registerDefaultValue: "0000", registerSize: 2,},
// CWT multiplier
"reg027b_3iq5wdd": {
  fieldType: "updown",
  register: "027B",
  initialValue: "0",
  bitmap: "F000",
  isIndividual: false,
  registerDefaultValue: "0000", registerSize: 2,},
// WTX multiplier
"reg027b_ytndzhn": {
  fieldType: "updown",
  register: "027B",
  initialValue: "0",
  bitmap: "0F00",
  isIndividual: false,
  registerDefaultValue: "0000", registerSize: 2,},
// Total timeout for T=1 APDUs (in seconds)
"reg027b_gpg5rzd": {
  fieldType: "updown",
  register: "027B",
  initialValue: "0",
  bitmap: "00FF",
  isIndividual: false,
  registerDefaultValue: "0000", registerSize: 2,},

"reg027c_t2pgapn": {
  fieldType: "hidden",
  register: "027C",
  initialValue: "0",
  bitmap: "FE00",
  isIndividual: false,
  registerDefaultValue: "0000", registerSize: 2,},
// Get Response
"reg027c_jv4bm2d": {
  fieldType: "radios",
  register: "027C",
  initialValue: "0",
  bitmap: "0100",
  isIndividual: false,
  registerDefaultValue: "0000", registerSize: 2,},
// CLA of the GET RESPONSE command
"reg027c_gpg5rzd": {
  fieldType: "hex",
  register: "027C",
  initialValue: "00",
  bitmap: "00FF",
  isIndividual: false,
  registerDefaultValue: "0000", registerSize: 2,},
// Correct wrong length or LRC in ATR
"reg027f_m6awtjl": {
  fieldType: "radios",
  register: "027F",
  initialValue: "1",
  bitmap: "80",
  isIndividual: false,
  registerDefaultValue: "C0", registerSize: 1,},
// Mask RFU TA1 values in ATR
"reg027f_op23zml": {
  fieldType: "radios",
  register: "027F",
  initialValue: "1",
  bitmap: "40",
  isIndividual: false,
  registerDefaultValue: "C0", registerSize: 1,},

"reg027f_bgs5ckd": {
  fieldType: "hidden",
  register: "027F",
  initialValue: "0",
  bitmap: "3E",
  isIndividual: false,
  registerDefaultValue: "C0", registerSize: 1,},
// SESAM Vitale
"reg027f_ooba6wy": {
  fieldType: "radios",
  register: "027F",
  initialValue: "0",
  bitmap: "01",
  isIndividual: false,
  registerDefaultValue: "C0", registerSize: 1,},
// Expose the SAM AV through PC/SC
"reg02b0_35gzn7y_m6awtjl": {
  fieldType: "radios",
  register: "02B0",
  initialValue: "0",
  bitmap: "80",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},

"reg02b0_35gzn7y_op23zml": {
  fieldType: "hidden",
  register: "02B0",
  initialValue: "0",
  bitmap: "40",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},
// Disable the other SAM slots ("SAM B", "SAM C" and "SAM D")
"reg02b0_35gzn7y_ax7h6sl": {
  fieldType: "radios",
  register: "02B0",
  initialValue: "0",
  bitmap: "20",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},
// Disable the first SAM slot ("SAM" or "SAM A")
"reg02b0_35gzn7y_t6r55rl": {
  fieldType: "radios",
  register: "02B0",
  initialValue: "0",
  bitmap: "10",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},
// Disable the second Contact slot ("Contact B")
"reg02b0_35gzn7y_eph722y": {
  fieldType: "radios",
  register: "02B0",
  initialValue: "0",
  bitmap: "08",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},
// Disable the first Contact slot ("Contact" or "Contact A")
"reg02b0_35gzn7y_riuquxn": {
  fieldType: "radios",
  register: "02B0",
  initialValue: "0",
  bitmap: "04",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},

"reg02b0_35gzn7y_mdwlall": {
  fieldType: "hidden",
  register: "02B0",
  initialValue: "0",
  bitmap: "02",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},
// Disable the contactless slot
"reg02b0_35gzn7y_ooba6wy": {
  fieldType: "radios",
  register: "02B0",
  initialValue: "0",
  bitmap: "01",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},
// How are the slot numbers created
"reg02b1_35gzn7y_flcneal": {
  fieldType: "list",
  register: "02B1",
  initialValue: "0",
  bitmap: "E0",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},
// Add a part of the device identification data into the names of the slots
"reg02b1_35gzn7y_yxum27y": {
  fieldType: "list",
  register: "02B1",
  initialValue: "0",
  bitmap: "18",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},
// Force a letter in the name of the SAM slots (eg "SAM A", "SAM B" etc)
"reg02b1_35gzn7y_riuquxn": {
  fieldType: "radios",
  register: "02B1",
  initialValue: "0",
  bitmap: "04",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},
// Force a letter in the name of the ID-1 slots (eg "Contact A", "Contact B" etc)
"reg02b1_35gzn7y_mdwlall": {
  fieldType: "radios",
  register: "02B1",
  initialValue: "0",
  bitmap: "02",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},

"reg02b1_35gzn7y_ooba6wy": {
  fieldType: "hidden",
  register: "02B1",
  initialValue: "0",
  bitmap: "01",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},

"reg02bc_35gzn7y_g65secl": {
  fieldType: "hidden",
  register: "02BC",
  initialValue: "0",
  bitmap: "F0",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},
// Method for CCID Time Extension (empty) data-blocks
"reg02bc_35gzn7y_efr3mkd": {
  fieldType: "radios",
  register: "02BC",
  initialValue: "0",
  bitmap: "0C",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},
// Implement CCID without the Interrupt endpoint
"reg02bc_35gzn7y_mdwlall": {
  fieldType: "radios",
  register: "02BC",
  initialValue: "0",
  bitmap: "02",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},
// Hide CCID class in the USB descriptor
"reg02bc_35gzn7y_ooba6wy": {
  fieldType: "radios",
  register: "02BC",
  initialValue: "0",
  bitmap: "01",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},
// Time to wait before CCID operation after the SET_CONFIGURATION control (10th of second)
"reg02be_35gzn7y_rj665vl": {
  fieldType: "hex",
  register: "02BE",
  initialValue: "00",
  bitmap: "FF00",
  isIndividual: false,
  registerDefaultValue: "0000", registerSize: 2,},
// Time to wait before CCID operation after the first GET_STATUS request (10th of second)
"reg02be_35gzn7y_gpg5rzd": {
  fieldType: "hex",
  register: "02BE",
  initialValue: "00",
  bitmap: "00FF",
  isIndividual: false,
  registerDefaultValue: "0000", registerSize: 2,},
// Class of the embedded APDU interpreter
"reg02bf": {
  fieldType: "hex",
  register: "02BF",
  initialValue: "FF",
  bitmap: "FF",
  isIndividual: false,
  registerDefaultValue: "FF", registerSize: 1,},
};
