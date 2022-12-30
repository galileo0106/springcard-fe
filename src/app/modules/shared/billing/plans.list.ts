import { IPlansList } from '@shared/models/Plan/iplanslist.model';

// Liste de tous les plans avec un résumé, une description, un prix par mois et  par an, le plan "suivant" et "précédent" et toutes les options du plan
export const PlansList: IPlansList[] = [
  {
    key: 'free',
    label: `Free`,
    summary: $localize`Summary free`,
    description: $localize`Description free`,
    pricePerMonth: 0,
    pricePerYear: 0,
    upgradeTo: 'single',
    downgradeTo: '',
  },
  {
    key: 'single',
    label: `Single User`,
    summary: $localize`Summary single`,
    description: $localize`Descrition single`,
    pricePerMonth: 38,
    pricePerYear: 456,
    upgradeTo: 'team',
    downgradeTo: 'free',
  },
  {
    key: 'team',
    label: `Team`,
    summary: $localize`Summary team`,
    description: $localize`Descrition team`,
    pricePerMonth: 295,
    pricePerYear: 3540,
    upgradeTo: '',
    downgradeTo: 'single',
  },
];
