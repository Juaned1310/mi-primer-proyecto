/**
 * Dynamic Dates Component
 * Maneja fechas dinámicas para shipping checkpoints sin dependencias externas
 */

class DynamicDates extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    // Esperar un momento para asegurar que todos los atributos estén disponibles
    setTimeout(() => {
      this.dateFormat = this.dataset.dateFormat || 'mm_dd';
      this.dayLabels = this.parseLabelString(this.dataset.dayLabels);
      this.monthLabels = this.parseLabelString(this.dataset.monthLabels);
      this.updateDates();
    }, 0);
  }

  parseLabelString(str) {
    if (!str) return [];
    try {
      return str.split(',').map(s => s.trim());
    } catch (e) {
      return [];
    }
  }

  updateDates() {
    const elements = this.querySelectorAll('[data-dynamic-date="true"]');
    
    elements.forEach(element => {
      const text = element.dataset.text;
      const minDays = parseInt(element.dataset.minDays) || 0;
      const maxDays = parseInt(element.dataset.maxDays) || 0;
      
      if (!text) return;
      
      const startDate = this.calculateDate(minDays);
      const endDate = this.calculateDate(maxDays);
      
      let updatedText = text;
      updatedText = updatedText.replace(/\[start_date\]/g, this.formatDate(startDate));
      updatedText = updatedText.replace(/\[end_date\]/g, this.formatDate(endDate));
      
      element.innerHTML = updatedText;
    });
  }

  calculateDate(daysToAdd) {
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);
    return date;
  }

  getOrdinalSuffix(day) {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  }

  formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth();
    const dayOfWeek = date.getDay();
    const dayName = this.dayLabels[dayOfWeek] || '';
    const monthName = this.monthLabels[month] || '';
    
    const dayWithSuffix = day + this.getOrdinalSuffix(day);
    const dayPadded = day.toString().padStart(2, '0');
    const monthPadded = (month + 1).toString().padStart(2, '0');
    
    // Manejar diferentes formatos
    switch (this.dateFormat) {
      case 'day_mm_dd':
        // Monday, February 1st
        return `${dayName}, ${monthName} ${dayWithSuffix}`;
      
      case 'day_dd_mm':
        // Monday, 1. February
        return `${dayName}, ${day}. ${monthName}`;
      
      case 'mm_dd':
        // February 1st
        return `${monthName} ${dayWithSuffix}`;
      
      case 'dd_mm':
        // 1. February
        return `${day}. ${monthName}`;
      
      case 'day_dd_mm_numeric':
        // Monday, 01. 02.
        return `${dayName}, ${dayPadded}. ${monthPadded}.`;
      
      case 'dd_mm_numeric':
        // 01. 02.
        return `${dayPadded}. ${monthPadded}.`;
      
      default:
        // Fallback: February 1st
        return `${monthName} ${dayWithSuffix}`;
    }
  }
}

// Registrar el custom element cuando el DOM esté listo
if (typeof customElements !== 'undefined') {
  if (!customElements.get('dynamic-dates')) {
    customElements.define('dynamic-dates', DynamicDates);
  }
} else {
  // Fallback para navegadores antiguos
  document.addEventListener('DOMContentLoaded', function() {
    if (!customElements.get('dynamic-dates')) {
      customElements.define('dynamic-dates', DynamicDates);
    }
  });
}
