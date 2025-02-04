import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {PartnersComponent} from "./partners.component";
import {FilterOptionsResolver} from "../resolvers/filter-options.resolver";

const routes: Routes = [
  {
    path:'',
    component:PartnersComponent,
    children:[
      {
        path: 'partner',
        loadChildren: () => import('./partner/partner.module').then(m => m.PartnerModule),
        resolve:{filterData:FilterOptionsResolver},

      },
      {
        path: 'all-partners',
        loadChildren: () => import('./all-partners/all-partners.module').then(m => m.AllPartnersModule),
        resolve:{filterData:FilterOptionsResolver},
      },
      {
        path: '',
        redirectTo: 'all-partners',
        pathMatch:'full'
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PartnersRoutingModule {
}
