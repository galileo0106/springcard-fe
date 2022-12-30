import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { getFieldValue } from '@shared/appSettings';
import { Misc } from '@shared/classes/Misc';
import { IButtonClick } from '@shared/models/UI/ibuttonclick.model';
import { IProductFlashHistory } from '@shared/models/Flash/iproductflashhistory.model';
import { ITeamProductsFlashHistory } from '@shared/models/Team/iteamproductsflashhistory.model';
import { IUserProducts } from '@shared/models/User/iuserproducts.model';
import { IMe } from '@shared/models/User/me.model';
import { ITopButton } from '@shared/models/UI/topbutton.model';
import { ApplicationService } from '@shared/services/application.service';
import { AuthService } from '@shared/services/AuthService';
import { CsvDataService } from '@shared/services/csv.data.service';
import { CurrentTitleService } from '@shared/services/current-title.service';
import { DialogsService } from '@shared/services/dialogs.service';
import { FirmwaresService } from '@shared/services/firmwares.service';
import { TopButtonsService } from '@shared/services/top-buttons.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-flash-history',
  templateUrl: './flash-history.component.html',
  styleUrls: ['./flash-history.component.scss'],
})
export class FlashHistoryComponent implements OnInit, OnDestroy {
  asyncOperation = false;
  teamMembers: IMe[] = [];
  teamMembersForm: UntypedFormGroup;
  teamMemberEmail = '';
  flashLoaded = false;
  productsLoaded = false;
  userProducts: IUserProducts[] = [];
  productFlashHistory: IProductFlashHistory[] = [];
  FlashsDataSource: Observable<any[]>;
  displayedColumns = [
    'flashed_at',
    'success',
    'reason',
    'local_file',
    'Vendor',
    'Product',
    'Firmware',
    'Version',
    'Revision',
    'BuildDate',
    'Filename',
  ];
  hasDataToExport = false;
  private topButtons = Array<ITopButton>();
  private buttonsClickSubscriber: Subscription;

  constructor(
    private currentTitleService: CurrentTitleService,
    private app: ApplicationService,
    private dialogsService: DialogsService,
    public authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private firmwaresService: FirmwaresService,
    private csvDataService: CsvDataService,
    private topButtonsService: TopButtonsService,
  ) {
    this.currentTitleService.changeTitle($localize`Flash history`);
  }

  ngOnInit(): void {
    this.canAccesPage();
    this.setTopButtons();

    this.teamMembersForm = new UntypedFormGroup({
      members: new UntypedFormControl(),
      products: new UntypedFormControl(),
    });

    if (this.authService.getType() === 2) {
      this.getTeamMembersList();
    } else {
      this.getUserProductsList();
    }
  }

  ngOnDestroy() {
    this.buttonsClickSubscriber.unsubscribe();
    this.topButtonsService.removeTopButtons();
  }

  canAccesPage() {
    if (this.authService.getType() === 0) {
      this.snackBar.open($localize`You don't have a Single or Team account`, $localize`Error`, {
        duration: 7000,
      });
      this.router.navigate(['/']);
    }
  }

  // Retourne la liste des produits flashé de l'utilisateur
  getUserProductsList() {
    this.hasDataToExport = false;
    this.FlashsDataSource = new Observable<any[]>();
    this.flashLoaded = false;
    this.productFlashHistory = [];
    this.productsLoaded = false;
    this.userProducts = [];
    let email = '';
    if (this.authService.getType() === 2) {
      email = getFieldValue(this.teamMembersForm, 'members');
    } else {
      email = this.authService.getEmailFromSession();
    }
    this.teamMemberEmail = email;
    this.asyncOperation = true;
    this.firmwaresService.productsFlashedList(email).subscribe(
      (products: IUserProducts[]) => {
        this.productsLoaded = true;
        this.asyncOperation = false;
        this.userProducts = products;
      },
      (error: HttpErrorResponse) => {
        this.asyncOperation = false;
        this.productsLoaded = false;
        console.error(error);
        const title = $localize`Error during a network request`;
        const message = $localize`There was an error while asking for the list of products flashed:` + '\n' + error.message;
        this.dialogsService.retryQuit(title, message).subscribe({
          next: (button) => {
            if (button === 'retry') {
              this.getUserProductsList();
            } else {
              this.app.appQuitOrCancel();
            }
          },
        });
      },
    );
  }

  // Retourne la liste des membres de l'équipe
  getTeamMembersList() {
    this.asyncOperation = true;
    this.authService.getTeamMembersList(true).subscribe(
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

  loadFlashHistory() {
    this.flashLoaded = false;
    const UniqueId = getFieldValue(this.teamMembersForm, 'products');
    this.asyncOperation = true;
    this.FlashsDataSource = new Observable<any[]>();
    this.FlashsDataSource = this.firmwaresService.productFlashHistory(UniqueId);
    this.FlashsDataSource.subscribe({
      next: (flashes: IProductFlashHistory[]) => {
        this.asyncOperation = false;
        this.productFlashHistory = flashes;
        if (flashes.length > 0) {
          this.hasDataToExport = true;
        }
      },
      error: (error) => {
        this.asyncOperation = false;
        console.error('Error while getting the flash history', error);
        const title = $localize`Error during a network request`;
        const message = $localize`There was an error while asking for flash history:` + '\n' + error.message;
        this.dialogsService.retryQuit(title, message).subscribe({
          next: (button) => {
            if (button === 'retry') {
              this.loadFlashHistory();
            } else {
              this.app.appQuitOrCancel();
            }
          },
        });
      },
      complete: () => (this.flashLoaded = true),
    });
  }

  public exportUserDataToCsv() {
    const UniqueId = getFieldValue(this.teamMembersForm, 'products');
    this.asyncOperation = true;
    this.hasDataToExport = false;
    this.firmwaresService.productFlashHistory(UniqueId).subscribe({
      next: (flashes: IProductFlashHistory[]) => {
        this.asyncOperation = false;
        this.productFlashHistory = flashes;
        const filename = Misc.sanitizeFilename('flashes_' + this.teamMemberEmail + '_' + UniqueId) + '.csv';
        if (flashes.length > 0) {
          this.hasDataToExport = true;
          this.csvDataService.exportToCsv(filename, flashes);
        }
      },
      error: (error) => {
        this.asyncOperation = false;
        console.error(error);
      },
    });
  }

  setTopButtons() {
    this.topButtons = [
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
        case 'exportTeamData':
          this.exportTeamData();
          break;
      }
    });
  }

  private exportTeamData() {
    this.asyncOperation = true;
    this.firmwaresService.teamFlashHistory().subscribe(
      (flash: ITeamProductsFlashHistory[]) => {
        this.asyncOperation = false;
        const filename = Misc.sanitizeFilename('team_flashs') + '.csv';
        if (flash.length > 0) {
          this.csvDataService.exportToCsv(filename, flash);
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
