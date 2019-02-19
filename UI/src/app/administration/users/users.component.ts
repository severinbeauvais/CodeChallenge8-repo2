import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';
import { DialogService } from 'ng2-bootstrap-modal';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import * as _ from 'lodash';

import { User } from 'app/models/user';
import { UserService } from 'app/services/user.service';
import { AddEditUserComponent } from 'app/administration/users/add-edit-user/add-edit-user.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class UsersComponent implements OnInit, OnDestroy {
  public users: Array<User>;
  public loading = true;
  public sysadmins: Array<User> = [];
  public standards: Array<User> = [];
  private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

  constructor(
    private userService: UserService,
    private dialogService: DialogService,
    private _changeDetectionRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.refreshUsersUI();
  }

  refreshUsersUI() {
    this.sysadmins = [];
    this.standards = [];
    this.userService.getAll()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(
        data => {
          this.loading = false;
          this.users = data;
          const self = this;
          // console.log('roles:', data);
          _.each(data, function (i) {
            if (_.some(i.roles, _.method('includes', 'sysadmin'))) {
              self.sysadmins.push(i);
            } else {
              self.standards.push(i);
            }
          });
          // Force change detection since we changed a bound property after the normal check cycle and outside anything
          // that would trigger a CD cycle - this will eliminate the error we get when running in dev mode.
          this._changeDetectionRef.detectChanges();
        },
        () => {
          this.loading = false;
        });
  }

  addUser() {
    this.dialogService.addDialog(AddEditUserComponent,
      {
        title: 'Create User',
        message: 'Add',
        model: null
      }, {
        // index: 0,
        // autoCloseTimeout: 10000,
        // closeByClickingOutside: true,
        backdropColor: 'rgba(0, 0, 0, 0.5)'
      })
      .takeUntil(this.ngUnsubscribe)
      .subscribe(
        isConfirmed => {
          // we get dialog result
          if (isConfirmed) {
            // console.log('saved');
            this.refreshUsersUI();
          } else {
            // console.log('canceled');
          }
        }
      );
  }

  selectUser(user) {
    this.dialogService.addDialog(AddEditUserComponent,
      {
        title: 'Edit User',
        message: 'Save',
        model: user
      }, {
        // index: 0,
        // autoCloseTimeout: 10000,
        // closeByClickingOutside: true,
        backdropColor: 'rgba(0, 0, 0, 0.5)'
      })
      .takeUntil(this.ngUnsubscribe)
      .subscribe((isConfirmed) => {
        // we get dialog result
        if (isConfirmed) {
          // console.log('saved');
          this.refreshUsersUI();
        } else {
          // console.log('canceled');
        }
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
