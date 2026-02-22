import { Component, inject, OnInit, computed, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CryptoDataService } from '../../../../core/services/crypto-data.service';
import { Coin } from '../../../../core/models/coin.model';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorAlertComponent } from '../../../../shared/components/error-alert/error-alert.component';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-coin-list',
    standalone: true,
    imports: [CommonModule, CurrencyPipe, DecimalPipe, RouterLink, LoadingSpinnerComponent, ErrorAlertComponent, FormsModule],
    templateUrl: './coin-list.component.html',
    styleUrl: './coin-list.component.css'
})
export class CoinListComponent implements OnInit {
    private cryptoService = inject(CryptoDataService);

    coins = signal<Coin[]>([]);
    loading = signal(true);
    error = signal(false);

    searchTerm = signal('');
    Math = Math;

    filteredCoins = computed(() => {
        const term = this.searchTerm().toLowerCase();
        if (!term) return this.coins();
        return this.coins().filter(coin =>
            coin.name.toLowerCase().includes(term) ||
            coin.symbol.toLowerCase().includes(term)
        );
    });

    ngOnInit() {
        this.cryptoService.getTopCoins('usd', 100, 1).subscribe({
            next: (data) => {
                this.coins.set(data);
                this.loading.set(false);
            },
            error: () => {
                this.error.set(true);
                this.loading.set(false);
            }
        });
    }

    onSearchChange(term: string) {
        this.searchTerm.set(term);
    }
}
