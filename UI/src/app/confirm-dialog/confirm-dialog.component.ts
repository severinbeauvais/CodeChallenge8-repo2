import { Component } from '@angular/core';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';

export interface DataModel {
  title: string;
  message: string;
  okOnly: boolean;
}

@Component({
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})

export class ConfirmDialogComponent extends DialogComponent<DataModel, boolean> implements DataModel {
  title = 'Confirm';
  message = 'Are you sure?';
  okOnly = false;

  constructor(public dialogService: DialogService) {
    super(dialogService);
  }

  confirm() {
    // we set dialog result as true on click of confirm button
    // then we can get dialog result from caller code
    this.result = true;
    this.close();
  }
}
