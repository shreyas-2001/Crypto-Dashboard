import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe, CurrencyPipe } from '@angular/common';
import { CryptoDataService } from '../../core/services/crypto-data.service';
import { CoinListComponent } from './components/coin-list/coin-list.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorAlertComponent } from '../../shared/components/error-alert/error-alert.component';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, DecimalPipe, CurrencyPipe, CoinListComponent, LoadingSpinnerComponent, ErrorAlertComponent],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
    private cryptoService = inject(CryptoDataService);

    trendingCoins: any[] = [];
    loadingTrending = true;
    errorTrending = false;

    ngOnInit() {
        this.cryptoService.getTrendingCoins().subscribe({
            next: (data: any[]) => {
                this.trendingCoins = data.slice(0, 4);
                this.loadingTrending = false;
            },
            error: () => {
                this.errorTrending = true;
                this.loadingTrending = false;
            }
        });
    }
}
