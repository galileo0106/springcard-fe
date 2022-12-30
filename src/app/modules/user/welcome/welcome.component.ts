import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@shared/services/AuthService';
import { CurrentTitleService } from '@shared/services/current-title.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
  constructor(private currentTitleService: CurrentTitleService, private authService: AuthService, private router: Router) {
    this.currentTitleService.changeTitle($localize`Welcome`);
  }

  ngOnInit() {
    /*if (this.authService.hasValidatedCGU()) {
      if (this.authService.isLoggedOut()) {
        this.router.navigate(['/user']);
      }
    }*/
  }

  accept() {
    this.authService.acceptCGU();
    this.router.navigate(['/login']);
  }

  decline() {
    window.location.href = 'https://www.springcard.com/';
  }
}
