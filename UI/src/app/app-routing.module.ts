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
    path: 'species',
    component: ListComponent
  },
  {
    path: 'species/:id',
    component: DetailComponent,
    resolve: {
      species: SpeciesResolver
    }
  },
  {
    path: 'species/:id/edit',
    component: AddEditComponent,
    resolve: {
      species: SpeciesResolver
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
    SpeciesResolver,
    CanDeactivateGuard
  ]
})

export class AppRoutingModule { }
