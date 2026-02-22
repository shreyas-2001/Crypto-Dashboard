import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private platformId = inject(PLATFORM_ID);

    public isDarkMode = signal<boolean>(false);

    constructor() {
        if (isPlatformBrowser(this.platformId)) {
            const storedTheme = localStorage.getItem('theme');
            if (storedTheme) {
                this.isDarkMode.set(storedTheme === 'dark');
            } else {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                this.isDarkMode.set(prefersDark);
            }

            effect(() => {
                const dark = this.isDarkMode();
                localStorage.setItem('theme', dark ? 'dark' : 'light');
                if (dark) {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            });
        }
    }

    toggleTheme() {
        this.isDarkMode.update(prev => !prev);
    }
}
