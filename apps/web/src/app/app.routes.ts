import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'login',
    loadComponent: () => import('@domain/login/login.component').then(m => m.LoginComponent),
    data: { animation: 'Login' }
  },
  {
    path: 'cadastro',
    loadComponent: () => import('@domain/cadastro/cadastro.component').then(m => m.CadastroComponent),
    data: { animation: 'Cadastro' }
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
