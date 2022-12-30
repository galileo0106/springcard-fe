import { IPlansOptionsLabels } from '@shared/models/Plan/iplansoptionslabels.model';

export const PlansOptionsAccessList: IPlansOptionsLabels[] = [
  {
    key: 'listUsbConnectedDevices',
    label: $localize`List the products connected by USB to the machine`,
    access: [
      {
        planKey: 'free',
        access: $localize`Yes`,
      },
      {
        planKey: 'single',
        access: $localize`Yes`,
      },
      {
        planKey: 'team',
        access: $localize`Yes`,
      },
    ],
  },
  {
    key: 'MemorizeListedProductsHistory',
    label: $localize`Memorization of the history of listed products`,
    access: [
      {
        planKey: 'free',
        access: $localize`No`,
      },
      {
        planKey: 'single',
        access: $localize`No`,
      },
      {
        planKey: 'team',
        access: $localize`Yes`,
      },
    ],
  },
  {
    key: 'InformOfNewFirmware',
    label: $localize`View the firmware version of my products and report if a more recent version is available`,
    access: [
      {
        planKey: 'free',
        access: $localize`Yes`,
      },
      {
        planKey: 'single',
        access: $localize`Yes`,
      },
      {
        planKey: 'team',
        access: $localize`Yes`,
      },
    ],
  },
  {
    key: 'flashFirmware',
    label: $localize`Load firmware into a product`,
    access: [
      {
        planKey: 'free',
        access: $localize`Max 10 products/year`,
      },
      {
        planKey: 'single',
        access: $localize`Max 100 products/year`,
      },
      {
        planKey: 'team',
        access: $localize`No limit`,
      },
    ],
  },
  {
    key: 'memorizeFirmwaresLoaded',
    label: $localize`Memorization of firmware upload history`,
    access: [
      {
        planKey: 'free',
        access: $localize`No`,
      },
      {
        planKey: 'single',
        access: $localize`Yes`,
      },
      {
        planKey: 'team',
        access: $localize`Yes`,
      },
    ],
  },
  {
    key: 'loadConfiguration',
    label: $localize`Load a configuration into a product`,
    access: [
      {
        planKey: 'free',
        access: $localize`Max 10 products/year`,
      },
      {
        planKey: 'single',
        access: $localize`Max 100 products/year`,
      },
      {
        planKey: 'team',
        access: $localize`No limit`,
      },
    ],
  },
  {
    key: 'createConfigurations',
    label: $localize`Create / edit configurations, manage a list of configurations`,
    access: [
      {
        planKey: 'free',
        access: $localize`Max 10 configurations`,
      },
      {
        planKey: 'single',
        access: $localize`No limit`,
      },
      {
        planKey: 'team',
        access: $localize`No limit`,
      },
    ],
  },
  {
    key: 'memorizeConfigurationsHistory',
    label: $localize`Memorization of the history of the configurations that I save`,
    access: [
      {
        planKey: 'free',
        access: $localize`No`,
      },
      {
        planKey: 'single',
        access: $localize`Yes`,
      },
      {
        planKey: 'team',
        access: $localize`Yes`,
      },
    ],
  },
  {
    key: 'getConfigurationFromSupport',
    label: $localize`Receive a copy of a configuration transmitted by the support`,
    access: [
      {
        planKey: 'free',
        access: $localize`Yes`,
      },
      {
        planKey: 'single',
        access: $localize`Yes`,
      },
      {
        planKey: 'team',
        access: $localize`Yes`,
      },
    ],
  },
  {
    key: 'sendConfigurationToSupport',
    label: $localize`Send a copy of one of its configurations to support`,
    access: [
      {
        planKey: 'free',
        access: $localize`Yes`,
      },
      {
        planKey: 'single',
        access: $localize`Yes`,
      },
      {
        planKey: 'team',
        access: $localize`Yes`,
      },
    ],
  },
  {
    key: 'getConfigurationFromOtherUser',
    label: $localize`Receive a copy of a configuration transmitted by another user`,
    access: [
      {
        planKey: 'free',
        access: $localize`No`,
      },
      {
        planKey: 'single',
        access: $localize`Yes`,
      },
      {
        planKey: 'team',
        access: $localize`Yes`,
      },
    ],
  },
  {
    key: 'sendConfigurationToOtherUser',
    label: $localize`Send a copy of one of its configurations to another user, even if they are not from the same company or are using the free version`,
    access: [
      {
        planKey: 'free',
        access: $localize`No`,
      },
      {
        planKey: 'single',
        access: $localize`No`,
      },
      {
        planKey: 'team',
        access: $localize`Yes`,
      },
    ],
  },
  {
    key: 'shareConfigurationsWithTeamMembers',
    label: $localize`Share all my configurations (read-only but copyable) with all users of the company`,
    access: [
      {
        planKey: 'free',
        access: $localize`No`,
      },
      {
        planKey: 'single',
        access: $localize`No`,
      },
      {
        planKey: 'team',
        access: $localize`Yes`,
      },
    ],
  },
  {
    key: 'enterInventoryData',
    label: $localize`Enter inventory information in the configuration of each product`,
    access: [
      {
        planKey: 'free',
        access: $localize`No`,
      },
      {
        planKey: 'single',
        access: $localize`Yes`,
      },
      {
        planKey: 'team',
        access: $localize`Yes`,
      },
    ],
  },
];
