import { Component, OnDestroy, OnInit } from '@angular/core';
import { CurrentTitleService } from '@shared/services/current-title.service';
import { AuthService } from '@shared/services/AuthService';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

/**
 * Manage title of the current page (in top of the page)
 */
@Component({
  selector: 'app-main-title',
  templateUrl: './main-title.component.html',
  styleUrls: ['./main-title.component.scss'],
})
export class MainTitleComponent implements OnInit, OnDestroy {
  title: string;
  subTitle = '';
  private subscription: Subscription;

  constructor(private currentTitleService: CurrentTitleService, public authService: AuthService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.currentTitleService.currentTitle.subscribe((title) => (this.title = title));
    this.verifyAccountValidity();
    this.subscription = this.authService.getAlert().subscribe(() => {
      this.verifyAccountValidity();
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  verifyAccountValidity() {
    this.subTitle = '';
    if (!this.authService.isLoggedIn()) {
      return;
    }
    if (this.authService.accountIsExpired()) {
      const message = $localize`Your account is expired since ` + this.authService.getAccountExpirationDate().toLocaleDateString();
      this.subTitle = message;
      this.snackBar.open(message, $localize`Warning`, {
        duration: 60000,
      });
    } else if (this.authService.accountExpiresNextMonth()) {
      const message = $localize`Your account will expire on ` + this.authService.getAccountExpirationDate().toLocaleDateString();
      this.subTitle = message;
      this.snackBar.open(message, $localize`Warning`, {
        duration: 60000,
      });
    }
  }

  public changeTitle(title: string): void {
    this.title = title;
  }
}
