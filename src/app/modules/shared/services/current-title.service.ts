import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser'; // , Meta
import { BehaviorSubject } from 'rxjs';

/**
 * Set the title of the current component in the top middle of the screen
 * and set the window title
 */
@Injectable()
export class CurrentTitleService {
  private titleSource = new BehaviorSubject<string>('SpringCard Companion');
  currentTitle = this.titleSource.asObservable();
  // Attention, la variable ci-dessous est mise à jour automatiquement par un script Php, il ne faut pas y toucher.
  public appVersion = '1.2.7';

  constructor(private titleService: Title) {} // , private meta: Meta

  changeTitle(title: string) {
    this.titleSource.next(title);
    this.titleService.setTitle(title);
    //this.meta.addTag({ name: 'description', content: title });
  }
}
