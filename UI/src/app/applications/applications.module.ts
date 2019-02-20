// modules
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ApplicationsRoutingModule } from './applications-routing.module';

// components
import { ApplicationListComponent } from './application-list/application-list.component';
import { ApplicationDetailComponent } from './application-detail/application-detail.component';
import { ApplicationAddEditComponent } from './application-add-edit/application-add-edit.component';

// services
import { ApiService } from 'app/services/api';
import { ApplicationService } from 'app/services/application.service';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    SharedModule,
    NgxPaginationModule,
    NgbModule.forRoot(),
    ApplicationsRoutingModule
  ],
  declarations: [
    ApplicationListComponent,
    ApplicationDetailComponent,
    ApplicationAddEditComponent
  ],
  exports: [
    ApplicationListComponent,
    ApplicationDetailComponent,
    ApplicationAddEditComponent
  ],
  providers: [
    ApiService,
    ApplicationService
  ]
})

export class ApplicationsModule { }
