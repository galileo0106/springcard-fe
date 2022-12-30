import { Injectable } from '@angular/core';
import { IPlansList } from '@shared/models/Plan/iplanslist.model';
import { PlansList } from '@shared/billing/plans.list';
import { PlansOptionsAccessList } from '@shared/billing/plansoptionsacceseslist';
import { IPlanAccess } from '@shared/models/Plan/iplanaccess.model';
import { IPlansOptionsLabels } from '@shared/models/Plan/iplansoptionslabels.model';
import { AuthService } from './AuthService';

export enum Plans {
  Free = 'free',
  Single = 'single',
  Team = 'team',
}

export interface IOptionsList {
  [key: string]: string;
}
export interface IAllOptions {
  label: string;
  access: string;
}

@Injectable({
  providedIn: 'root',
})
export class PlanService {
  private _plansList = PlansList;
  private _plansOptionsAccesList = PlansOptionsAccessList;
  private _optionsList: IOptionsList = {};
  private _payingPlansList: string[] = []; // liste des plans payants

  constructor(private authService: AuthService) {
    // private http: HttpClient
    this.setOptionsPerPlan(); // Création de la liste consolidée des plans, on ajout les accès
    this.createListOfOptions(); // Liste, textuelle, des plans, clé = clé de l'option, valeur = label internationalisé
  }

  private createListOfOptions() {
    for (const plansOption of this._plansOptionsAccesList) {
      this._optionsList[plansOption.key] = plansOption.label;
    }
  }

  // Retourne la liste des plans payants en excluant ceux que possède l'utilisateur
  public getPayingPlansList() {
    return this._payingPlansList.join($localize`or`);
  }

  // Mise en place des options d'accès pour chaque plan
  private setOptionsPerPlan() {
    const consolidatedPlansListWithAccess: IPlansList[] = [];
    const currentUserPlan = this.authService.getTypeAsString();

    for (const existingPlan of this._plansList) {
      // Boucle sur tous les plans
      if (existingPlan.pricePerYear > 0) {
        // Construction de la liste des plans payants
        if (existingPlan.key !== currentUserPlan) {
          // Exclusion du plan actuellement détenu par l'utilisateur
          this._payingPlansList.push(existingPlan.label);
        }
      }
      const newPlanAccess: IPlanAccess[] = []; // Les accès du plan qu'on va créer
      for (const planAccess of this._plansOptionsAccesList) {
        // Boucle sur la liste de tous les accès
        const access: IPlanAccess = {
          key: planAccess.key,
          label: planAccess.label,
          access: '',
        };
        for (const planAccesAccess of planAccess.access) {
          if (existingPlan.key === planAccesAccess.planKey) {
            access.access = planAccesAccess.access;
          }
        }
        newPlanAccess.push(access);
      }
      existingPlan.access = newPlanAccess;
      consolidatedPlansListWithAccess.push(existingPlan);
    }
    this._plansList = consolidatedPlansListWithAccess;
  }

  // Recheche d'un plan à partir de son identifiant (de sa "clé" retournée dans GET /users/me)
  private getPlanDefinition(planKey: Plans): IPlansList | null {
    for (const plan of this._plansList) {
      if (plan.key === planKey) {
        return plan;
      }
    }
    return null;
  }

  // Retourne la liste de tous les plans
  get plans(): IPlansList[] {
    return this._plansList;
  }

  // Ne retourne que les plans payants
  get payingPlans(): IPlansList[] {
    const plans: IPlansList[] = [];
    for (const plan of this._plansList) {
      if (plan.pricePerYear > 0) {
        plans.push(plan);
      }
    }
    return plans;
  }

  // Retourne la liste complète des options d'accès
  get optionsList(): IOptionsList {
    return this._optionsList;
  }

  get plansOptionsAccesList(): IPlansOptionsLabels[] {
    return this._plansOptionsAccesList;
  }

  // Retourne la liste des fonctionnalités d'un plan
  public getPlanCapabilities(planKey: Plans): IPlansList | null {
    return this.getPlanDefinition(planKey);
  }

  // Retourne le plan courant de l'utilisateur, s'il en a un
  public getUserPlan(): IPlansList | null {
    if (!this.authService.isLoggedIn()) {
      return null;
    }
    const userAccountType = this.authService.getTypeAsString();
    if (userAccountType === '') {
      return null;
    }
    for (const plan of this._plansList) {
      if (plan.key === userAccountType) {
        return plan;
      }
    }
    return null;
  }
}
