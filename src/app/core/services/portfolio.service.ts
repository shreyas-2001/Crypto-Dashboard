import { Injectable, signal, effect, PLATFORM_ID, inject, computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PortfolioItem } from '../models/coin.model';

@Injectable({
    providedIn: 'root'
})
export class PortfolioService {
    private platformId = inject(PLATFORM_ID);

    public items = signal<PortfolioItem[]>([]);

    public totalInvested = computed(() => {
        return this.items().reduce((total, item) => total + (item.amount * item.purchasePrice), 0);
    });

    constructor() {
        if (isPlatformBrowser(this.platformId)) {
            const storedPortfolio = localStorage.getItem('portfolio');
            if (storedPortfolio) {
                try {
                    this.items.set(JSON.parse(storedPortfolio));
                } catch (e) {
                    console.error('Failed to parse portfolio', e);
                }
            }

            effect(() => {
                localStorage.setItem('portfolio', JSON.stringify(this.items()));
            });
        }
    }

    addOrUpdateCoin(item: PortfolioItem) {
        this.items.update(currentItems => {
            const index = currentItems.findIndex(i => i.coinId === item.coinId);
            if (index > -1) {
                const newItems = [...currentItems];
                newItems[index] = item;
                return newItems;
            }
            return [...currentItems, item];
        });
    }

    removeCoin(coinId: string) {
        this.items.update(currentItems => currentItems.filter(i => i.coinId !== coinId));
    }

    getPortfolioItem(coinId: string): PortfolioItem | undefined {
        return this.items().find(i => i.coinId === coinId);
    }
}
