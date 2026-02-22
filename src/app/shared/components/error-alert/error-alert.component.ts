import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-error-alert',
    standalone: true,
    template: `
    <div class="error-container">
      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="error-icon">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <div class="error-content">
        <h3 class="error-title">Oops!</h3>
        <p class="error-message">{{ message }}</p>
      </div>
    </div>
  `,
    styles: `
    .error-container {
      background-color: rgba(239, 68, 68, 0.1);
      border: 1px solid var(--accent-danger);
      border-radius: 0.5rem;
      padding: 1rem;
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      margin: 1rem 0;
    }
    .error-icon {
      color: var(--accent-danger);
      flex-shrink: 0;
    }
    .error-content {
      flex: 1;
    }
    .error-title {
      margin: 0 0 0.25rem 0;
      color: var(--accent-danger);
      font-weight: 600;
    }
    .error-message {
      margin: 0;
      color: var(--text-primary);
      font-size: 0.875rem;
    }
  `
})
export class ErrorAlertComponent {
    @Input() message: string = 'Something went wrong while fetching data.';
}
