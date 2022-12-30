import { ElementRef, Injectable } from '@angular/core';
import { UntypedFormGroup, ValidationErrors } from '@angular/forms';
import { Project } from '@shared/classes/Project';
import { IFormFieldValue, Registers } from '@shared/classes/Registers';
import { Subscription } from 'rxjs';
import { Subject } from 'rxjs';
import { getFieldValue } from '@shared/appSettings';
import { filter } from 'rxjs/operators';

export interface IFormError {
  control: string;
  error: string;
  value: any;
}

@Injectable()
export class FormsUtilsService {
  subscription: Subscription;
  public elementRef: ElementRef; // Un service ne peut pas se voir injecter ElementRef, putain de bordel de merde !
  private initialConfigurationFormValues: IFormFieldValue;
  readonly localStoragePrefix = 'sc_';
  project: Project;
  registers: Registers;
  slot = 0;
  form: UntypedFormGroup;
  projectComponentName = '';
  componentType = 0; // 0 = Ecran d'enregistrement de la configuration, 1 = Péripéhrique, 2 = Template NFC, 3 = Template BLE

  // Pour notifier les utilisateurs de ce service d'un changement _valide_ sur le formulaire
  observer = new Subject();
  public formChangesSubscriber$ = this.observer.asObservable();

  constructor() {}

  setFocusToFirstFieldWithError() {
    // @todo, est-ce que ce n'est pas ça qui provoque le message d'erreur ?
    const invalidElements = this.elementRef.nativeElement.querySelectorAll('input.ng-invalid');
    if (invalidElements.length > 0) {
      invalidElements[0].focus();
    }
  }

  saveFormInitialValues(form: UntypedFormGroup) {
    this.initialConfigurationFormValues = form.value; // @todohth
  }

  reloadFormInitalValues() {
    if (this.initialConfigurationFormValues) {
      this.form.reset();
      this.form.patchValue(this.initialConfigurationFormValues);
      this.form.updateValueAndValidity();
    }
  }

  /**
   * Mise en place des objets qui permettent de persister le contenu d'un formulaire de configuration d'un périphérique ou d'un template
   *
   * @param form  Le formulaire Angular qui contient la configuration
   * @param project Le project qui enregistre la configuration des différents composants
   * @param registers L'objet qui permet de calculer la valeur des registres
   * @param componentName Le nom du composant (de périphérique ou de template)
   * @param componentType Le type de composant, 0 = Ecran d'enregistrement de la configuration, 1 = Périphérique, 2 = Template NFC, 3 = Template BLE
   * @param slot Le numéro du slot (dans le cas d'un template) dans lequel on récupèré la configuration, -1 = Périphérique, -2 = Formulaire des paramètres de la config.
   */
  setWorkingObjects(form: UntypedFormGroup, project: Project, registers: Registers, componentName: string, componentType: number, slot: number) {
    this.form = form;
    this.project = project;
    this.registers = registers;
    this.projectComponentName = componentName;
    this.componentType = componentType;
    this.slot = slot;
  }

  createInitialFormValuesFromDefinition(form: UntypedFormGroup, fieldsDefinition: any) {
    const keys = Object.keys(fieldsDefinition);
    const initialFormValuesFromDefinition: IFormFieldValue = {};
    for (const key of keys) {
      initialFormValuesFromDefinition[key] = fieldsDefinition[key].initialValue;
    }
    form.patchValue(initialFormValuesFromDefinition);
    form.updateValueAndValidity();
  }

  /**
   * Utilisé pour le formulaire "simple" qui permet d'enregistrer une configuration vers le back office
   *
   * @param project Le project qui enregistre la configuration des différents composants
   * @param componentName Le nom du composant (de périphérique ou de template)
   * @param componentType Le type de composant, 0 = Ecran d'enregistrement de la configuration, 1 = Périphérique, 2 = Template NFC, 3 = Template BLE
   * @param slot Le numéro du slot (dans le cas d'un template) dans lequel on récupèré la configuration, -1 = Périphérique, -2 = Formulaire des paramètres de la config.
   */
  setParametersForLightForm(form: UntypedFormGroup, project: Project, componentName: string, componentType: number, slot: number) {
    this.form = form;
    this.project = project;
    this.projectComponentName = componentName;
    this.componentType = componentType;
    this.slot = slot;
  }

  // Sauvegarde des données du projet dans la localStorage (à chaque changement valide du formulaire de paramétrage)
  saveDataInProject() {
    const registers = this.componentType !== 0 ? this.registers.getRegistersAsJsonArray() : '';
    const angularFormContent = this.componentType !== 0 ? this.registers.getFormContent() : this.form.value; // @todohth, c'est là qu'on sauvegarde les données du formulaire et qu'on fait la conversion en valeur pour les registres
    this.project.setComponentConfiguration(
      this.projectComponentName,
      this.slot,
      JSON.stringify(angularFormContent),
      JSON.stringify(registers),
    );
    this.project.save();
  }

  startMonitoringFormToPersist() {
    this.subscription = this.form.valueChanges.pipe(filter(() => this.form.valid)).subscribe(() => {
      this.saveDataInProject();
      this.observer.next('Form Changed'); // Envoi d'un événement pour indiquer que le formulaire a changé
    });
  }

  stopMonitoringFormForPersisting() {
    this.subscription.unsubscribe();
  }

  getFormValidationErrors(form: UntypedFormGroup) {
    const result: IFormError[] = [];
    Object.keys(form.controls).forEach((key) => {
      const formProperty = form.get(key);
      if (formProperty instanceof UntypedFormGroup) {
        result.push(...this.getFormValidationErrors(formProperty));
      }

      if (formProperty?.errors !== null) {
        const controlErrors: ValidationErrors | undefined = formProperty?.errors;
        if (controlErrors) {
          Object.keys(controlErrors).forEach((keyError) => {
            result.push({
              control: key,
              error: keyError,
              value: controlErrors[keyError],
            });
          });
        }
      }
    });
    return result;
  }

  /**
   * Affiche ou masque un groupe de champs en fonction d'une condition qui porte sur un champ
   *
   * @param form          Le formulaire qui contient le champs
   * @param fieldName     Le nom du champ qui sert dans la condition
   * @param compareValue  La valeur à trouver pour afficher le groupe de champs
   */
  showHideFormGroup(form: UntypedFormGroup, fieldName: string, compareValue: string) {
    return getFieldValue(form, fieldName) === compareValue;
  }
}
