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
    component: ListComponent,
    canActivate: [AppAuthGuard],
    data: { roles: ['seism_admin', 'seism_user'] },
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'species/:id',
    component: DetailComponent,
    canActivate: [AppAuthGuard],
    data: { roles: ['seism_admin', 'seism_user'] },
    resolve: {
      species: SpeciesResolver
    }
  },
  {
    path: 'species/:id/edit',
    component: AddEditComponent,
    canActivate: [AppAuthGuard],
    data: { roles: ['seism_admin'] },
    resolve: {
      species: SpeciesResolver
    },
    canDeactivate: [CanDeactivateGuard]
  },
  {
    // default route
    path: '',
    redirectTo: '/species',
    pathMatch: 'full'
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
    RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })
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
