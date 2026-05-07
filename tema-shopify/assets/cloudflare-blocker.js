/**
 * Cloudflare Turnstile Error Blocker
 * Suprime los errores de Cloudflare Turnstile en la consola sin afectar otros componentes
 */

(function() {
  'use strict';
  
  // Interceptar errores de Turnstile en console.error
  const originalError = console.error;
  console.error = function(...args) {
    const errorString = args.join(' ');
    
    // Filtrar solo errores específicos de Cloudflare Turnstile
    if (errorString.includes('TurnstileError') || 
        errorString.includes('[Cloudflare Turnstile]') ||
        errorString.includes('challenges.cloudflare.com')) {
      // No mostrar estos errores
      return;
    }
    
    // Mostrar otros errores normalmente
    originalError.apply(console, args);
  };
  
  // Interceptar errores no capturados SOLO de Turnstile
  window.addEventListener('error', function(event) {
    // Solo bloquear si el error viene de api.js de Cloudflare
    if (event.filename && event.filename.includes('api.js?onload=onloadTurnstileCallback')) {
      event.preventDefault();
      return false;
    }
    
    // Solo bloquear si el mensaje es específicamente de Turnstile
    if (event.message && 
        (event.message.includes('TurnstileError') || 
         event.message.includes('[Cloudflare Turnstile]'))) {
      event.preventDefault();
      return false;
    }
  }, true);
  
  // Interceptar promesas rechazadas SOLO de Turnstile
  window.addEventListener('unhandledrejection', function(event) {
    if (event.reason && 
        (event.reason.toString().includes('TurnstileError') || 
         event.reason.toString().includes('[Cloudflare Turnstile]'))) {
      event.preventDefault();
      return false;
    }
  });
  
})();
