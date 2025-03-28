import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'alumnos',
    loadChildren: () => import('./alumnos/alumnos.module').then( m => m.AlumnosPageModule)
  },
  {
    path: 'profesorado',
    loadChildren: () => import('./profesorado/profesorado.module').then( m => m.ProfesoradoPageModule)
  },
  {
    path: 'padres',
    loadChildren: () => import('./padres/padres.module').then( m => m.PadresPageModule)
  },
  {
    path: 'hijo/:id',
    loadChildren: () => import('./hijo/hijo.module').then( m => m.HijoPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
