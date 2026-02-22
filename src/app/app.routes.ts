import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
    { path: 'coins/:id', loadComponent: () => import('./features/coin-details/coin-details.component').then(m => m.CoinDetailsComponent) },
    { path: 'portfolio', loadComponent: () => import('./features/portfolio/portfolio.component').then(m => m.PortfolioComponent) },
    { path: '**', redirectTo: '' }
];
