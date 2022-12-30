import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

/**
 * Equivalent d'une 404
 */
@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css'],
})
export class PageNotFoundComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  support() {
    this.router.navigate(['/support']);
  }
}
