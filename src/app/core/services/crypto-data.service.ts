import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, of, shareReplay } from 'rxjs';
import { Coin, CoinDetail, MarketChartData } from '../models/coin.model';

@Injectable({
    providedIn: 'root'
})
export class CryptoDataService {
    private http = inject(HttpClient);
    private readonly baseUrl = 'https://api.coingecko.com/api/v3';

    // Cache observables
    private trendingCoinsCache$: Observable<any> | null = null;
    private topCoinsCache$: Observable<Coin[]> | null = null;

    getTopCoins(vsCurrency = 'usd', perPage = 100, page = 1): Observable<Coin[]> {
        // Only cache the default page 1 for top 100
        if (vsCurrency === 'usd' && perPage === 100 && page === 1) {
            if (!this.topCoinsCache$) {
                const params = new HttpParams()
                    .set('vs_currency', vsCurrency)
                    .set('order', 'market_cap_desc')
                    .set('per_page', perPage.toString())
                    .set('page', page.toString())
                    .set('sparkline', 'false');

                this.topCoinsCache$ = this.http.get<Coin[]>(`${this.baseUrl}/coins/markets`, { params }).pipe(
                    shareReplay(1),
                    catchError(err => {
                        console.error('Error fetching top coins', err);
                        this.topCoinsCache$ = null; // Clear cache on error
                        return of([]);
                    })
                );
            }
            return this.topCoinsCache$;
        }

        const params = new HttpParams()
            .set('vs_currency', vsCurrency)
            .set('order', 'market_cap_desc')
            .set('per_page', perPage.toString())
            .set('page', page.toString())
            .set('sparkline', 'false');

        return this.http.get<Coin[]>(`${this.baseUrl}/coins/markets`, { params }).pipe(
            catchError(err => {
                console.error('Error fetching top coins', err);
                return of([]);
            })
        );
    }

    getCoinDetails(id: string): Observable<CoinDetail | null> {
        return this.http.get<CoinDetail>(`${this.baseUrl}/coins/${id}`).pipe(
            catchError(err => {
                console.error(`Error fetching details for ${id}`, err);
                return of(null);
            })
        );
    }

    getMarketChart(id: string, vsCurrency = 'usd', days = '1'): Observable<MarketChartData | null> {
        const params = new HttpParams()
            .set('vs_currency', vsCurrency)
            .set('days', days);

        return this.http.get<MarketChartData>(`${this.baseUrl}/coins/${id}/market_chart`, { params }).pipe(
            catchError(err => {
                console.error(`Error fetching chart params for ${id}`, err);
                return of(null);
            })
        );
    }

    getTrendingCoins(): Observable<any> {
        if (!this.trendingCoinsCache$) {
            this.trendingCoinsCache$ = this.http.get<any>(`${this.baseUrl}/search/trending`).pipe(
                map(response => response.coins.map((c: any) => c.item)),
                shareReplay(1),
                catchError(err => {
                    console.error('Error fetching trending coins', err);
                    this.trendingCoinsCache$ = null; // Clear cache on error
                    return of([]);
                })
            );
        }
        return this.trendingCoinsCache$;
    }
}
