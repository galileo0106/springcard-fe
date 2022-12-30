import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { IMe } from '@shared/models/User/me.model';
import { ApplicationService } from '@shared/services/application.service';
import { AuthService } from '@shared/services/AuthService';
import { CurrentTitleService } from '@shared/services/current-title.service';
import { DialogsService } from '@shared/services/dialogs.service';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IChangeTeamMemberStatus } from '@shared/models/Team/ichangeteammemberstatus.model';
import { ITeamMemberInvitation } from '@shared/models/Team/iteammemberinvitation.model';
import { IJsonSuccessResponse } from '@shared/models/ijson.success.response.model';
import { IJwtError } from '@shared/models/IJwtError.model';
// import { filter } from 'rxjs/operators';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-teammanage',
  templateUrl: './teammanage.component.html',
  styleUrls: ['./teammanage.component.scss'],
})
export class TeamManageComponent implements OnInit {
  asyncOperation = false;
  userProfile: IMe;
  teamMembers: IMe[] = [];
  addingNewUser = false;
  isCreationgNewAccount = false;
  showErrorDiv = false;

  userForm: UntypedFormGroup;

  faTeamsIcon = faUsers;
  public teamMembersTableSource: MatTableDataSource<any>;

  public teamMembersSource: Observable<any[]>;
  public displayedColumns = ['email', 'name', 'company', 'profile', 'created', 'last_connection', 'actions'];

  constructor(
    private fb: UntypedFormBuilder,
    private snackBar: MatSnackBar,
    private currentTitleService: CurrentTitleService,
    private authService: AuthService,
    private dialogsService: DialogsService,
    private app: ApplicationService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.currentTitleService.changeTitle($localize`Account settings`);
    this.createNewUserForm();
    this.getTeamMembersList();
  }

  private createNewUserForm() {
    this.userForm = this.fb.group({
      full_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      is_admin: [false, [Validators.required]],
    });
  }

  addUser() {
    this.addingNewUser = true;
    this.isCreationgNewAccount = true;
  }

  changeProfile(user: IMe) {
    this.userProfile = user;
  }

  canHideAddingProfile() {
    this.addingNewUser = false;
    this.getTeamMembersList();
  }

  getTeamMembersList() {
    this.asyncOperation = true;
    // this.teamMembersSource = new Observable<any[]>();
    this.teamMembersSource = this.authService.getTeamMembersList(true);
    this.teamMembersTableSource = new MatTableDataSource<any>();
    // this.teamMembersTableSource = this.authService.getTeamMembersList(true);
    this.teamMembersSource.subscribe(
      (profiles: IMe[]) => {
        this.asyncOperation = false;
        this.teamMembers = profiles;
        this.teamMembersTableSource.data = this.teamMembers;
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

  actionOnProfile(user: IMe, action: string) {
    switch (action) {
      case 'invite':
        this.sendInvitation(user);
        break;
      case 'admin':
        this.changeUserAdminStatus(user);
        break;
      case 'delete':
        this.dialogsService
          .yesNo(
            $localize`Remove Team User`,
            $localize`Do you really want to remove this user, ${user.email}? The account will be marked as deleted and really deleted in 30 days`,
          )
          .subscribe({
            next: (button) => {
              if (button === true) {
                this.deleteUser(user.email);
              } else {
                this.snackBar.open($localize`User was not deleted`, $localize`Ok`, {
                  duration: 3000,
                });
                return;
              }
            },
          });
        break;
    }
  }

  private sendInvitation(user: IMe) {
    this.asyncOperation = true;
    this.showErrorDiv = false;

    const teamProfile: ITeamMemberInvitation = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      admin: user.is_admin_of_team,
    };
    this.authService.inviteTeamMember(teamProfile).subscribe(
      (response: IJsonSuccessResponse | IJwtError) => {
        this.asyncOperation = false;
        let message = '';
        let title = '';
        if (response.Result === 'success') {
          message = $localize`The invitation to join the team was sent with success.`;
          title = $localize`Success`;
        } else {
          this.showErrorDiv = true;
          message = (response as IJwtError).Message;
          title = $localize`Error while sending the invitation`;
        }
        this.snackBar.open(message, title, {
          duration: 7000,
        });
      },
      (error: HttpErrorResponse) => {
        this.asyncOperation = false;
        let errorMessage = $localize`Error while sending the invitation.`;
        //if (error.status === 422 || error.status === 409 || error.status === 402) {
        errorMessage += ' ' + error.error.Message;
        //}
        this.dialogsService.retryQuit('Error', errorMessage).subscribe({
          next: (button) => {
            if (button === 'retry') {
               this.sendInvitation(user);
            } else {
              this.app.appQuitOrCancel();
            }
          },
        });
      },
    );
  }

    // Changement du statut d'admin d'un utilisateur
    private changeUserAdminStatus(user: IMe) {
      const newStatus = !user.is_admin_of_team;
      const userAdminStatus: IChangeTeamMemberStatus = {
        email: user.email,
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
          const message = $localize`There was an error while changing the user admin status:` + ' ' + error.error.Message;
          this.dialogsService.retryQuit(title, message).subscribe({
            next: (button) => {
              if (button === 'retry') {
                this.changeUserAdminStatus(user);
              } else {
                this.app.appQuitOrCancel();
              }
            },
          });
        },
      );
    }

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
        const message = $localize`There was an error while deleting the user:` + '  ' + error.error.Message;
        this.dialogsService.retryQuit(title, message).subscribe({
          next: (button) => {
            if (button === 'retry') {
               this.deleteUser(email);
            } else {
              this.app.appQuitOrCancel();
            }
          },
        });
      },
    );
  }



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.teamMembersTableSource.filter = filterValue.trim().toLowerCase();
  }

  redirectUserTo(route: string) {
    this.router.navigate([route]);
  }
}