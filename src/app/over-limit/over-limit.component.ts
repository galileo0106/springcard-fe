import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlanService } from '@shared/services/plan.service';

/**
 * Composant en charge d'afficher à l'utilisateur qu'il ne peut plus faire une action sans changer de plan
 */
@Component({
  selector: 'app-over-limit',
  templateUrl: './over-limit.component.html',
  styleUrls: ['./over-limit.component.scss'],
})
export class OverLimitComponent implements OnInit {
  @Input() limitLabel = '';

  constructor(public planService: PlanService, private router: Router) {}

  ngOnInit(): void {}

  redirectUserTo(url: string) {
    const redirectUrl = `/${url}`;
    this.router.navigateByUrl(redirectUrl);
  }
}
