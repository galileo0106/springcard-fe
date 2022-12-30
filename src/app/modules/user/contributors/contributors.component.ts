import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { IMe } from '@shared/models/User/me.model';
import { ApplicationService } from '@shared/services/application.service';
import { AuthService } from '@shared/services/AuthService';
import { CurrentTitleService } from '@shared/services/current-title.service';
import { DialogsService } from '@shared/services/dialogs.service';
import { Observable, Subscription } from 'rxjs';
import { ITopButton } from '@shared/models/UI/topbutton.model';
import { TopButtonsService } from '@shared/services/top-buttons.service';
import { IButtonClick } from '@shared/models/UI/ibuttonclick.model';
import { IChangeTeamMemberStatus } from '@shared/models/Team/ichangeteammemberstatus.model';
import { IJsonSuccessResponse } from '@shared/models/ijson.success.response.model';
import { IJwtError } from '@shared/models/IJwtError.model';
import { CsvDataService } from '@shared/services/csv.data.service';
import { Misc } from '@shared/classes/Misc';

/**
 * Affiche la liste des membres d'une équipe, permet de les gérer et d'ajouter des membres
 * accès par /contributors
 */
@Component({
  selector: 'app-contributors',
  templateUrl: './contributors.component.html',
  styleUrls: ['./contributors.component.scss'],
})
export class ContributorsComponent implements OnInit, OnDestroy {
  asyncOperation = false;
  addingNewUser = false;
  newUserForm: UntypedFormGroup;
  teamMembers: IMe[] = [];
  userProfile: IMe;
  isCreationgNewAccount = false; // Est-ce qu'on est en train de créer un nouveau compte ?
  public membersDataSource: Observable<any[]>;
  public displayedColumns = [
    'full_name',
    'email',
    'is_admin_of_team',
    'created',
    'last_connection',
    'configurations_count',
    'devices_count',
    'flash_count',
  ];
  private topButtons = Array<ITopButton>();
  private buttonsClickSubscriber: Subscription;

  constructor(
    private currentTitleService: CurrentTitleService,
    private app: ApplicationService,
    private dialogsService: DialogsService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private fb: UntypedFormBuilder,
    private topButtonsService: TopButtonsService,
    private csvDataService: CsvDataService,
  ) {
    this.currentTitleService.changeTitle($localize`Team members`);
  }

  ngOnInit(): void {
    this.isMemberOfTeam();
    this.createNewUserForm();
    this.getTeamMembersList();
    this.setTopButtons();
  }

  ngOnDestroy() {
    this.buttonsClickSubscriber.unsubscribe();
    this.topButtonsService.removeTopButtons();
  }

  setTopButtons() {
    this.topButtons = [
      {
        label: $localize`Refresh`,
        color: 'warm',
        type: 'icon-button',
        id: 'refreshList',
        icon: 'refresh',
        tooltip: $localize`Refresh now`
      },
      {
        label: $localize`Invite new user`,
        color: 'warm',
        type: 'raised-button',
        id: 'addNewUser',
      },
      {
        label: $localize`Export all team data to csv`,
        color: 'warm',
        type: 'raised-button',
        id: 'exportTeamData',
      },
    ];

    // Set buttons in the top of the screen
    this.topButtonsService.setTopButtons(this.topButtons);

    // And subscribe to their clicks
    this.buttonsClickSubscriber = this.topButtonsService.buttonsClicks.subscribe((buttonParameters: IButtonClick) => {
      switch (buttonParameters.id) {
        case 'refreshList':
          this.getTeamMembersList();
          break;

        case 'addNewUser':
          this.addingNewUser = true;
          this.isCreationgNewAccount = true;
          break;

        case 'exportTeamData':
          this.exportTeamData();
          break;
      }
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

  // Retourne la liste des membres de l'équipe (en excluant l'utilisateur courant)
  getTeamMembersList() {
    this.asyncOperation = true;
    this.membersDataSource = new Observable<any[]>();
    this.membersDataSource = this.authService.getTeamMembersList();
    this.membersDataSource.subscribe(
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

  // Création du formulaire qui permet de créer un nouvel utilisateur
  private createNewUserForm() {
    this.newUserForm = this.fb.group({
      full_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      is_admin: [false, [Validators.required]],
    });
  }

  // On peut cacher les infos
  canHideEditingProfile() {
    this.addingNewUser = false;
    this.getTeamMembersList();
  }

  // Recherche d'un membre de l'équipe depuis la liste des membres
  private getTeamMemberFromEmail(email: string): IMe | null {
    for (const teamMember of this.teamMembers) {
      if (teamMember.email === email) {
        return teamMember;
      }
    }
    return null;
  }

  // Changement du statut d'admin d'un utilisateur
  private changeUserAdminStatus(email: string) {
    const member = this.getTeamMemberFromEmail(email);
    if (member === null) {
      return;
    }
    const newStatus = !member.is_admin_of_team;
    const userAdminStatus: IChangeTeamMemberStatus = {
      email: email,
      admin: newStatus,
    };
    this.asyncOperation = true;
    this.authService.changeTeamUserAdminStatus(userAdminStatus).subscribe(
      (response: IJsonSuccessResponse | IJwtError) => {
        this.asyncOperation = false;
        let message = '';
        let title = '';
        if (response.Result === 'success') {
          message = $localize`User status changed with success.`;
          title = $localize`Success`;
          this.getTeamMembersList();
        } else {
          message = (response as IJwtError).Message;
          title = $localize`Error while changing the user admin status`;
        }
        this.snackBar.open(message, title, {
          duration: 7000,
        });
      },
      (error: HttpErrorResponse) => {
        this.asyncOperation = false;
        console.error('Error while changing the user admin status', error);
        const title = $localize`Error during a network request`;
        const message = $localize`There was an error while changing the user admin status:` + '\n' + error.message;
        this.dialogsService.retryQuit(title, message).subscribe({
          next: (button) => {
            if (button === 'retry') {
              this.changeUserAdminStatus(email);
            } else {
              this.app.appQuitOrCancel();
            }
          },
        });
      },
    );
  }

  // Supression d'un utilisateur (après confirmation)
  private deleteUser(email: string) {
    this.asyncOperation = true;
    this.authService.deleteTeamUser(email).subscribe(
      (response: IJsonSuccessResponse | IJwtError) => {
        this.asyncOperation = false;
        let message = '';
        let title = '';
        if (response.Result === 'success') {
          message = $localize`User deleted with success.`;
          title = $localize`Success`;
          this.getTeamMembersList();
        } else {
          message = (response as IJwtError).Message;
          title = $localize`Error while deleting the user`;
        }
        this.snackBar.open(message, title, {
          duration: 7000,
        });
      },
      (error: HttpErrorResponse) => {
        this.asyncOperation = false;
        console.error('Error while deleting the user', error);
        const title = $localize`Error during a network request`;
        const message = $localize`There was an error while deleting the user:` + '\n' + error.message;
        this.dialogsService.retryQuit(title, message).subscribe({
          next: (button) => {
            if (button === 'retry') {
              this.changeUserAdminStatus(email);
            } else {
              this.app.appQuitOrCancel();
            }
          },
        });
      },
    );
  }

  // Les actions possibles sur les utilisateurs de l'équipe
  actionOnProfile(email: string, action: string) {
    switch (action) {
      case 'delete':
        this.dialogsService
          .yesNo(
            $localize`Remove Team User`,
            $localize`Do you really want to remove this user, ${email}? The account will be marked as deleted and really deleted in 30 days`,
          )
          .subscribe({
            next: (button) => {
              if (button === true) {
                this.deleteUser(email);
              } else {
                this.snackBar.open($localize`User was not deleted`, $localize`Ok`, {
                  duration: 3000,
                });
                return;
              }
            },
          });
        break;

      case 'admin':
        this.changeUserAdminStatus(email);
        break;
    }
  }

  private exportTeamData() {
    this.asyncOperation = true;
    this.authService.getTeamMembersList(true).subscribe(
      (members: IMe[]) => {
        this.asyncOperation = false;
        const filename = Misc.sanitizeFilename('team_members') + '.csv';
        if (members.length > 0) {
          this.csvDataService.exportToCsv(filename, members);
        }
      },
      (error: HttpErrorResponse) => {
        this.asyncOperation = false;
        alert('Error while getting data');
        console.error(error);
      },
    );
  }
}
