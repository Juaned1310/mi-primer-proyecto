/**
 * Comparison Slider Component
 * Before & After image slider with draggable handle
 */

class ComparisonSlider extends HTMLElement {
  constructor() {
    super();
    this.input = null;
    this.overlay = null;
    this.line = null;
    this.isDragging = false;
  }

  connectedCallback() {
    this.input = this.querySelector('.comparison-slider__input');
    this.overlay = this.querySelector('.comparison-slider__overlay');
    this.line = this.querySelector('.comparison-slider__line');
    
    if (!this.input || !this.overlay || !this.line) return;
    
    // Eventos del input range
    this.input.addEventListener('input', this.handleInput.bind(this));
    
    // Eventos de mouse para arrastrar
    this.line.addEventListener('mousedown', this.startDrag.bind(this));
    document.addEventListener('mousemove', this.handleDrag.bind(this));
    document.addEventListener('mouseup', this.stopDrag.bind(this));
    
    // Eventos táctiles para móviles
    this.line.addEventListener('touchstart', this.startDrag.bind(this));
    document.addEventListener('touchmove', this.handleDrag.bind(this));
    document.addEventListener('touchend', this.stopDrag.bind(this));
    
    // Click directo en el slider
    this.addEventListener('click', this.handleClick.bind(this));
    
    // Inicializar posición
    this.updatePosition(50);
  }

  disconnectedCallback() {
    document.removeEventListener('mousemove', this.handleDrag.bind(this));
    document.removeEventListener('mouseup', this.stopDrag.bind(this));
    document.removeEventListener('touchmove', this.handleDrag.bind(this));
    document.removeEventListener('touchend', this.stopDrag.bind(this));
  }

  startDrag(e) {
    this.isDragging = true;
    e.preventDefault();
  }

  stopDrag() {
    this.isDragging = false;
  }

  handleDrag(e) {
    if (!this.isDragging) return;
    
    e.preventDefault();
    const rect = this.getBoundingClientRect();
    const x = (e.type.includes('touch') ? e.touches[0].clientX : e.clientX) - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    
    this.input.value = percentage;
    this.updatePosition(percentage);
  }

  handleClick(e) {
    // No procesar si se hizo click en la línea (ya se maneja con drag)
    if (e.target.closest('.comparison-slider__line')) return;
    
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    
    this.input.value = percentage;
    this.updatePosition(percentage);
  }

  handleInput(e) {
    this.updatePosition(e.target.value);
  }

  updatePosition(value) {
    if (!this.overlay || !this.line) return;
    
    this.overlay.style.width = `${value}%`;
    this.line.style.left = `${value}%`;
  }
}

// Registrar el custom element
if (typeof customElements !== 'undefined') {
  if (!customElements.get('comparison-slider')) {
    customElements.define('comparison-slider', ComparisonSlider);
  }
}
