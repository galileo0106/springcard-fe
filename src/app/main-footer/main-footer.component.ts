declare var require: any;
import { Component, OnDestroy, OnInit } from '@angular/core';
import { getServiceUrl } from '@shared/appSettings';
import { AuthService } from '@shared/services/AuthService';
import { Subscription } from 'rxjs';

/**
 * Manage application's footer (version, connection, Copyright, etc)
 */
@Component({
  selector: 'app-main-footer',
  templateUrl: './main-footer.component.html',
  styleUrls: ['./main-footer.component.scss'],
})
export class MainFooterComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  public copyright = '©2019';
  public serverName = 'localhost';
  public accountName = $localize`not connected`;
  public appVersion: string = require('../../../package.json').version;
  public compilationDate: string = require('../../../package.json').compilationDate;
  public isLoggedIn = false;

  private startingYear = 2018;

  constructor(private authService: AuthService) {
    const today = new Date();
    const thisYear = today.getFullYear();
    if (thisYear > this.startingYear) {
      this.copyright += '-' + thisYear;
    }
    this.copyright += ' Springcard'
  }

  ngOnInit() {
    this.accountName = this.authService.isLoggedIn() ? this.authService.getEmailFromSession() : $localize`not connected`;
    this.isLoggedIn = this.authService.isLoggedIn();
    this.serverName = getServiceUrl('ROOT_SERVICE_URL');
    this.subscription = this.authService.getAlert().subscribe((message) => {
      if ( message['text'] == $localize`not connected` )
        this.isLoggedIn = false;
      else this.isLoggedIn = true;
      this.accountName = message['text'];
    }); 
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
