/**
 * La définition de chacun des champs qui permettent de composer les valeurs des registres
 */
export const IndividualsFieldsDefinition = {
// Inventory number
"reg0201": {
  fieldType: "text",
  register: "0201",
  initialValue: "",
  bitmap: "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
  isIndividual: true,
  registerSize: 16,},
// Location
"reg0202": {
  fieldType: "text",
  register: "0202",
  initialValue: "",
  bitmap: "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
  isIndividual: true,
  registerSize: 16,},
// License key
"reg0209": {
  fieldType: "text",
  register: "0209",
  initialValue: "",
  bitmap: "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
  isIndividual: true,
  registerSize: 32,},
// License cryptogram
"reg020a": {
  fieldType: "hex",
  register: "020A",
  initialValue: "",
  bitmap: "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
  isIndividual: true,
  registerSize: 32,},
// Network address (`00000000` to enable DHCP)
"reg0280_555555y": {
  fieldType: "ip",
  register: "0280",
  initialValue: "0",
  bitmap: "FFFFFFFF00000000000000000000000000000000",
  isIndividual: true,
  registerDefaultValue: "0000000000000000000000000000000000000000", registerSize: 20,},
// Network mask  (`FFFFFF00` for a class C subnet)
"reg0280_vqlq6ky": {
  fieldType: "ip",
  register: "0280",
  initialValue: "0",
  bitmap: "00000000FFFFFFFF000000000000000000000000",
  isIndividual: true,
  registerDefaultValue: "0000000000000000000000000000000000000000", registerSize: 20,},
// Default gateway (`00000000` to disable routing)
"reg0280_s25rcml": {
  fieldType: "ip",
  register: "0280",
  initialValue: "0",
  bitmap: "0000000000000000FFFFFFFF0000000000000000",
  isIndividual: true,
  registerDefaultValue: "0000000000000000000000000000000000000000", registerSize: 20,},
// 1st name server
"reg0280_qocj7wy": {
  fieldType: "ip",
  register: "0280",
  initialValue: "0",
  bitmap: "000000000000000000000000FFFFFFFF00000000",
  isIndividual: true,
  registerDefaultValue: "0000000000000000000000000000000000000000", registerSize: 20,},
// 2nd name server
"reg0280_rxuj7ed": {
  fieldType: "ip",
  register: "0280",
  initialValue: "0",
  bitmap: "00000000000000000000000000000000FFFFFFFF",
  isIndividual: true,
  registerDefaultValue: "0000000000000000000000000000000000000000", registerSize: 20,},
// IPv6 Settings
"reg0281": {
  fieldType: "hex",
  register: "0281",
  initialValue: "00000000000000000000000000000000",
  bitmap: "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
  isIndividual: true,
  registerDefaultValue: "00000000000000000000000000000000", registerSize: 16,},
// User password
"reg02fe": {
  fieldType: "text",
  register: "02FE",
  initialValue: "springcard",
  bitmap: "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
  isIndividual: true,
  registerDefaultValue: "737072696E6763617264", registerSize: 16,},
// Admin password
"reg02ff": {
  fieldType: "text",
  register: "02FF",
  initialValue: "springcardmaster",
  bitmap: "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
  isIndividual: true,
  registerDefaultValue: "737072696E67636172646D6173746572", registerSize: 16,},
// User Device Name
"reg0244": {
  fieldType: "text",
  register: "0244",
  initialValue: "",
  bitmap: "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
  isIndividual: true,
  registerSize: 29,},
};
