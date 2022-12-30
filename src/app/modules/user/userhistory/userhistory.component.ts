import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationService } from '@shared/services/application.service';
import { AuthService } from '@shared/services/AuthService';
import { CurrentTitleService } from '@shared/services/current-title.service';
import { DialogsService } from '@shared/services/dialogs.service';
import { Observable } from 'rxjs';
import { faFileLines } from '@fortawesome/free-solid-svg-icons';
import { MatTableDataSource } from '@angular/material/table';
import { IUserHistory } from '@shared/models/User/iuserhistory.model';
import { Misc } from '@shared/classes/Misc';
import { CsvDataService } from '@shared/services/csv.data.service';

@Component({
  selector: 'app-userhistory',
  templateUrl: './userhistory.component.html',
  styleUrls: ['./userhistory.component.scss'],
})
export class UserHistoryComponent implements OnInit {
  asyncOperation = false;
  faFileLinesIcon = faFileLines;

  public historyLists: IUserHistory[] = [];
  public historyListTableSource: MatTableDataSource<any>;

  public historyListsSource: Observable<any[]>;
  public displayedColumns = ['created', 'name', 'device', 'serialnumber', 'action'];

  constructor(
    private currentTitleService: CurrentTitleService,
    private authService: AuthService,
    private dialogsService: DialogsService,
    private app: ApplicationService,
    private router: Router,
    private csvDataService: CsvDataService,
  ) {}

  ngOnInit(): void {
    this.currentTitleService.changeTitle($localize`Account settings`);
    this.getHistoryList();
  }

  getHistoryList() {
    this.asyncOperation = true;
    this.historyListsSource = this.authService.history();
    this.historyListTableSource = new MatTableDataSource<any>();
    this.historyListsSource.subscribe(
      (profiles: IUserHistory[]) => {
        this.asyncOperation = false;
        this.historyLists = profiles;
        this.historyListTableSource.data = this.historyLists;
      },
      (error: HttpErrorResponse) => {
        this.asyncOperation = false;
        console.error('Error while getting the list of the history', error);
        const title = $localize`Error during a network request`;
        const message = $localize`There was an error while asking for the list of history:` + '\n' + error.message;
        this.dialogsService.retryQuit(title, message).subscribe({
          next: (button) => {
            if (button === 'retry') {
              this.getHistoryList();
            } else {
              this.app.appQuitOrCancel();
            }
          },
        });
      },
    );
  }

  exportHistory() {
    this.asyncOperation = true;
    this.authService.history().subscribe(
      (members: IUserHistory[]) => {
        this.asyncOperation = false;
        const filename = Misc.sanitizeFilename('user_history') + '.csv';
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

  // actionOnProfile(user: IMe, action: string) {
  //   switch (action) {
  //     case 'invite':
  //       this.sendInvitation(user);
  //       break;
  //     case 'admin':
  //       this.changeUserAdminStatus(user);
  //       break;
  //     case 'delete':
  //       this.dialogsService
  //         .yesNo(
  //           $localize`Remove Team User`,
  //           $localize`Do you really want to remove this user, ${user.email}? The account will be marked as deleted and really deleted in 30 days`,
  //         )
  //         .subscribe({
  //           next: (button) => {
  //             if (button === true) {
  //               this.deleteUser(user.email);
  //             } else {
  //               this.snackBar.open($localize`User was not deleted`, $localize`Ok`, {
  //                 duration: 3000,
  //               });
  //               return;
  //             }
  //           },
  //         });
  //       break;
  //   }
  // }

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.teamMembersTableSource.filter = filterValue.trim().toLowerCase();
  // }

  redirectUserTo(route: string) {
    this.router.navigate([route]);
  }
}