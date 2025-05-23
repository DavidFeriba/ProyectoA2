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
    path: 'alumnos/:id',
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
  {
    path: 'registrar',
    loadChildren: () => import('./registrar/registrar.module').then( m => m.RegistrarPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'alumnos-login',
    loadChildren: () => import('./alumnos-login/alumnos-login.module').then( m => m.AlumnosLoginPageModule)
  },
  {
    path: 'profesorado-login',
    loadChildren: () => import('./profesorado-login/profesorado-login.module').then( m => m.ProfesoradoLoginPageModule)
  },  {
    path: 'revisar-tareas',
    loadChildren: () => import('./revisar-tareas/revisar-tareas.module').then( m => m.RevisarTareasPageModule)
  },
  {
    path: 'cargando',
    loadChildren: () => import('./cargando/cargando.module').then( m => m.CargandoPageModule)
  },
  {
    path: 'anadir-hijo',
    loadChildren: () => import('./anadir-hijo/anadir-hijo.module').then( m => m.AnadirHijoPageModule)
  },
  {
    path: 'tutorial',
    loadChildren: () => import('./tutorial/tutorial.module').then( m => m.TutorialPageModule)
  },

 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
