import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import { AddEditComponent } from './add-edit/add-edit.component';

import { SpeciesResolver } from 'app/services/species-resolver.service';
import { CanDeactivateGuard } from 'app/services/can-deactivate-guard.service';

import { AppAuthGuard } from './app.authguard';

const routes: Routes = [
  {
    path: 'not-authorized',
    component: NotAuthorizedComponent
  },
  {
    path: 'species',
    canActivate: [AppAuthGuard],
    data: { roles: ['seism_admin', 'seism_user']},
    component: ListComponent
  },
  {
    path: 'species/:id',
    canActivate: [AppAuthGuard],
    data: { roles: ['seism_admin', 'seism_user']},
    component: DetailComponent,
    resolve: {
      species: SpeciesResolver
    }
  },
  {
    path: 'species/:id/edit',
    canActivate: [AppAuthGuard],
    data: { roles: ['seism_admin']},
    component: AddEditComponent,
    resolve: {
      species: SpeciesResolver
    },
    canDeactivate: [CanDeactivateGuard]
  },
  {
    // default route
    path: '',
    canActivate: [AppAuthGuard],
    data: { roles: ['seism_admin', 'seism_user']},
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
    CanDeactivateGuard,
    AppAuthGuard
  ]
})

export class AppRoutingModule { }
