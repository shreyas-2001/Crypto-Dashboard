import { Component, inject, computed } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PortfolioService } from '../../core/services/portfolio.service';
import { CryptoDataService } from '../../core/services/crypto-data.service';

@Component({
    selector: 'app-portfolio',
    standalone: true,
    imports: [CommonModule, CurrencyPipe, DecimalPipe, RouterLink],
    templateUrl: './portfolio.component.html',
    styleUrl: './portfolio.component.css'
})
export class PortfolioComponent {
    portfolioService = inject(PortfolioService);
    private cryptoService = inject(CryptoDataService);

    items = this.portfolioService.items;
    totalInvested = this.portfolioService.totalInvested;

    // We could fetch live prices for portfolio items to show current value,
    // but for a simple requirement we'll just show what they hold.
    // In a real app we'd trigger a fetch for the portfolio coin IDs.

    Math = Math;

    removeCoin(id: string) {
        if (confirm('Are you sure you want to remove this coin from your portfolio?')) {
            this.portfolioService.removeCoin(id);
        }
    }
}
