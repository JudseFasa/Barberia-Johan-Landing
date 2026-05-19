/* script.js - Landing Page Simulator Logic */

// Global State for Simulators
let currentPlatform = 'web';

// Web Simulator Choices
let webBookingData = {
  barbero: '',
  servicio: '',
  hora: ''
};

// Telegram Chat History States
let tgCurrentStep = 0; // 0: start, 1: choosing barbero, 2: choosing service, 3: choosing hour, 4: complete

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  resetWebSim();
  resetTelegramSim();
});

// Switch between Web and Telegram Simulator Views
function switchSimulator(platform) {
  currentPlatform = platform;

  // Update toggle buttons
  const btnWeb = document.getElementById('toggle-web');
  const btnTelegram = document.getElementById('toggle-telegram');

  const screenWeb = document.getElementById('screen-web');
  const screenTelegram = document.getElementById('screen-telegram');

  if (platform === 'web') {
    btnWeb.classList.add('active');
    btnTelegram.classList.remove('active');
    screenWeb.classList.add('active');
    screenTelegram.classList.remove('active');

    // Update step description highlights for Web
    document.getElementById('step-desc-1').className = "sim-step-item active";
    document.getElementById('step-desc-2').className = "sim-step-item";
    document.getElementById('step-desc-3').className = "sim-step-item";

    document.getElementById('step-title-1').innerText = "Seleccionar Barbero";
    document.getElementById('step-text-1').innerText = "Elige a tu profesional de confianza para el servicio.";
    document.getElementById('step-title-2').innerText = "Seleccionar Servicio";
    document.getElementById('step-text-2').innerText = "Elige el servicio o combo que deseas realizarte.";
    document.getElementById('step-title-3').innerText = "Confirmar y Agendar";
    document.getElementById('step-text-3').innerText = "Elige fecha, hora y confirma tu reserva al instante.";
  } else {
    btnWeb.classList.remove('active');
    btnTelegram.classList.add('active');
    screenWeb.classList.remove('active');
    screenTelegram.classList.add('active');

    // Update step description highlights for Telegram
    document.getElementById('step-desc-1').className = "sim-step-item active-telegram active";
    document.getElementById('step-desc-2').className = "sim-step-item";
    document.getElementById('step-desc-3').className = "sim-step-item";

    document.getElementById('step-title-1').innerText = "Enviar Comando /start";
    document.getElementById('step-text-1').innerText = "Inicia el bot y selecciona la opción de Agendar.";
    document.getElementById('step-title-2').innerText = "Teclados Inline Interactivos";
    document.getElementById('step-text-2').innerText = "Selecciona barbero y servicio tocando los botones del chat.";
    document.getElementById('step-title-3').innerText = "Confirmación en el Chat";
    document.getElementById('step-text-3').innerText = "El bot agenda la cita y te envía la confirmación con los datos.";
  }
}

// ----------------------------------------------------
// WEB APP SIMULATOR LOGIC
// ----------------------------------------------------

function resetWebSim() {
  webBookingData = { barbero: '', servicio: '', hora: '' };

  // Reset all steps visibility
  document.getElementById('web-step-1').classList.add('active');
  document.getElementById('web-step-2').classList.remove('active');
  document.getElementById('web-step-3').classList.remove('active');
  document.getElementById('web-step-4').classList.remove('active');

  if (currentPlatform === 'web') {
    updateStepIndicator(1);
  }
}

function webNextStep(currentStepNumber, value) {
  if (currentStepNumber === 1) {
    webBookingData.barbero = value;
    document.getElementById('web-step-1').classList.remove('active');
    document.getElementById('web-step-2').classList.add('active');
    updateStepIndicator(2);
  } else if (currentStepNumber === 2) {
    webBookingData.servicio = value;
    document.getElementById('web-step-2').classList.remove('active');
    document.getElementById('web-step-3').classList.add('active');
    updateStepIndicator(3);
  } else if (currentStepNumber === 3) {
    webBookingData.hora = value;
    document.getElementById('web-step-3').classList.remove('active');

    // Fill success info
    document.getElementById('summary-web-barbero').innerText = webBookingData.barbero;
    document.getElementById('summary-web-servicio').innerText = webBookingData.servicio;
    document.getElementById('summary-web-hora').innerText = webBookingData.hora;

    document.getElementById('web-step-4').classList.add('active');
  }
}

function updateStepIndicator(activeStep) {
  document.getElementById('step-desc-1').className = "sim-step-item" + (activeStep === 1 ? (currentPlatform === 'web' ? " active" : " active-telegram active") : "");
  document.getElementById('step-desc-2').className = "sim-step-item" + (activeStep === 2 ? (currentPlatform === 'web' ? " active" : " active-telegram active") : "");
  document.getElementById('step-desc-3').className = "sim-step-item" + (activeStep === 3 ? (currentPlatform === 'web' ? " active" : " active-telegram active") : "");
}


// ----------------------------------------------------
// TELEGRAM BOT SIMULATOR LOGIC
// ----------------------------------------------------

function resetTelegramSim() {
  const container = document.getElementById('tg-chat-container');
  container.innerHTML = `
    <div class="tg-msg-group">
      <div class="tg-msg sent">/start</div>
    </div>
    
    <div class="tg-msg-group">
      <div class="tg-msg received">💈 ¡Bienvenido a Pinta Barber Shop! Selecciona una opción:</div>
      <div class="tg-inline-keyboard">
        <button class="tg-inline-btn" onclick="tgSelectStart('agendar')">📅 Agendar Cita</button>
        <button class="tg-inline-btn" onclick="tgSelectStart('ver')">🔍 Ver mis citas</button>
      </div>
    </div>
  `;
  tgCurrentStep = 0;
  if (currentPlatform === 'telegram') {
    updateStepIndicator(1);
  }
}

function appendTelegramSentMessage(text) {
  const container = document.getElementById('tg-chat-container');
  const msgGroup = document.createElement('div');
  msgGroup.className = 'tg-msg-group';
  msgGroup.innerHTML = `<div class="tg-msg sent">${text}</div>`;
  container.appendChild(msgGroup);
  scrollTgChat();
}

function simulateTelegramTyping(callback) {
  const container = document.getElementById('tg-chat-container');
  const typingGroup = document.createElement('div');
  typingGroup.className = 'tg-msg-group';
  typingGroup.id = 'tg-typing-placeholder';
  typingGroup.innerHTML = `<div class="tg-msg received" style="color: #6b849c; font-style: italic;">escribiendo...</div>`;
  container.appendChild(typingGroup);
  scrollTgChat();

  setTimeout(() => {
    const placeholder = document.getElementById('tg-typing-placeholder');
    if (placeholder) {
      placeholder.remove();
    }
    callback();
  }, 800);
}

function scrollTgChat() {
  const container = document.getElementById('tg-chat-container');
  container.scrollTop = container.scrollHeight;
}

function tgSelectStart(option) {
  if (tgCurrentStep !== 0) return;

  // Disable previous buttons visually
  disableLastKeyboard();

  if (option === 'agendar') {
    appendTelegramSentMessage('📅 Agendar Cita');
    tgCurrentStep = 1;
    updateStepIndicator(2);

    simulateTelegramTyping(() => {
      const container = document.getElementById('tg-chat-container');
      const responseGroup = document.createElement('div');
      responseGroup.className = 'tg-msg-group';
      responseGroup.innerHTML = `
        <div class="tg-msg received">🧔 Excelente. Selecciona el barbero de tu preferencia:</div>
        <div class="tg-inline-keyboard">
          <button class="tg-inline-btn" onclick="tgSelectBarbero('Jhon Reales')">💈 Jhon Reales</button>
          <button class="tg-inline-btn" onclick="tgSelectBarbero('Sebastián C')">💈 Sebastián C</button>
        </div>
      `;
      container.appendChild(responseGroup);
      scrollTgChat();
    });
  } else {
    appendTelegramSentMessage('🔍 Ver mis citas');
    simulateTelegramTyping(() => {
      const container = document.getElementById('tg-chat-container');
      const responseGroup = document.createElement('div');
      responseGroup.className = 'tg-msg-group';
      responseGroup.innerHTML = `
        <div class="tg-msg received">Actualmente no tienes citas agendadas con tu ID. ¿Deseas agendar una nueva?</div>
        <div class="tg-inline-keyboard">
          <button class="tg-inline-btn" onclick="resetTelegramSim()">📅 Sí, agendar cita</button>
        </div>
      `;
      container.appendChild(responseGroup);
      scrollTgChat();
    });
  }
}

function tgSelectBarbero(barberName) {
  if (tgCurrentStep !== 1) return;
  disableLastKeyboard();

  appendTelegramSentMessage(barberName);
  tgCurrentStep = 2;

  simulateTelegramTyping(() => {
    const container = document.getElementById('tg-chat-container');
    const responseGroup = document.createElement('div');
    responseGroup.className = 'tg-msg-group';
    responseGroup.innerHTML = `
      <div class="tg-msg received">✨ ¿Qué servicio te vas a realizar hoy con ${barberName}?</div>
      <div class="tg-inline-keyboard">
        <button class="tg-inline-btn" onclick="tgSelectServicio('Corte Clásico / Moderno')">✂️ Corte Clásico / Moderno ($17.000)</button>
        <button class="tg-inline-btn" onclick="tgSelectServicio('Corte + Barba + Cejas')">✨ Combo Premium ($22.000)</button>
        <button class="tg-inline-btn" onclick="tgSelectServicio('Barba Detallada')">🧔 Barba Detallada ($8.000)</button>
        <button class="tg-inline-btn" onclick="tgSelectServicio('Líneas y Diseños')">🧔 Líneas y Diseños ($3.000)</button>
      </div>
    `;
    container.appendChild(responseGroup);
    scrollTgChat();
  });
}

function tgSelectServicio(serviceName) {
  if (tgCurrentStep !== 2) return;
  disableLastKeyboard();

  appendTelegramSentMessage(serviceName);
  tgCurrentStep = 3;
  updateStepIndicator(3);

  simulateTelegramTyping(() => {
    const container = document.getElementById('tg-chat-container');
    const responseGroup = document.createElement('div');
    responseGroup.className = 'tg-msg-group';
    responseGroup.innerHTML = `
      <div class="tg-msg received">📅 Selecciona un horario disponible para mañana:</div>
      <div class="tg-inline-keyboard tg-inline-grid">
        <button class="tg-inline-btn" onclick="tgSelectHora('09:00 AM')">09:00 AM</button>
        <button class="tg-inline-btn" onclick="tgSelectHora('11:30 AM')">11:30 AM</button>
        <button class="tg-inline-btn" onclick="tgSelectHora('03:30 PM')">03:30 PM</button>
        <button class="tg-inline-btn" onclick="tgSelectHora('05:00 PM')">05:00 PM</button>
      </div>
    `;
    container.appendChild(responseGroup);
    scrollTgChat();
  });
}

function tgSelectHora(hora) {
  if (tgCurrentStep !== 3) return;
  disableLastKeyboard();

  appendTelegramSentMessage(hora);
  tgCurrentStep = 4;

  simulateTelegramTyping(() => {
    const container = document.getElementById('tg-chat-container');
    const responseGroup = document.createElement('div');
    responseGroup.className = 'tg-msg-group';
    responseGroup.innerHTML = `
      <div class="tg-msg received">✅ <b>¡Tu cita ha sido reservada con éxito!</b><br><br>📋 <b>Resumen del agendamiento:</b><br>• Barbero: Jhon Reales<br>• Servicio: Corte y Estilo<br>• Horario: Mañana a las ${hora}<br><br>Recibirás un recordatorio en este chat 2 horas antes. ¡Nos vemos pronto!</div>
      <div class="tg-inline-keyboard" style="margin-top: 8px;">
        <button class="tg-inline-btn" onclick="resetTelegramSim()">🔄 Agendar otra cita</button>
      </div>
    `;
    container.appendChild(responseGroup);
    scrollTgChat();
  });
}

function disableLastKeyboard() {
  const keyb = document.querySelectorAll('.tg-inline-keyboard');
  if (keyb.length > 0) {
    const lastKeyb = keyb[keyb.length - 1];
    const buttons = lastKeyb.querySelectorAll('button');
    buttons.forEach(btn => {
      btn.style.opacity = '0.5';
      btn.style.pointerEvents = 'none';
    });
  }
}
