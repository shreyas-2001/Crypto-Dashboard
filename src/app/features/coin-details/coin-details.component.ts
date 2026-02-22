import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CryptoDataService } from '../../core/services/crypto-data.service';
import { PortfolioService } from '../../core/services/portfolio.service';
import { CoinDetail, MarketChartData } from '../../core/models/coin.model';
import { CoinChartComponent } from './components/coin-chart/coin-chart.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorAlertComponent } from '../../shared/components/error-alert/error-alert.component';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-coin-details',
    standalone: true,
    imports: [CommonModule, CurrencyPipe, DecimalPipe, DatePipe, RouterLink, FormsModule, CoinChartComponent, LoadingSpinnerComponent, ErrorAlertComponent],
    templateUrl: './coin-details.component.html',
    styleUrl: './coin-details.component.css'
})
export class CoinDetailsComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private cryptoService = inject(CryptoDataService);
    private portfolioService = inject(PortfolioService);

    coinId = '';
    coin = signal<CoinDetail | null>(null);
    chartData = signal<MarketChartData | null>(null);

    loadingCoin = signal(true);
    errorCoin = signal(false);

    loadingChart = signal(true);
    errorChart = signal(false);

    timeframe = signal('1'); // 1, 7, 30 days

    // Portfolio form interaction
    buyAmount = signal<number>(0);
    showPortfolioForm = signal(false);

    Math = Math;

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            this.coinId = params.get('id') || '';
            if (this.coinId) {
                this.loadCoinDetails();
                this.loadChartData();
            }
        });
    }

    loadCoinDetails() {
        this.loadingCoin.set(true);
        this.errorCoin.set(false);

        this.cryptoService.getCoinDetails(this.coinId).subscribe({
            next: (data) => {
                if (data) {
                    this.coin.set(data);
                } else {
                    this.errorCoin.set(true);
                }
                this.loadingCoin.set(false);
            },
            error: () => {
                this.errorCoin.set(true);
                this.loadingCoin.set(false);
            }
        });
    }

    loadChartData() {
        this.loadingChart.set(true);
        this.errorChart.set(false);

        this.cryptoService.getMarketChart(this.coinId, 'usd', this.timeframe()).subscribe({
            next: (data) => {
                if (data) {
                    this.chartData.set(data);
                } else {
                    this.errorChart.set(true);
                }
                this.loadingChart.set(false);
            },
            error: () => {
                this.errorChart.set(true);
                this.loadingChart.set(false);
            }
        });
    }

    changeTimeframe(days: string) {
        if (this.timeframe() === days) return;
        this.timeframe.set(days);
        this.loadChartData();
    }

    togglePortfolioForm() {
        this.showPortfolioForm.update(v => !v);
    }

    addToPortfolio() {
        const coinData = this.coin();
        if (!coinData || this.buyAmount() <= 0) return;

        this.portfolioService.addOrUpdateCoin({
            coinId: coinData.id,
            symbol: coinData.symbol,
            name: coinData.name,
            amount: this.buyAmount(),
            purchasePrice: coinData.current_price || 0
        });

        this.buyAmount.set(0);
        this.showPortfolioForm.set(false);
        alert('Added to portfolio successfully!');
    }
}
