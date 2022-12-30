import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Locale } from '@shared/models/locale.model';
import { ITopButton } from '@shared/models/UI/topbutton.model';
import { AuthService } from '@shared/services/AuthService';
import { TopButtonsService } from '@shared/services/top-buttons.service';
import { Subscription } from 'rxjs';

/**
 * Manage dynamic buttons on the top right of the application
 * The button's list is an array composed of objects like this:
 * {
 *  "label":  The button's label
 *  "color":  Any color code accepted by Angular Material's buttons, actually can be primary, accent, or warn
 *  "icon":   Name of the icon to use, see https://material.io/tools/icons/ [optional]
 *  "type":   Button's type, can be raised-button, button, icon-button, raised-icon-with-text, button-icon-with-text, fab, mini-fab
 *  "id":     Any unique string that can represent the button
 * }
 */
@Component({
  selector: 'app-header-actions',
  templateUrl: './header-actions.component.html',
  styleUrls: ['./header-actions.component.scss'],
})
export class HeaderActionsComponent implements OnInit, OnDestroy {
  locales: Locale[];
  currentLocale: Locale;
  buttonsList = Array<ITopButton>();
  warnUser = false;
  url: string = '';
  private subscription: Subscription;

  constructor(private topButtons: TopButtonsService, private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.verifyAccountValidity();
    this.addLocales();
    this.setCurrentLocal();
    this.addUserButton();
    this.addLanguageButton();
    // Listen for buttons changes
    this.topButtons.currentButtons.subscribe((buttons: ITopButton[]) => {
      this.buttonsList = buttons;
      this.addUserButton();
      this.addLanguageButton();
    });
    this.subscription = this.authService.getAlert().subscribe(() => {
      this.verifyAccountValidity();
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  setCurrentLocal() {
    var temArray = window.location.href.split('/');
    this.locales.forEach(local => {
      if (temArray[3] === local.localeCode)
        this.currentLocale = local;
    })
  }

  addLocales() {
    this.locales = [
      {
        label: 'English',
        localeCode: 'en',
        countryFlag: 'assets/svg/US-flag.svg'
      },
      {
        label: 'Français',
        localeCode: 'fr',
        countryFlag: 'assets/svg/FR-flag.svg'
      }
    ]
  }

  verifyAccountValidity() {
    this.warnUser = false;
    if (!this.authService.isLoggedIn()) {
      return;
    }
    if (this.authService.accountIsExpired()) {
      this.warnUser = true;
    } else if (this.authService.accountExpiresNextMonth()) {
      this.warnUser = true;
    }
  }

  addLanguageButton() {
    var canAdd = true;
    this.buttonsList.forEach(button => {
      if (button.id === "language_button") {
        canAdd = false;
      }
    })
    if (this.currentLocale && canAdd) {
      var languageButton: ITopButton = {
        label: `${this.currentLocale.label}`,
        color: 'warm',
        type: 'language_button',
        id: 'language_button',
        icon: `${this.currentLocale.countryFlag}`,
      }
      this.buttonsList.push(languageButton)
    }
  }

  addUserButton() {
    if (!this.authService.hasValidatedCGU()) {
      return;
    }
    let canAddUserButton = true;
    this.buttonsList.forEach((button) => {
      if (button.id === 'SYSTEM_user_account') {
        canAddUserButton = false;
      }
    });
    if (canAddUserButton) {
      const userButton: ITopButton = {
        label: '',
        color: 'warm',
        type: 'icon-button', // icon-button  button-icon-with-text
        id: 'SYSTEM_user_account',
        icon: 'account_circle',
        tooltip: $localize`Account management`
      };
      this.buttonsList.push(userButton);
    }
  }

  buttonClick(buttonLabel: string, buttonId?: string) {
    buttonId = buttonId || buttonLabel;
    if (buttonId === 'SYSTEM_user_account') {
      if ( this.authService.isLoggedIn() )
        this.router.navigate(['/summary']);
      else this.router.navigate(['/login']);
      return;
    }
    // Notify subscribers of buttons clicks
    this.topButtons.pushButtonClick({ label: buttonLabel, id: buttonId });
  }
  languageSwitch(locale: Locale) {
    this.url = `/${locale.localeCode}${this.router.url}`;
  }
}
