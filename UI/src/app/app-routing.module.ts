import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import { AddEditComponent } from './add-edit/add-edit.component';

import { SpeciesResolver } from 'app/services/species-resolver.service';
import { CanDeactivateGuard } from 'app/services/can-deactivate-guard.service';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'not-authorized',
    component: NotAuthorizedComponent
  },
  {
    path: 'applications',
    component: ListComponent
  },
  {
    path: 'a/:id',
    component: DetailComponent,
    resolve: {
      application: SpeciesResolver
    }
  },
  {
    path: 'a/:appId/edit',
    component: AddEditComponent,
    resolve: {
      application: SpeciesResolver
    },
    canDeactivate: [CanDeactivateGuard]
  },
  {
    // default route
    path: '',
    component: ListComponent
  },
  {
    // wildcard route
    path: '**',
    redirectTo: '/',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    CanDeactivateGuard
  ]
})

export class AppRoutingModule { }
