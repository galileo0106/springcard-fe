import { UntypedFormControl } from '@angular/forms';
// @ts-ignore
import { Validators } from '@angular/forms';
// @ts-ignore
import { hexadecimalValidator } from '@shared/directives/hexadecimal.directive';
// @ts-ignore
import { ipValidator } from '@shared/directives/ip.directive';

export const IndividualsFormGroup = {
  reg0201: new UntypedFormControl({ value: "", disabled: false}, [Validators.maxLength(16)]),
  reg0202: new UntypedFormControl({ value: "", disabled: false}, [Validators.maxLength(16)]),
  reg0209: new UntypedFormControl({ value: "", disabled: false}, [Validators.maxLength(32)]),
  reg020a: new UntypedFormControl({ value: "", disabled: false}, [hexadecimalValidator(null, null), Validators.minLength(0), Validators.maxLength(64)]),
  id7652_Note: new UntypedFormControl({ value: "", disabled: false}),
  reg0280_555555y: new UntypedFormControl({ value: "0", disabled: false}, [ipValidator()]),
  dhcpStatic_0280: new UntypedFormControl({ value: "dhcp", disabled: false}),
  reg0280_vqlq6ky: new UntypedFormControl({ value: "0", disabled: false}, [ipValidator()]),
  reg0280_s25rcml: new UntypedFormControl({ value: "0", disabled: false}, [ipValidator()]),
  reg0280_qocj7wy: new UntypedFormControl({ value: "0", disabled: false}, [ipValidator()]),
  reg0280_rxuj7ed: new UntypedFormControl({ value: "0", disabled: false}, [ipValidator()]),
  reg0281: new UntypedFormControl({ value: "00000000000000000000000000000000", disabled: false}, [hexadecimalValidator(null, null), Validators.minLength(32), Validators.maxLength(32)]),
  reg02fe: new UntypedFormControl({ value: "springcard", disabled: false}, [Validators.maxLength(16)]),
  reg02ff: new UntypedFormControl({ value: "springcardmaster", disabled: false}, [Validators.maxLength(16)]),
  reg0244: new UntypedFormControl({ value: "", disabled: false}, [Validators.maxLength(29)])
};