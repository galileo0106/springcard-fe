import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { getFieldValue } from '@shared/appSettings';
import { Misc } from '@shared/classes/Misc';
import { IButtonClick } from '@shared/models/UI/ibuttonclick.model';
import { ITeamUsersProducts } from '@shared/models/Team/iteamusersproducts.model';
import { IUserProducts } from '@shared/models/User/iuserproducts.model';
import { IMe } from '@shared/models/User/me.model';
import { ITopButton } from '@shared/models/UI/topbutton.model';
import { ApplicationService } from '@shared/services/application.service';
import { AuthService } from '@shared/services/AuthService';
import { CsvDataService } from '@shared/services/csv.data.service';
import { CurrentTitleService } from '@shared/services/current-title.service';
import { DialogsService } from '@shared/services/dialogs.service';
import { TopButtonsService } from '@shared/services/top-buttons.service';
import { Observable, Subscription } from 'rxjs';
import { DetectionService } from '../detection.service';

/**
 * Affiche la liste des produits des membres d'une équipe
 */
@Component({
  selector: 'app-team-products',
  templateUrl: './team-products.component.html',
  styleUrls: ['./team-products.component.scss'],
})
export class TeamProductsComponent implements OnInit, OnDestroy {
  teamMembers: IMe[] = [];
  asyncOperation = false;
  teamMemberEmail = '';
  userProducts: IUserProducts[] = [];
  productsDataSource: Observable<any[]>;
  displayedColumns = [
    'product',
    'firmware',
    'hardware',
    'unique_id',
    'last_seen',
    'first_seen',
    'config_id',
    'version',
    'inventory',
    'location',
    'frozen_firmware',
  ];
  teamMembersForm: UntypedFormGroup;
  productsLoaded = false;
  hasDataToExport = false;
  private topButtons = Array<ITopButton>();
  private buttonsClickSubscriber: Subscription;

  constructor(
    private currentTitleService: CurrentTitleService,
    private app: ApplicationService,
    private dialogsService: DialogsService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private detectionService: DetectionService,
    private topButtonsService: TopButtonsService,
    private csvDataService: CsvDataService,
  ) {
    this.currentTitleService.changeTitle($localize`Your team's products`);
  }

  ngOnInit(): void {
    this.isMemberOfTeam();
    this.getTeamMembersList();
    this.setTopButtons();
    this.teamMembersForm = new UntypedFormGroup({
      members: new UntypedFormControl(),
    });
  }

  ngOnDestroy() {
    this.buttonsClickSubscriber.unsubscribe();
    this.topButtonsService.removeTopButtons();
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
          this.exportAllTeamProducts();
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

  // Récupère l'utilisateur sélectionné et charge sa liste de produits
  loadMemberProductsList() {
    const member = getFieldValue(this.teamMembersForm, 'members');
    if (member === null) {
      return;
    }
    this.teamMemberEmail = member;
    this.getProductsList();
  }

  // Charge la liste des produits d'un utilisateur
  public getProductsList() {
    if (this.teamMemberEmail.trim() === '') {
      return;
    }
    this.productsLoaded = false;
    this.asyncOperation = true;
    this.hasDataToExport = false;
    this.productsDataSource = new Observable<any[]>();
    this.productsDataSource = this.detectionService.getTeamUserProductsList(this.teamMemberEmail);
    this.productsDataSource.subscribe({
      next: (products: IUserProducts[]) => {
        this.asyncOperation = false;
        this.userProducts = products;
        if (products.length > 0) {
          this.hasDataToExport = true;
        }
      },
      error: (error) => {
        this.asyncOperation = false;
        console.error('Error while getting the list of user products', error);
        const title = $localize`Error during a network request`;
        const message = $localize`There was an error while asking for the list of user products:` + '\n' + error.message;
        this.dialogsService.retryQuit(title, message).subscribe({
          next: (button) => {
            if (button === 'retry') {
              this.getProductsList();
            } else {
              this.app.appQuitOrCancel();
            }
          },
        });
      },
      complete: () => (this.productsLoaded = true),
    });
  }

  public exportUserDataToCsv() {
    const memberEmail = getFieldValue(this.teamMembersForm, 'members');
    if (memberEmail === null || memberEmail.trim() === '') {
      return;
    }
    this.asyncOperation = true;
    this.detectionService.getTeamUserProductsList(memberEmail).subscribe(
      (products: IUserProducts[]) => {
        this.asyncOperation = false;
        const filename = Misc.sanitizeFilename('products_' + memberEmail) + '.csv';
        if (products.length > 0) {
          this.csvDataService.exportToCsv(filename, products);
        }
      },
      (error: HttpErrorResponse) => {
        this.asyncOperation = false;
        console.error(error);
      },
    );
  }

  public exportAllTeamProducts(): void {
    this.asyncOperation = true;
    this.detectionService.getAllTeamUsersProductsList().subscribe(
      (products: ITeamUsersProducts[]) => {
        this.asyncOperation = false;
        const filename = Misc.sanitizeFilename('team_products') + '.csv';
        if (products.length > 0) {
          this.csvDataService.exportToCsv(filename, products);
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
