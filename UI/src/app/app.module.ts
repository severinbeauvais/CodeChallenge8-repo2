import { NgModule, APP_INITIALIZER, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { BootstrapModalModule } from 'ng2-bootstrap-modal';
import { CookieService } from 'ngx-cookie-service';
// import { MatSlideToggleModule } from '@angular/material';
// import { MatSnackBarModule } from '@angular/material';

// modules
import { AppRoutingModule } from 'app/app-routing.module';

// components
import { AppComponent } from 'app/app.component';
import { ConfirmDialogComponent } from 'app/confirm-dialog/confirm-dialog.component';
import { HeaderComponent } from 'app/header/header.component';
import { FooterComponent } from 'app/footer/footer.component';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import { AddEditComponent } from './add-edit/add-edit.component';

import { OrderByPipe } from 'app/pipes/order-by.pipe';
import { NewlinesPipe } from 'app/pipes/newlines.pipe';
import { VarDirective } from 'app/utils/ng-var.directive';
import { FileUploadComponent } from 'app/file-upload/file-upload.component';

// services
import { ApiService } from 'app/services/api';
import { SpeciesService } from 'app/services/species.service';
import { CanDeactivateGuard } from 'app/services/can-deactivate-guard.service';
import { TokenInterceptor } from './utils/token-interceptor';

import { KeycloakService } from 'keycloak-angular';
import { environment } from 'environments/environment';

export function kcFactory(keycloakService: KeycloakService) {
  return () => keycloakService.init({ config: environment['keycloak'] });
}

@NgModule({
  declarations: [
    AppComponent,
    ConfirmDialogComponent,
    HeaderComponent,
    FooterComponent,
    NotAuthorizedComponent,
    ListComponent,
    DetailComponent,
    AddEditComponent,
    OrderByPipe,
    NewlinesPipe,
    VarDirective,
    FileUploadComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    // MatSlideToggleModule,
    // MatSnackBarModule,
    AppRoutingModule, // <-- module import order matters - https://angular.io/guide/router#module-import-order-matters
    NgbModule.forRoot(),
    NgxPaginationModule,
    BootstrapModalModule.forRoot({ container: document.body })
  ],
  providers: [
    ApiService,
    KeycloakService,
    {
      provide: APP_INITIALIZER,
      useFactory: kcFactory,
      deps: [KeycloakService],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    CookieService,
    SpeciesService,
    CanDeactivateGuard
  ],
  entryComponents: [
    ConfirmDialogComponent
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
  constructor(applicationRef: ApplicationRef) {
    Object.defineProperty(applicationRef, '_rootComponents', { get: () => applicationRef['components'] });
  }
}
