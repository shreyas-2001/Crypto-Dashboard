import { Component, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, inject, PLATFORM_ID, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MarketChartData } from '../../../../core/models/coin.model';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { ThemeService } from '../../../../core/services/theme.service';

Chart.register(...registerables);

@Component({
    selector: 'app-coin-chart',
    standalone: true,
    template: `
    <div class="chart-container">
      <canvas #chartCanvas></canvas>
    </div>
  `,
    styles: `
    .chart-container {
      position: relative;
      height: 300px;
      width: 100%;
    }
  `
})
export class CoinChartComponent implements OnChanges {
    @Input() chartData: MarketChartData | null = null;
    @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

    private chart?: Chart;
    private platformId = inject(PLATFORM_ID);
    private themeService = inject(ThemeService);

    constructor() {
        effect(() => {
            const isDark = this.themeService.isDarkMode();
            if (this.chart) {
                this.updateChartTheme(isDark);
            }
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['chartData'] && isPlatformBrowser(this.platformId)) {
            if (this.chartData) {
                setTimeout(() => this.renderChart());
            }
        }
    }

    private renderChart(): void {
        if (!this.chartCanvas || !this.chartData) return;

        if (this.chart) {
            this.chart.destroy();
        }

        const ctx = this.chartCanvas.nativeElement.getContext('2d');
        if (!ctx) return;

        const prices = this.chartData.prices;
        const labels = prices.map(p => {
            const date = new Date(p[0]);
            return prices.length > 50 ?
                date.toLocaleDateString() :
                date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        });
        const dataPoints = prices.map(p => p[1]);

        const isUp = dataPoints[0] <= dataPoints[dataPoints.length - 1];
        const color = isUp ? '#10b981' : '#ef4444';
        const isDark = this.themeService.isDarkMode();

        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, `${color}33`); // 20% opacity
        gradient.addColorStop(1, `${color}00`); // 0% opacity

        const config: ChartConfiguration = {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'Price (USD)',
                    data: dataPoints,
                    borderColor: color,
                    backgroundColor: gradient,
                    borderWidth: 2,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    fill: true,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index',
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: isDark ? '#1f2937' : '#ffffff',
                        titleColor: isDark ? '#f9fafb' : '#1f2937',
                        bodyColor: isDark ? '#d1d5db' : '#4b5563',
                        borderColor: isDark ? '#374151' : '#e5e7eb',
                        borderWidth: 1,
                        padding: 10,
                        displayColors: false,
                        callbacks: {
                            label: (context: any) => '$' + (context.parsed.y || 0).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 6
                            })
                        }
                    }
                },
                scales: {
                    x: {
                        display: false,
                        grid: { display: false }
                    },
                    y: {
                        position: 'right',
                        grid: {
                            color: isDark ? '#374151' : '#e5e7eb',
                        },
                        ticks: {
                            color: isDark ? '#9ca3af' : '#6b7280',
                            callback: (value: any) => '$' + value.toLocaleString()
                        },
                        border: { display: false }
                    }
                }
            }
        };

        this.chart = new Chart(ctx, config);
    }

    private updateChartTheme(isDark: boolean): void {
        if (!this.chart || !this.chart.options.scales?.['y'] || !this.chart.options.plugins?.tooltip) return;

        const tooltipOpts: any = this.chart.options.plugins.tooltip;
        tooltipOpts.backgroundColor = isDark ? '#1f2937' : '#ffffff';
        tooltipOpts.titleColor = isDark ? '#f9fafb' : '#1f2937';
        tooltipOpts.bodyColor = isDark ? '#d1d5db' : '#4b5563';
        tooltipOpts.borderColor = isDark ? '#374151' : '#e5e7eb';

        const yGridOpts: any = this.chart.options.scales['y'].grid;
        yGridOpts.color = isDark ? '#374151' : '#e5e7eb';

        const yTickOpts: any = this.chart.options.scales['y'].ticks;
        yTickOpts.color = isDark ? '#9ca3af' : '#6b7280';

        this.chart.update('none');
    }
}
