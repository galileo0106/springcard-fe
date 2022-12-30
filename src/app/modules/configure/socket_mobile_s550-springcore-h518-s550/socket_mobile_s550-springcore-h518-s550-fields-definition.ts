/**
 * La définition de chacun des champs qui permettent de composer les valeurs des registres
 */
export const SocketMobileS550SpringcoreH518S550_FieldsDefinition = {

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
  registerDefaultValue: "000578", registerSize: 3,},
// Disable power button while connected
"reg02c5_s5gikod": {
  fieldType: "radios",
  register: "02C5",
  initialValue: "0",
  bitmap: "400000",
  isIndividual: false,
  registerDefaultValue: "000578", registerSize: 3,},
// Allow 1A charge mode (JCH test)
"reg02c5_yzwk5zd": {
  fieldType: "radios",
  register: "02C5",
  initialValue: "0",
  bitmap: "200000",
  isIndividual: false,
  registerDefaultValue: "000578", registerSize: 3,},
// Force High charge mode
"reg02c5_zgpuoyd": {
  fieldType: "radios",
  register: "02C5",
  initialValue: "0",
  bitmap: "100000",
  isIndividual: false,
  registerDefaultValue: "000578", registerSize: 3,},
// Sleep allowed on charger
"reg02c5_6xkls3d": {
  fieldType: "radios",
  register: "02C5",
  initialValue: "0",
  bitmap: "080000",
  isIndividual: false,
  registerDefaultValue: "000578", registerSize: 3,},
// Wake up provided by the BLE chip
"reg02c5_54cmvpd": {
  fieldType: "radios",
  register: "02C5",
  initialValue: "0",
  bitmap: "040000",
  isIndividual: false,
  registerDefaultValue: "000578", registerSize: 3,},
// behaviour when power loss
"reg02c5_5pbdr5n": {
  fieldType: "radios",
  register: "02C5",
  initialValue: "0",
  bitmap: "020000",
  isIndividual: false,
  registerDefaultValue: "000578", registerSize: 3,},
// behaviour when power arrives
"reg02c5_5r4ewkl": {
  fieldType: "radios",
  register: "02C5",
  initialValue: "0",
  bitmap: "010000",
  isIndividual: false,
  registerDefaultValue: "000578", registerSize: 3,},
// Power saving delay, unconnected
"reg02c5_gsqqlyn": {
  fieldType: "hex",
  register: "02C5",
  initialValue: "05",
  bitmap: "00FF00",
  isIndividual: false,
  registerDefaultValue: "000578", registerSize: 3,},
// Power saving delay, connected but idle
"reg02c5_rk4pgmy": {
  fieldType: "hex",
  register: "02C5",
  initialValue: "78",
  bitmap: "0000FF",
  isIndividual: false,
  registerDefaultValue: "000578", registerSize: 3,},
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
  registerDefaultValue: "05", registerSize: 1,},
// Control whether the product is allowed to beep or define the Volume level. Set to 0 to disable sound. The maximum volume level depends on the product type.
"reg02d8_kspmojd": {
  fieldType: "hex",
  register: "02D8",
  initialValue: "05",
  bitmap: "07",
  isIndividual: false,
  registerDefaultValue: "05", registerSize: 1,},
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
// Load Factory Config button
"reg02f0_tdf7qky": {
  fieldType: "radios",
  register: "02F0",
  initialValue: "0",
  bitmap: "80000000",
  isIndividual: false,
  registerDefaultValue: "00000000", registerSize: 4,},

"reg02f0_kkau5nn": {
  fieldType: "hidden",
  register: "02F0",
  initialValue: "0",
  bitmap: "70000000",
  isIndividual: false,
  registerDefaultValue: "00000000", registerSize: 4,},
// Master Cards access to ATECC
"reg02f0_zpy22zy": {
  fieldType: "radios",
  register: "02F0",
  initialValue: "0",
  bitmap: "08000000",
  isIndividual: false,
  registerDefaultValue: "00000000", registerSize: 4,},
// Master Cards access to SAM AV
"reg02f0_iypcdqy": {
  fieldType: "radios",
  register: "02F0",
  initialValue: "0",
  bitmap: "04000000",
  isIndividual: false,
  registerDefaultValue: "00000000", registerSize: 4,},
// Master Cards activation options
"reg02f0_w2yu4zd": {
  fieldType: "radios",
  register: "02F0",
  initialValue: "0",
  bitmap: "03000000",
  isIndividual: false,
  registerDefaultValue: "00000000", registerSize: 4,},
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
// Options for Master Card and Config push
"reg02f2": {
  fieldType: "hex",
  register: "02F2",
  initialValue: "00",
  bitmap: "FF",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},
// Key ID key for Master Card and Config push
"reg02f3": {
  fieldType: "hex",
  register: "02F3",
  initialValue: "00000000",
  bitmap: "FFFFFFFF",
  isIndividual: false,
  registerDefaultValue: "00000000", registerSize: 4,},
// AES auth key for Master Card and Config push
"reg02f4": {
  fieldType: "hex",
  register: "02F4",
  initialValue: "00000000000000000000000000000000",
  bitmap: "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
  isIndividual: false,
  registerDefaultValue: "00000000000000000000000000000000", registerSize: 16,},
// ECC public key for Master Card and Config push
"reg02f5": {
  fieldType: "hex",
  register: "02F5",
  initialValue: "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  bitmap: "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
  isIndividual: false,
  registerDefaultValue: "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000", registerSize: 64,},

"reg02fb_m6awtjl": {
  fieldType: "hidden",
  register: "02FB",
  initialValue: "0",
  bitmap: "80",
  isIndividual: false,
  registerDefaultValue: "0C", registerSize: 1,},

"reg02fb_op23zml": {
  fieldType: "hidden",
  register: "02FB",
  initialValue: "0",
  bitmap: "40",
  isIndividual: false,
  registerDefaultValue: "0C", registerSize: 1,},

"reg02fb_ax7h6sl": {
  fieldType: "hidden",
  register: "02FB",
  initialValue: "0",
  bitmap: "20",
  isIndividual: false,
  registerDefaultValue: "0C", registerSize: 1,},

"reg02fb_t6r55rl": {
  fieldType: "hidden",
  register: "02FB",
  initialValue: "0",
  bitmap: "10",
  isIndividual: false,
  registerDefaultValue: "0C", registerSize: 1,},
// Index of the product's private key in the ATECC
"reg02fb_l365cmn": {
  fieldType: "updown",
  register: "02FB",
  initialValue: "12",
  bitmap: "0F",
  isIndividual: false,
  registerDefaultValue: "0C", registerSize: 1,},
// Public Key for User access
"reg02fc": {
  fieldType: "hex",
  register: "02FC",
  initialValue: "",
  bitmap: "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
  isIndividual: false,
  registerSize: 32,},
// Public Key for Admin access
"reg02fd": {
  fieldType: "hex",
  register: "02FD",
  initialValue: "",
  bitmap: "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
  isIndividual: false,
  registerSize: 32,},
// Prevent carrier collision (probe the RF field before becoming active)
"reg0230_m6awtjl": {
  fieldType: "radios",
  register: "0230",
  initialValue: "0",
  bitmap: "80",
  isIndividual: false,
  registerDefaultValue: "01", registerSize: 1,},
// Activity cycle policy
"reg0230_efr3mkd": {
  fieldType: "radios",
  register: "0230",
  initialValue: "0",
  bitmap: "0C",
  isIndividual: false,
  registerDefaultValue: "01", registerSize: 1,},

"reg0230_mdwlall": {
  fieldType: "hidden",
  register: "0230",
  initialValue: "0",
  bitmap: "02",
  isIndividual: false,
  registerDefaultValue: "01", registerSize: 1,},
// Be a NFC poller (reader)
"reg0230_ooba6wy": {
  fieldType: "radios",
  register: "0230",
  initialValue: "1",
  bitmap: "01",
  isIndividual: false,
  registerDefaultValue: "01", registerSize: 1,},
// Reserved for futur use
"id7302_Option": {
  fieldType: "checkboxes",
  register: "0231",
  initialValue: false,
  bitmap: "8000",
  isIndividual: false,
  registerDefaultValue: "14E7", registerSize: 2,},
// Reserved for futur use
"id7303_Option": {
  fieldType: "checkboxes",
  register: "0231",
  initialValue: false,
  bitmap: "4000",
  isIndividual: false,
  registerDefaultValue: "14E7", registerSize: 2,},
// Inside Pico family using vicinity protocol (based on ISO/IEC 15693)
"id7304_Option": {
  fieldType: "checkboxes",
  register: "0231",
  initialValue: false,
  bitmap: "2000",
  isIndividual: false,
  registerDefaultValue: "14E7", registerSize: 2,},
// NFC-F (JIS X6319-4 and ISO/IEC 18092 at 212 or 424kbit/s)
"id7305_Option": {
  fieldType: "checkboxes",
  register: "0231",
  initialValue: true,
  bitmap: "1000",
  isIndividual: false,
  registerDefaultValue: "14E7", registerSize: 2,},
// RF barcode (Thinfilm / Kovio)
"id7306_Option": {
  fieldType: "checkboxes",
  register: "0231",
  initialValue: false,
  bitmap: "800",
  isIndividual: false,
  registerDefaultValue: "14E7", registerSize: 2,},
// NFC Forum Type 1 Tags (Broadcomm / Innovision Jewel)
"id7307_Option": {
  fieldType: "checkboxes",
  register: "0231",
  initialValue: true,
  bitmap: "400",
  isIndividual: false,
  registerDefaultValue: "14E7", registerSize: 2,},
// NFC-EPC (ISO/IEC 18000-3M3, EPC HF)
"id7308_Option": {
  fieldType: "checkboxes",
  register: "0231",
  initialValue: false,
  bitmap: "200",
  isIndividual: false,
  registerDefaultValue: "14E7", registerSize: 2,},
// EM Microelectronic 4134
"id7309_Option": {
  fieldType: "checkboxes",
  register: "0231",
  initialValue: false,
  bitmap: "100",
  isIndividual: false,
  registerDefaultValue: "14E7", registerSize: 2,},
// Innovatron radio protocol (legacy Calypso cards)
"id7310_Option": {
  fieldType: "checkboxes",
  register: "0231",
  initialValue: true,
  bitmap: "80",
  isIndividual: false,
  registerDefaultValue: "14E7", registerSize: 2,},
// ASK contactless tickets (based on ISO/IEC 14443-2B)
"id7311_Option": {
  fieldType: "checkboxes",
  register: "0231",
  initialValue: true,
  bitmap: "40",
  isIndividual: false,
  registerDefaultValue: "14E7", registerSize: 2,},
// ST MicroElectronics SR contactless tickets (based on ISO/IEC 14443-2B)
"id7312_Option": {
  fieldType: "checkboxes",
  register: "0231",
  initialValue: true,
  bitmap: "20",
  isIndividual: false,
  registerDefaultValue: "14E7", registerSize: 2,},
// Inside Pico family using proximity protocol (based on ISO/IEC 14443-2B)
"id7313_Option": {
  fieldType: "checkboxes",
  register: "0231",
  initialValue: false,
  bitmap: "10",
  isIndividual: false,
  registerDefaultValue: "14E7", registerSize: 2,},
// Reserved for futur use
"id7314_Option": {
  fieldType: "checkboxes",
  register: "0231",
  initialValue: false,
  bitmap: "0008",
  isIndividual: false,
  registerDefaultValue: "14E7", registerSize: 2,},
// NFC-V (ISO/IEC 15693)
"id7315_Option": {
  fieldType: "checkboxes",
  register: "0231",
  initialValue: true,
  bitmap: "4",
  isIndividual: false,
  registerDefaultValue: "14E7", registerSize: 2,},
// NFC-B (ISO/IEC 14443 type B)
"id7316_Option": {
  fieldType: "checkboxes",
  register: "0231",
  initialValue: true,
  bitmap: "2",
  isIndividual: false,
  registerDefaultValue: "14E7", registerSize: 2,},
// NFC-A (ISO/IEC 14443 type A, ISO/IEC 18092 at 106kbit/s)
"id7317_Option": {
  fieldType: "checkboxes",
  register: "0231",
  initialValue: true,
  bitmap: "1",
  isIndividual: false,
  registerDefaultValue: "14E7", registerSize: 2,},
// Reserved for futur use
"id7322_Option": {
  fieldType: "checkboxes",
  register: "0232",
  initialValue: false,
  bitmap: "80",
  isIndividual: false,
  registerDefaultValue: "0000", registerSize: 2,},
// PICC to PCD at 848kbps
"id7323_Option": {
  fieldType: "checkboxes",
  register: "0232",
  initialValue: false,
  bitmap: "40",
  isIndividual: false,
  registerDefaultValue: "0000", registerSize: 2,},
// PICC to PCD at 242kbps
"id7324_Option": {
  fieldType: "checkboxes",
  register: "0232",
  initialValue: false,
  bitmap: "20",
  isIndividual: false,
  registerDefaultValue: "0000", registerSize: 2,},
// PICC to PCD at 212kbps
"id7325_Option": {
  fieldType: "checkboxes",
  register: "0232",
  initialValue: false,
  bitmap: "10",
  isIndividual: false,
  registerDefaultValue: "0000", registerSize: 2,},
// Reserved for futur use
"id7326_Option": {
  fieldType: "checkboxes",
  register: "0232",
  initialValue: false,
  bitmap: "08",
  isIndividual: false,
  registerDefaultValue: "0000", registerSize: 2,},
// PCD to PICC at 848kbps
"id7327_Option": {
  fieldType: "checkboxes",
  register: "0232",
  initialValue: false,
  bitmap: "4",
  isIndividual: false,
  registerDefaultValue: "0000", registerSize: 2,},
// PCD to PICC at 242kbps
"id7328_Option": {
  fieldType: "checkboxes",
  register: "0232",
  initialValue: false,
  bitmap: "2",
  isIndividual: false,
  registerDefaultValue: "0000", registerSize: 2,},
// PCD to PICC at 212kbps
"id7329_Option": {
  fieldType: "checkboxes",
  register: "0232",
  initialValue: false,
  bitmap: "1",
  isIndividual: false,
  registerDefaultValue: "0000", registerSize: 2,},
// Reserved for futur use
"id7331_Option": {
  fieldType: "checkboxes",
  register: "0232",
  initialValue: false,
  bitmap: "80",
  isIndividual: false,
  registerDefaultValue: "0000", registerSize: 2,},
// PICC to PCD at 848kbps
"id7332_Option": {
  fieldType: "checkboxes",
  register: "0232",
  initialValue: false,
  bitmap: "40",
  isIndividual: false,
  registerDefaultValue: "0000", registerSize: 2,},
// PICC to PCD at 242kbps
"id7333_Option": {
  fieldType: "checkboxes",
  register: "0232",
  initialValue: false,
  bitmap: "20",
  isIndividual: false,
  registerDefaultValue: "0000", registerSize: 2,},
// PICC to PCD at 212kbps
"id7334_Option": {
  fieldType: "checkboxes",
  register: "0232",
  initialValue: false,
  bitmap: "10",
  isIndividual: false,
  registerDefaultValue: "0000", registerSize: 2,},
// Reserved for futur use
"id7335_Option": {
  fieldType: "checkboxes",
  register: "0232",
  initialValue: false,
  bitmap: "08",
  isIndividual: false,
  registerDefaultValue: "0000", registerSize: 2,},
// PCD to PICC at 848kbps
"id7336_Option": {
  fieldType: "checkboxes",
  register: "0232",
  initialValue: false,
  bitmap: "4",
  isIndividual: false,
  registerDefaultValue: "0000", registerSize: 2,},
// PCD to PICC at 242kbps
"id7337_Option": {
  fieldType: "checkboxes",
  register: "0232",
  initialValue: false,
  bitmap: "2",
  isIndividual: false,
  registerDefaultValue: "0000", registerSize: 2,},
// PCD to PICC at 212kbps
"id7338_Option": {
  fieldType: "checkboxes",
  register: "0232",
  initialValue: false,
  bitmap: "1",
  isIndividual: false,
  registerDefaultValue: "0000", registerSize: 2,},

"reg0233_35gzn7y_m6awtjl": {
  fieldType: "hidden",
  register: "0233",
  initialValue: "0",
  bitmap: "80",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},

"reg0233_35gzn7y_op23zml": {
  fieldType: "hidden",
  register: "0233",
  initialValue: "0",
  bitmap: "40",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},

"reg0233_35gzn7y_ax7h6sl": {
  fieldType: "hidden",
  register: "0233",
  initialValue: "0",
  bitmap: "20",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},

"reg0233_35gzn7y_t6r55rl": {
  fieldType: "hidden",
  register: "0233",
  initialValue: "0",
  bitmap: "10",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},
// Prevent targets using the NFC-F protocol to enter NFC DEP level
"reg0233_35gzn7y_eph722y": {
  fieldType: "radios",
  register: "0233",
  initialValue: "0",
  bitmap: "08",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},
// Prevent targets using the NFC-A protocol to enter NFC DEP level
"reg0233_35gzn7y_riuquxn": {
  fieldType: "radios",
  register: "0233",
  initialValue: "0",
  bitmap: "04",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},
// Prevent cards using the NFC-B protocol to enter T=CL / ISO DEP level
"reg0233_35gzn7y_mdwlall": {
  fieldType: "radios",
  register: "0233",
  initialValue: "0",
  bitmap: "02",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},
// Prevent cards using the NFC-A protocol to enter T=CL / ISO DEP level
"reg0233_35gzn7y_ooba6wy": {
  fieldType: "radios",
  register: "0233",
  initialValue: "0",
  bitmap: "01",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},

"reg0234_35gzn7y_m6awtjl": {
  fieldType: "hidden",
  register: "0234",
  initialValue: "0",
  bitmap: "80",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},

"reg0234_35gzn7y_op23zml": {
  fieldType: "hidden",
  register: "0234",
  initialValue: "0",
  bitmap: "40",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},

"reg0234_35gzn7y_ax7h6sl": {
  fieldType: "hidden",
  register: "0234",
  initialValue: "0",
  bitmap: "20",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},

"reg0234_35gzn7y_t6r55rl": {
  fieldType: "hidden",
  register: "0234",
  initialValue: "0",
  bitmap: "10",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},

"reg0234_35gzn7y_eph722y": {
  fieldType: "hidden",
  register: "0234",
  initialValue: "0",
  bitmap: "08",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},

"reg0234_35gzn7y_riuquxn": {
  fieldType: "hidden",
  register: "0234",
  initialValue: "0",
  bitmap: "04",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},
// Use Innovatron T=0 ATR
"reg0234_35gzn7y_mdwlall": {
  fieldType: "radios",
  register: "0234",
  initialValue: "0",
  bitmap: "02",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},
// Control which values for NN are used in the ATR
"reg0234_35gzn7y_ooba6wy": {
  fieldType: "radios",
  register: "0234",
  initialValue: "0",
  bitmap: "01",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},
// Control EMD Suppression feature
"reg0237_m6awtjl": {
  fieldType: "radios",
  register: "0237",
  initialValue: "0",
  bitmap: "80",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},

"reg0237_spf4gny": {
  fieldType: "hidden",
  register: "0237",
  initialValue: "0",
  bitmap: "78",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},
// Comply with a specific subset of RF standards
"reg0237_kspmojd": {
  fieldType: "radios",
  register: "0237",
  initialValue: "0",
  bitmap: "07",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},

"reg023a_m6awtjl": {
  fieldType: "hidden",
  register: "023A",
  initialValue: "0",
  bitmap: "80",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},
// NFC Forum polling: bail-out after NFC-A response
"reg023a_op23zml": {
  fieldType: "checkbox",
  register: "023A",
  initialValue: false,
  bitmap: "40",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},

"reg023a_bgs5ckd": {
  fieldType: "hidden",
  register: "023A",
  initialValue: "0",
  bitmap: "3E",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},
// Control whether NFC-A uses Apple VAS Enhanced Contactless Polling
"reg023a_ooba6wy": {
  fieldType: "radios",
  register: "023A",
  initialValue: "0",
  bitmap: "01",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},

"reg023b_2kglign": {
  fieldType: "hidden",
  register: "023B",
  initialValue: "0",
  bitmap: "8000",
  isIndividual: false,
  registerDefaultValue: "0000", registerSize: 2,},
// NFC Forum polling: bail-out after NFC-B response
"reg023b_7wdxe6d": {
  fieldType: "checkbox",
  register: "023B",
  initialValue: false,
  bitmap: "4000",
  isIndividual: false,
  registerDefaultValue: "0000", registerSize: 2,},

"reg023b_nnfnpnd": {
  fieldType: "hidden",
  register: "023B",
  initialValue: "0",
  bitmap: "3E00",
  isIndividual: false,
  registerDefaultValue: "0000", registerSize: 2,},
// Control whether NFC-B uses extended ATQB or not
"reg023b_jv4bm2d": {
  fieldType: "radios",
  register: "023B",
  initialValue: "0",
  bitmap: "0100",
  isIndividual: false,
  registerDefaultValue: "0000", registerSize: 2,},
// AFI for NFC-B polling
"reg023b_gpg5rzd": {
  fieldType: "hex",
  register: "023B",
  initialValue: "00",
  bitmap: "00FF",
  isIndividual: false,
  registerDefaultValue: "0000", registerSize: 2,},

"reg023c_wyhiihy": {
  fieldType: "hidden",
  register: "023C",
  initialValue: "0",
  bitmap: "8000000000000000",
  isIndividual: false,
  registerDefaultValue: "00FFFF01000B0009", registerSize: 8,},
// NFC Forum polling: bail-out after NFC-F response
"reg023c_kq5se4n": {
  fieldType: "checkbox",
  register: "023C",
  initialValue: false,
  bitmap: "4000000000000000",
  isIndividual: false,
  registerDefaultValue: "00FFFF01000B0009", registerSize: 8,},

"reg023c_7ankq7y": {
  fieldType: "hidden",
  register: "023C",
  initialValue: "0",
  bitmap: "3C00000000000000",
  isIndividual: false,
  registerDefaultValue: "00FFFF01000B0009", registerSize: 8,},
// Control NFC-F bitrate: 212 and/or 424kbit/s
"reg023c_af7asbd": {
  fieldType: "radios",
  register: "023C",
  initialValue: "0",
  bitmap: "0300000000000000",
  isIndividual: false,
  registerDefaultValue: "00FFFF01000B0009", registerSize: 8,},
// System Code for NFC-F polling
"reg023c_b2lvaxl": {
  fieldType: "hex",
  register: "023C",
  initialValue: "FFFF",
  bitmap: "00FFFF0000000000",
  isIndividual: false,
  registerDefaultValue: "00FFFF01000B0009", registerSize: 8,},
// Request Code for NFC-F polling
"reg023c_iav4stl": {
  fieldType: "hex",
  register: "023C",
  initialValue: "01",
  bitmap: "000000FF00000000",
  isIndividual: false,
  registerDefaultValue: "00FFFF01000B0009", registerSize: 8,},
// Service Code used by READ BINARY with NFC-F cards
"reg023c_n756ral": {
  fieldType: "hex",
  register: "023C",
  initialValue: "000B",
  bitmap: "00000000FFFF0000",
  isIndividual: false,
  registerDefaultValue: "00FFFF01000B0009", registerSize: 8,},
// Service Code used by UPDATE BINARY with NFC-F cards
"reg023c_ehbhexd": {
  fieldType: "hex",
  register: "023C",
  initialValue: "0009",
  bitmap: "000000000000FFFF",
  isIndividual: false,
  registerDefaultValue: "00FFFF01000B0009", registerSize: 8,},

"reg023d_rj665vl": {
  fieldType: "hidden",
  register: "023D",
  initialValue: "0",
  bitmap: "FF00",
  isIndividual: false,
  registerDefaultValue: "0000", registerSize: 2,},
// AFI for NFC-V polling
"reg023d_gpg5rzd": {
  fieldType: "hex",
  register: "023D",
  initialValue: "00",
  bitmap: "00FF",
  isIndividual: false,
  registerDefaultValue: "0000", registerSize: 2,},
// Min. polling interval (10th of second)
"reg023e_lmh6e5y": {
  fieldType: "hex",
  register: "023E",
  initialValue: "00",
  bitmap: "FF0000",
  isIndividual: false,
  registerDefaultValue: "000000", registerSize: 3,},
// Min. time before restarting polling after card removal (10th of second)
"reg023e_gsqqlyn": {
  fieldType: "hex",
  register: "023E",
  initialValue: "00",
  bitmap: "00FF00",
  isIndividual: false,
  registerDefaultValue: "000000", registerSize: 3,},
// Shutdown RF if a card remains in the field during a long time (seconds)
"reg023e_rk4pgmy": {
  fieldType: "hex",
  register: "023E",
  initialValue: "00",
  bitmap: "0000FF",
  isIndividual: false,
  registerDefaultValue: "000000", registerSize: 3,},

"reg023f_lngy2qn": {
  fieldType: "hidden",
  register: "023F",
  initialValue: "0",
  bitmap: "FE0000",
  isIndividual: false,
  registerDefaultValue: "000000", registerSize: 3,},
// enable
"reg023f_5r4ewkl": {
  fieldType: "hex",
  register: "023F",
  initialValue: "00",
  bitmap: "010000",
  isIndividual: false,
  registerDefaultValue: "000000", registerSize: 3,},
// Defines test signal to be provided on AUX2
"reg023f_gsqqlyn": {
  fieldType: "hex",
  register: "023F",
  initialValue: "00",
  bitmap: "00FF00",
  isIndividual: false,
  registerDefaultValue: "000000", registerSize: 3,},
// Defines test signal to be provided on AUX1
"reg023f_rk4pgmy": {
  fieldType: "hex",
  register: "023F",
  initialValue: "00",
  bitmap: "0000FF",
  isIndividual: false,
  registerDefaultValue: "000000", registerSize: 3,},
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

"reg02e0_snvp4xd": {
  fieldType: "hidden",
  register: "02E0",
  initialValue: "0",
  bitmap: "FE",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},
// Be a NFC Tag on startup
"reg02e0_ooba6wy": {
  fieldType: "radios",
  register: "02E0",
  initialValue: "0",
  bitmap: "01",
  isIndividual: false,
  registerDefaultValue: "00", registerSize: 1,},
// Global Bytes for peer-to-peer communication
"reg02eb": {
  fieldType: "hex",
  register: "02EB",
  initialValue: "",
  bitmap: "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
  isIndividual: false,
  registerSize: 16,},
// Answer to Select in NFC Tag emulation mode
"reg02ec": {
  fieldType: "hex",
  register: "02EC",
  initialValue: "",
  bitmap: "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
  isIndividual: false,
  registerSize: 16,},
// NDEF message in NFC Tag emulation mode
"reg02ed": {
  fieldType: "hex",
  register: "02ED",
  initialValue: "",
  bitmap: "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
  isIndividual: false,
  registerSize: 64,},
};
