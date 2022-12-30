import { Injectable } from '@angular/core';
import { IButtonClick } from '@shared/models/UI/ibuttonclick.model';
import { ITopButton } from '@shared/models/UI/topbutton.model';
import { BehaviorSubject } from 'rxjs';

/**
 * Gère les boutons présents tout en haut de l'écran à droite
 */
@Injectable()
export class TopButtonsService {
  private buttonsSource = new BehaviorSubject<ITopButton[]>([]);
  currentButtons = this.buttonsSource.asObservable();

  private buttonClicksSource = new BehaviorSubject<IButtonClick>({ label: '', id: '' });
  buttonsClicks = this.buttonClicksSource.asObservable();

  constructor() {}

  pushButtonClick(buttonParameters: IButtonClick) {
    this.buttonClicksSource.next(buttonParameters);
  }

  // Used to inform the component who manage buttons that there is a change
  setTopButtons(buttons: ITopButton[]) {
    this.buttonsSource.next(buttons);
  }

  removeTopButtons(): void {
    this.buttonsSource.next([]);
    // Without the next line, the next caller will get the last message (we are using a BehaviorSubject!)
    this.pushButtonClick({ label: '', id: '' });
  }

  changeButtonLabel(buttonsList: ITopButton[], searchedId: string, newLabel: string): ITopButton[] {
    const newButtonsList = Array<ITopButton>();
    buttonsList.forEach((item) => {
      if (item.id === searchedId) {
        item.label = newLabel;
      }
      newButtonsList.push(item);
    });
    return newButtonsList;
  }
}
