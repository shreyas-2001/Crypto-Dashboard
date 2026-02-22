import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-loading-spinner',
    standalone: true,
    template: `
    <div class="spinner-container">
      <div class="spinner"></div>
      @if (message) {
        <p class="spinner-message">{{ message }}</p>
      }
    </div>
  `,
    styles: `
    .spinner-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .spinner {
      border: 4px solid var(--border-color);
      border-top: 4px solid var(--accent-primary);
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
    }
    .spinner-message {
      margin-top: 1rem;
      color: var(--text-secondary);
      font-size: 0.875rem;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `
})
export class LoadingSpinnerComponent {
    @Input() message: string = 'Loading...';
}
