import { Injectable } from '@angular/core';

export interface TourStep {
  element: string;
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

@Injectable({
  providedIn: 'root'
})
export class TourService {
  private currentStep = 0;
  private steps: TourStep[] = [
    {
      element: '.search-bar',
      title: '🔍 Búsqueda de Ubicación',
      description: 'Usa esta barra para buscar y seleccionar tu ubicación de destino. Puedes escribir direcciones, lugares o puntos de referencia.',
      position: 'bottom'
    },
    {
      element: '.map-image',
      title: '🗺️ Mapa Interactivo',
      description: 'Visualiza tu ubicación actual y destino en el mapa. El marcador rojo indica la ubicación seleccionada.',
      position: 'right'
    },
    {
      element: '.view-more-button',
      title: '📍 Opciones del Mapa',
      description: 'Puedes ampliar el mapa para una mejor visualización o ver el mapa completo con más detalles de la ruta.',
      position: 'top'
    },
    {
      element: '.distance',
      title: '📏 Distancia del Viaje',
      description: 'Aquí se muestra la distancia estimada desde tu ubicación hasta el destino seleccionado.',
      position: 'bottom'
    },
    {
      element: '.driver-card',
      title: '👤 Conductor Disponible',
      description: 'Información del conductor asignado: modelo de vehículo, placa, nombre y calificación. Esto te ayuda a identificar tu viaje.',
      position: 'bottom'
    },
    {
      element: '.booking-options',
      title: '✅ Confirmar Reserva',
      description: '¿Deseas continuar con este viaje? Selecciona "SÍ" para proceder con la reserva o "NO" para cancelar.',
      position: 'top'
    },
    {
      element: '.request-button',
      title: '🚗 Solicitar Viaje',
      description: 'Una vez confirmado, haz clic aquí para solicitar oficialmente tu viaje. Serás redirigido a la página de reserva final.',
      position: 'top'
    }
  ];

  private overlay: HTMLElement | null = null;
  private tooltip: HTMLElement | null = null;
  private isActive = false;

  init() {
    this.createStyles();
    this.createOverlay();
    this.createTooltip();
    this.createStartButton();
  }

  private createStyles() {
    if (document.getElementById('tour-styles')) return;
    
    const styles = `
      .tour-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        z-index: 9998;
        transition: opacity 0.3s ease;
      }

      .tour-highlight {
        position: relative;
        z-index: 9999 !important;
        box-shadow: 0 0 0 4px #2196F3, 0 0 0 8px rgba(33, 150, 243, 0.3);
        border-radius: 8px;
        background: white;
        animation: pulse 2s infinite;
      }

      @keyframes pulse {
        0%, 100% {
          box-shadow: 0 0 0 4px #2196F3, 0 0 0 8px rgba(33, 150, 243, 0.3);
        }
        50% {
          box-shadow: 0 0 0 4px #2196F3, 0 0 0 12px rgba(33, 150, 243, 0.5);
        }
      }

      .tour-tooltip {
        position: fixed;
        background: white;
        border-radius: 12px;
        padding: 20px;
        max-width: 350px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        font-family: 'Roboto', sans-serif;
        animation: fadeInUp 0.4s ease;
      }

      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .tour-tooltip-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
      }

      .tour-tooltip-title {
        font-size: 18px;
        font-weight: 600;
        color: #1976D2;
        margin: 0;
      }

      .tour-tooltip-close {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #666;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background 0.2s;
      }

      .tour-tooltip-close:hover {
        background: #f5f5f5;
      }

      .tour-tooltip-description {
        color: #555;
        line-height: 1.6;
        margin-bottom: 20px;
        font-size: 14px;
      }

      .tour-tooltip-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .tour-tooltip-progress {
        color: #666;
        font-size: 13px;
        font-weight: 500;
      }

      .tour-tooltip-buttons {
        display: flex;
        gap: 10px;
      }

      .tour-btn {
        padding: 8px 20px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.2s;
        font-family: 'Roboto', sans-serif;
      }

      .tour-btn-skip {
        background: #f5f5f5;
        color: #666;
      }

      .tour-btn-skip:hover {
        background: #e0e0e0;
      }

      .tour-btn-prev {
        background: #e3f2fd;
        color: #1976D2;
      }

      .tour-btn-prev:hover {
        background: #bbdefb;
      }

      .tour-btn-next {
        background: #1976D2;
        color: white;
      }

      .tour-btn-next:hover {
        background: #1565C0;
      }

      .tour-btn-finish {
        background: #4CAF50;
        color: white;
      }

      .tour-btn-finish:hover {
        background: #45a049;
      }

      .tour-start-btn {
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: #1976D2;
        color: white;
        border: none;
        border-radius: 50%;
        width: 60px;
        height: 60px;
        font-size: 24px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .tour-start-btn:hover {
        background: #1565C0;
        transform: scale(1.1);
      }

      .tour-arrow {
        position: absolute;
        width: 0;
        height: 0;
        border: 10px solid transparent;
      }

      .tour-arrow-top {
        bottom: -20px;
        left: 50%;
        transform: translateX(-50%);
        border-top-color: white;
      }

      .tour-arrow-bottom {
        top: -20px;
        left: 50%;
        transform: translateX(-50%);
        border-bottom-color: white;
      }

      .tour-arrow-left {
        right: -20px;
        top: 50%;
        transform: translateY(-50%);
        border-left-color: white;
      }

      .tour-arrow-right {
        left: -20px;
        top: 50%;
        transform: translateY(-50%);
        border-right-color: white;
      }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.id = 'tour-styles';
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
  }

  private createOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'tour-overlay';
    this.overlay.style.display = 'none';
  }

  private createTooltip() {
    this.tooltip = document.createElement('div');
    this.tooltip.className = 'tour-tooltip';
    this.tooltip.style.display = 'none';
  }

  private createStartButton() {
    if (document.querySelector('.tour-start-btn')) return;

    const button = document.createElement('button');
    button.className = 'tour-start-btn';
    button.innerHTML = '?';
    button.title = 'Iniciar tour guiado';
    button.addEventListener('click', () => this.start());
    document.body.appendChild(button);
  }

  start() {
    if (this.isActive) return;
    
    this.isActive = true;
    this.currentStep = 0;
    document.body.appendChild(this.overlay!);
    document.body.appendChild(this.tooltip!);
    this.overlay!.style.display = 'block';
    this.showStep();
  }

  private showStep() {
    const step = this.steps[this.currentStep];
    const element = document.querySelector(step.element);
    
    if (!element) {
      console.warn(`Elemento no encontrado: ${step.element}`);
      this.next();
      return;
    }

    // Remover highlight anterior
    document.querySelectorAll('.tour-highlight').forEach(el => {
      el.classList.remove('tour-highlight');
    });

    // Agregar highlight al elemento actual
    (element as HTMLElement).classList.add('tour-highlight');
    
    // Scroll al elemento
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Actualizar tooltip
    this.updateTooltip(step, element as HTMLElement);
  }

  private updateTooltip(step: TourStep, element: HTMLElement) {
    const rect = element.getBoundingClientRect();
    
    this.tooltip!.innerHTML = `
      <div class="tour-tooltip-header">
        <h3 class="tour-tooltip-title">${step.title}</h3>
        <button class="tour-tooltip-close">×</button>
      </div>
      <p class="tour-tooltip-description">${step.description}</p>
      <div class="tour-tooltip-footer">
        <span class="tour-tooltip-progress">${this.currentStep + 1} de ${this.steps.length}</span>
        <div class="tour-tooltip-buttons">
          ${this.currentStep > 0 ? '<button class="tour-btn tour-btn-prev">Anterior</button>' : ''}
          ${this.currentStep < this.steps.length - 1 
            ? '<button class="tour-btn tour-btn-next">Siguiente</button>'
            : '<button class="tour-btn tour-btn-finish">Finalizar</button>'
          }
        </div>
      </div>
      <div class="tour-arrow tour-arrow-${step.position}"></div>
    `;

    // Agregar event listeners a los botones
    const closeBtn = this.tooltip!.querySelector('.tour-tooltip-close');
    const prevBtn = this.tooltip!.querySelector('.tour-btn-prev');
    const nextBtn = this.tooltip!.querySelector('.tour-btn-next');
    const finishBtn = this.tooltip!.querySelector('.tour-btn-finish');

    closeBtn?.addEventListener('click', () => this.end());
    prevBtn?.addEventListener('click', () => this.prev());
    nextBtn?.addEventListener('click', () => this.next());
    finishBtn?.addEventListener('click', () => this.end());

    this.tooltip!.style.display = 'block';
    this.positionTooltip(step.position, rect);
  }

  private positionTooltip(position: string, rect: DOMRect) {
    const tooltip = this.tooltip!;
    const tooltipRect = tooltip.getBoundingClientRect();
    const spacing = 30;

    let top, left;

    switch(position) {
      case 'bottom':
        top = rect.bottom + spacing;
        left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        break;
      case 'top':
        top = rect.top - tooltipRect.height - spacing;
        left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        break;
      case 'right':
        top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
        left = rect.right + spacing;
        break;
      case 'left':
        top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
        left = rect.left - tooltipRect.width - spacing;
        break;
    }

    // Ajustar si se sale de la pantalla
    if (left! < 10) left = 10;
    if (left! + tooltipRect.width > window.innerWidth - 10) {
      left = window.innerWidth - tooltipRect.width - 10;
    }
    if (top! < 10) top = 10;
    if (top! + tooltipRect.height > window.innerHeight - 10) {
      top = window.innerHeight - tooltipRect.height - 10;
    }

    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
  }

  next() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.showStep();
    }
  }

  prev() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.showStep();
    }
  }

  end() {
    this.isActive = false;
    
    // Remover highlight
    document.querySelectorAll('.tour-highlight').forEach(el => {
      el.classList.remove('tour-highlight');
    });

    // Ocultar overlay y tooltip
    if (this.overlay) {
      this.overlay.style.display = 'none';
      this.overlay.remove();
    }
    if (this.tooltip) {
      this.tooltip.style.display = 'none';
      this.tooltip.remove();
    }

    this.currentStep = 0;
  }
}