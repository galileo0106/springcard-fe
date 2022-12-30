import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
// import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
// import { ITopButton } from '@shared/models/UI/topbutton.model';
// import { ApplicationService } from '@shared/services/application.service';
import { AuthService } from '@shared/services/AuthService';
import { CurrentTitleService } from '@shared/services/current-title.service';
// import { DialogsService } from '@shared/services/dialogs.service';
// import { TopButtonsService } from '@shared/services/top-buttons.service';

import { faUser, faGear, faUsers, faFileLines } from '@fortawesome/free-solid-svg-icons';

/**
 * Display information about the service
 */
@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css'],
})
export class SummaryComponent implements OnInit {

  faUserIcon = faUser;
  faGearIcon = faGear;
  faTeamsIcon = faUsers;
  faFileLinesIcon = faFileLines;
  isConnected = false;
  redirectUrl = '';
  email = '';
  renewMessage = '';
  isMemberOfTeam = false;
  isSingleAccount = false;

  loginForm: UntypedFormGroup;
  // private topButtons = Array<ITopButton>();
  isLogging = false;

  constructor(
    private currentTitleService: CurrentTitleService,
    public authService: AuthService,
    private router: Router,
    // private activatedRoute: ActivatedRoute,
    // private topButtonsService: TopButtonsService,
  ) {
    this.currentTitleService.changeTitle($localize`Connect to companion.springcard.com`);
    // this.topButtons = [];
  }

  ngOnInit() {
  //   if (!this.authService.hasValidatedCGU()) {
  //     this.router.navigate(['/welcome']);
  //   }
    this.isConnected = this.authService.isLoggedIn();
    this.isMemberOfTeam = this.authService.getType() === 2 ? true : false;
    this.isSingleAccount = this.authService.getType() === 1 ? true : false;
  //   this.redirectUrl = this.activatedRoute.snapshot.queryParams['redirectURL'];
  //   if (this.isConnected) {
  //     this.email = this.authService.getEmailFromSession();
  //   }
  //   this.topButtonsService.setTopButtons(this.topButtons);
  }


  redirectUserTo(route: string) {
    if (this.redirectUrl === null || !this.redirectUrl) {
      this.router.navigate([route]);
    } else {
      this.router.navigate([route], { queryParams: { redirectURL: this.redirectUrl } });
    }
  }

}
