import { ModelsService } from '@shared/services/models.service';
import { Component, Inject, Injectable } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ElectronService } from '../../../providers/electron.service';
import { IInputField } from '@shared/models/UI/IinputField.model';
import { IDuplicateConfiguration } from '@shared/models/Configuration/iduplicateconfiguration.model';
import { IConfigurationFormSettings } from '@shared/models/Configuration/iconfiguration.form.settings.interface';
import { IConfigurationFormSettingsAnswer } from '@shared/models/Configuration/iconfiguration.form.settings.answer.interface';
import { IModelDialog } from '@shared/models/Models/imodeldialog.answer.interface';
import { IModelGroup } from '@shared/models/Models/imodelgroup.model';
import { HttpErrorResponse } from '@angular/common/http';
import { IModel } from '@shared/models/Models/imodel.model';
import { IReadersList } from '@shared/models/Reader/ireaderslist.model';
import { ISelectReader } from '@shared/models/Reader/iselectedreader.model';

/**
 * Manage some dialogs of the application ("retry / quit", "Yes / No")
 */
@Injectable()
export class DialogsService {
  private isElectronApp: boolean;

  constructor(private dialog: MatDialog, private electron: ElectronService) {
    this.isElectronApp = this.electron.isElectronApp();
  }

  /**
   * Display a retry quit/cancel dialog box
   *
   * The first button is 'Retry'
   * If we are in the Electron app, the second button is 'Quit' else it's 'Cancel'
   */
  retryQuit(dialogTitle: string, dialogMessage: string): Observable<any> {
    return new Observable((observer) => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true; // Set the dialog as modal
      dialogConfig.autoFocus = true;
      // dialogConfig.hasBackdrop = true; // Default value !
      dialogConfig.data = {
        title: dialogTitle,
        message: dialogMessage,
        button: '',
      };
      dialogConfig.data.quitOrCancel = this.isElectronApp ? $localize`Quit` : $localize`Cancel`;
      const dialogRetryCancel = this.dialog.open(RetryCancelDialog, dialogConfig);
      dialogRetryCancel.afterClosed().subscribe(() => {
        observer.next(dialogConfig.data.button);
        observer.complete();
      });
    });
  }

  showOkMessage(dialogTitle: string, dialogMessage: string): Observable<any> {
    return new Observable((observer) => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = {
        title: dialogTitle,
        message: dialogMessage,
        button: '',
      };
      const dialogOkMessage = this.dialog.open(ShowOkDialog, dialogConfig);
      dialogOkMessage.afterClosed().subscribe(() => {
        observer.next(dialogConfig.data.button);
        observer.complete();
      });
    });
  }

  /**
   * Display a "Yes", "No", "Cancel" dialog box
   *
   * @param dialogTitle Dialog box title
   * @param dialogMessage Dialog box message
   * @param withCancelButton Do we also display the "Cancel" button
   */
  yesNoCancel(
    dialogTitle: string,
    dialogMessage: string,
    withCancelButton: boolean = false,
    yesText = $localize`Yes`,
    noText = $localize`No`,
  ): Observable<any> {
    return new Observable((observer) => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true; // Set the dialog as modal
      dialogConfig.autoFocus = true;
      dialogConfig.data = {
        title: dialogTitle,
        message: dialogMessage,
        button: '',
        withCancel: withCancelButton,
        yesButton: yesText,
        noButton: noText,
      };
      const dialogYesNoCancel = this.dialog.open(YesNoCancelDialog, dialogConfig);
      dialogYesNoCancel.afterClosed().subscribe(() => {
        observer.next(dialogConfig.data.button);
        observer.complete();
      });
    });
  }

  /**
   * Affiche une boîte de dialogue "oui" "non" et retourne un observable de type booléen
   * Utilisé dans les composants qui ne permettent pas de sortir de l'écran sans le confirmer
   *
   * @param dialogTitle Dialog box title
   * @param dialogMessage Dialog box message
   * @param withCancelButton Do we also display the "Cancel" button
   */
  yesNo(dialogTitle: string, dialogMessage: string, yesText = $localize`Yes`, noText = $localize`No`): Observable<boolean> {
    return new Observable((observer) => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true; // Set the dialog as modal
      dialogConfig.autoFocus = true;
      dialogConfig.data = {
        title: dialogTitle,
        message: dialogMessage,
        button: '',
        withCancel: false,
        yesButton: yesText,
        noButton: noText,
      };
      const dialogYesNoCancel = this.dialog.open(YesNoCancelDialog, dialogConfig);
      dialogYesNoCancel.afterClosed().subscribe(() => {
        observer.next(dialogConfig.data.button === 'yes' ? true : false);
        observer.complete();
      });
    });
  }

  // Permet de saisir une valeur dans un champ
  inputField(
    dialogTitle: string,
    dialogMessage: string,
    dialogFormFieldLabel: string,
    dialogOkText: string,
    dialogCancelText: string,
    inputType = 'text',
    dialogIcon = 'question_answer',
    showShareWithSupport = false,
  ): Observable<IInputField> {
    return new Observable((observer) => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true; // Set the dialog as modal
      dialogConfig.autoFocus = true;
      dialogConfig.data = {
        icon: dialogIcon,
        title: dialogTitle,
        message: dialogMessage,
        formfieldLabel: dialogFormFieldLabel,
        ok: dialogOkText,
        cancel: dialogCancelText,
        okClicked: false,
        fieldInputType: inputType,
        answer: '',
        showShareWithSupport: showShareWithSupport,
      };
      const dialogInput = this.dialog.open(InputDialog, dialogConfig);
      dialogInput.afterClosed().subscribe(() => {
        observer.next(dialogConfig.data);
        observer.complete();
      });
    });
  }

  duplicateConfigurationModal(originalTitle: string, originalDescription?: string): Observable<IDuplicateConfiguration> {
    return new Observable((observer) => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true; // Set the dialog as modal
      dialogConfig.autoFocus = true;
      dialogConfig.data = {
        title: originalTitle + $localize`(duplicated)`,
        description: originalDescription,
        okClicked: false,
      };
      const dialogDuplicateConfig = this.dialog.open(DuplicateConfigurationDialog, dialogConfig);
      dialogDuplicateConfig.afterClosed().subscribe(() => {
        observer.next(dialogConfig.data);
        observer.complete();
      });
    });
  }

  // Permet de changer les paramètres d'une configuration (nom, titre, description, favoris)
  setConfigurationFormSettings(formSettings: IConfigurationFormSettings): Observable<IConfigurationFormSettingsAnswer> {
    return new Observable((observer) => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true; // Set the dialog as modal
      dialogConfig.autoFocus = true;
      dialogConfig.data = {
        title: formSettings.title,
        description: formSettings.description,
        isFavorite: formSettings.isFavorite,
        okClicked: false,
      };
      const dialogConfigurationFormSettings = this.dialog.open(ConfigurationFormSettingsDialog, dialogConfig);
      dialogConfigurationFormSettings.afterClosed().subscribe(() => {
        observer.next(dialogConfig.data);
        observer.complete();
      });
    });
  }

  selectApduModel(): Observable<IModelDialog> {
    return new Observable((observer) => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true; // Set the dialog as modal
      dialogConfig.autoFocus = true;
      dialogConfig.data = {
        modelId: 0,
        groupId: 0,
        okClicked: false,
        search: '',
      };
      const dialogApduModel = this.dialog.open(SelectModelApduDialog, dialogConfig);
      dialogApduModel.afterClosed().subscribe(() => {
        observer.next(dialogConfig.data);
        observer.complete();
      });
    });
  }

  selectReader(readersList: IReadersList[], currentReaderId: string): Observable<ISelectReader> {
    return new Observable((observer) => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true; // Set the dialog as modal
      dialogConfig.autoFocus = true;
      dialogConfig.data = {
        readerId: currentReaderId,
        readerName: '',
        readersList: readersList,
        okClicked: false,
      };
      const dialogReaderSelect = this.dialog.open(SelectSlotDialog, dialogConfig);
      dialogReaderSelect.afterClosed().subscribe(() => {
        observer.next(dialogConfig.data);
        observer.complete();
      });
    });
  }
}

@Component({
  selector: 'retry-cancel-dialog',
  templateUrl: 'retry-cancel-dialog.html',
})
export class RetryCancelDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.data = data;
  }

  retry() {
    this.data.button = 'retry';
  }

  cancel() {
    this.data.button = 'cancel';
  }
}

@Component({
  selector: 'show-ok-dialog',
  templateUrl: 'show-ok-dialog.html',
})
export class ShowOkDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.data = data;
  }

  ok() {
    this.data.button = 'ok';
  }
}

@Component({
  selector: 'yes-no-cancel-dialog',
  templateUrl: 'yes-no-cancel-dialog.html',
})
export class YesNoCancelDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.data = data;
  }

  setDataButton(text: string) {
    this.data.button = text;
  }
}

@Component({
  selector: 'input-dialog',
  templateUrl: 'input-dialog.html',
})
export class InputDialog {
  isSharingWithSupport = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.data = data;
  }

  shareWithSupport() {
    if (this.isSharingWithSupport) {
      this.data.answer = 'support@springcard.com';
    }
  }

  setValidationState(ok: boolean) {
    this.data.okClicked = ok;
  }
}

@Component({
  selector: 'duplicate-configuration-dialog',
  templateUrl: 'duplicate-configuration-dialog.html',
})
export class DuplicateConfigurationDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.data = data;
  }

  setValidationState(ok: boolean) {
    this.data.okClicked = ok;
  }
}

@Component({
  selector: 'configuration-form-settings-dialog',
  templateUrl: 'configuration-form-settings-dialog.html',
})
export class ConfigurationFormSettingsDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.data = data;
  }

  setValidationState(ok: boolean) {
    this.data.okClicked = ok;
  }
}

@Component({
  selector: 'select-model-apdu-dialog',
  templateUrl: 'models-dialog.html',
})
export class SelectModelApduDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private modelsService: ModelsService) {
    this.data = data;
    this.loadGroups();
    this.loadModels();
  }

  loadGroups() {
    this.modelsService.getGroups().subscribe(
      (groups: IModelGroup[]) => {
        this.data.groups = groups;
      },
      (error: HttpErrorResponse) => {
        console.error('Error while loading the list of groups');
        console.error(error);
      },
    );
  }

  search() {
    this.data.models = this.data.originalModels;
    const text = this.data.search.toLowerCase();
    if (!text || text.trim() === '') {
      return;
    }
    const results = this.data.models.filter((item: IModel) => item.title.toLowerCase().includes(text));
    this.data.models = results;
  }

  loadModels() {
    const groupId = parseInt(this.data.groupId, 10);
    if (groupId === 0) {
      // Tous les modèles de tous les groupes
      this.modelsService.getModels().subscribe(
        (models: IModel[]) => {
          this.data.originalModels = models;
          this.data.models = models;
        },
        (error: HttpErrorResponse) => {
          console.error('Error while loading the list of models');
          console.error(error);
        },
      );
    } else {
      // Les modèles d'un groupe
      this.modelsService.getModelsFromGroup(groupId).subscribe(
        (models: IModel[]) => {
          this.data.models = models;
          this.data.originalModels = models;
        },
        (error: HttpErrorResponse) => {
          console.error('Error while loading the list of models');
          console.error(error);
        },
      );
    }
  }

  setValidationState(ok: boolean) {
    this.data.okClicked = ok;
  }
}

@Component({
  selector: 'select-slot-dialog',
  templateUrl: 'select-slot-dialog.html',
})
export class SelectSlotDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.data = data;
  }

  setValidationState(ok: boolean) {
    if (ok) {
      for (const reader of this.data.readersList) {
        if (reader.readerId === this.data.readerId) {
          this.data.readerName = reader.readerName;
        }
      }
    }
    this.data.okClicked = ok;
  }
}
