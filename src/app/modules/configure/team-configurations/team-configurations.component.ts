import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { getFieldValue } from '@shared/appSettings';
import { IConfigurationList } from '@shared/models/Configuration/configuration.list.model';
//import { IProductsConfigurationList } from '@shared/models/IProductsConfigurationList.model';
import { IMe } from '@shared/models/User/me.model';
import { ApplicationService } from '@shared/services/application.service';
import { AuthService } from '@shared/services/AuthService';
import { ConfigurationsService } from '@shared/services/configurations.service';
import { CurrentTitleService } from '@shared/services/current-title.service';
import { DialogsService } from '@shared/services/dialogs.service';
import { Observable } from 'rxjs';

/**
 * Affiche la liste des membres de l'équipe, la liste de leurs configurations et permet d'en importer une
 */
@Component({
  selector: 'app-team-configurations',
  templateUrl: './team-configurations.component.html',
  styleUrls: ['./team-configurations.component.scss'],
})
export class TeamConfigurationsComponent implements OnInit {
  teamMembers: IMe[] = [];
  asyncOperation = false;
  teamMemberEmail = '';

  isImportingConfiguration = false;
  configurationsLoaded = false;
  configurations$: IConfigurationList[] = [];
  public configurationsDataSource: Observable<any[]>;
  public displayedColumns = ['title', 'description', 'created', 'modified', 'product', 'author']; // , 'actions'
  teamMembersForm: UntypedFormGroup;
  //userProductsList: IProductsConfigurationList[] = [];

  constructor(
    private currentTitleService: CurrentTitleService,
    private app: ApplicationService,
    private dialogsService: DialogsService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private configurationsService: ConfigurationsService,
  ) {
    this.currentTitleService.changeTitle($localize`Your team's configurations`);
  }

  ngOnInit(): void {
    this.isMemberOfTeam();
    this.getTeamMembersList();
    this.teamMembersForm = new UntypedFormGroup({
      members: new UntypedFormControl(),
    });
  }

  // Vérifie que l'utilisateur est bien membre d'une équipe et si ce n'est pas le cas, on le jette comme un mal propre
  isMemberOfTeam() {
    if (this.authService.getType() !== 2) {
      this.snackBar.open($localize`You are not member of a team`, $localize`Error`, {
        duration: 7000,
      });
      this.router.navigate(['/']);
    }
  }

  // Récupère l'utilisateur sélectionné et charge sa liste de configurations
  loadMemberConfigurationList() {
    const member = getFieldValue(this.teamMembersForm, 'members');
    if (member === null) {
      return;
    }
    this.teamMemberEmail = member;
    this.getConfigurationsList();
  }

  // Retourne la liste des membres de l'équipe (en excluant l'utilisateur courant)
  getTeamMembersList() {
    this.asyncOperation = true;
    this.authService.getTeamMembersList().subscribe(
      (profiles: IMe[]) => {
        this.asyncOperation = false;
        this.teamMembers = profiles;
      },
      (error: HttpErrorResponse) => {
        this.asyncOperation = false;
        console.error('Error while getting the list of the members of the team', error);
        const title = $localize`Error during a network request`;
        const message = $localize`There was an error while asking for the list of members of your team:` + '\n' + error.message;
        this.dialogsService.retryQuit(title, message).subscribe({
          next: (button) => {
            if (button === 'retry') {
              this.getTeamMembersList();
            } else {
              this.app.appQuitOrCancel();
            }
          },
        });
      },
    );
  }

  // Charge la liste des configurations d'un utilisateur
  public getConfigurationsList() {
    if (this.teamMemberEmail.trim() === '') {
      return;
    }
    this.configurationsLoaded = false;
    this.asyncOperation = true;
    this.configurationsDataSource = new Observable<any[]>();
    this.configurationsDataSource = this.configurationsService.getTeamUserConfigurationsList(this.teamMemberEmail);
    this.configurationsDataSource.subscribe({
      next: (configurations: IConfigurationList[]) => {
        this.asyncOperation = false;
        this.configurations$ = configurations;
      },
      error: (error) => {
        this.asyncOperation = false;
        console.error('Error while getting the list of user configurations', error);
        const title = $localize`Error during a network request`;
        const message = $localize`There was an error while asking for the list of your configurations list:` + '\n' + error.message;
        this.dialogsService.retryQuit(title, message).subscribe({
          next: (button) => {
            if (button === 'retry') {
              this.getConfigurationsList();
            } else {
              this.app.appQuitOrCancel();
            }
          },
        });
      },
      complete: () => (this.configurationsLoaded = true),
    });
  }

  // Routeur vers les actions sur les configurations
  actionOnConfiguration(configurationId: number, action: string) {
    switch (action.trim().toLowerCase()) {
      case 'import':
        this.dialogsService.yesNo($localize`Import configuration`, $localize`Do you really want to import this configuration?`).subscribe({
          next: (button) => {
            if (button === true) {
              this.importConfiguration(configurationId);
            }
          },
        });
        break;
    }
  }

  // Demande l'import d'une configuration
  importConfiguration(id: number) {
    this.asyncOperation = true;
    this.configurationsService.importTeamMemberConfiguration(id).subscribe(
      () => {
        this.asyncOperation = false;
        this.snackBar.open($localize`The configuration was imported with success`, $localize`Success`, {
          duration: 4000,
        });
      },
      (error: HttpErrorResponse) => {
        this.asyncOperation = false;
        console.error('Error while importing the configuration', error);
        const title = $localize`Error during a network request`;
        const message = $localize`There was an error while importing the configuration:` + '\n' + error.message;
        this.dialogsService.retryQuit(title, message).subscribe({
          next: (button) => {
            if (button === 'retry') {
              this.importConfiguration(id);
            } else {
              this.app.appQuitOrCancel();
            }
          },
        });
      },
    );
  }
}
