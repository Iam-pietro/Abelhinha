let highestZ = 1;

class Paper {
  holdingPaper = false;
  touchStartX = 0;
  touchStartY = 0;
  currentPaperX = 0;
  currentPaperY = 0;
  rotation = Math.random() * 30 - 15;
  rotating = false;
  lastX = 0;
  lastY = 0;
  velocityX = 0;
  velocityY = 0;

  init(paper) {
    // Eventos para mouse (desktop)
    paper.addEventListener('mousedown', (e) => this.startDrag(e, paper));
    document.addEventListener('mousemove', (e) => this.drag(e, paper));
    document.addEventListener('mouseup', () => this.stopDrag());

    // Eventos para toque (mobile)
    paper.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const fakeEvent = { button: 0, clientX: touch.clientX, clientY: touch.clientY };
      this.startDrag(fakeEvent, paper);
    });
    
    document.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const fakeEvent = { clientX: touch.clientX, clientY: touch.clientY };
      this.drag(fakeEvent, paper);
    });
    
    document.addEventListener('touchend', () => this.stopDrag());
    
    // Prevenir menu de contexto no mobile (para não atrapalhar)
    paper.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  startDrag(e, paper) {
    if (this.holdingPaper) return;
    
    this.holdingPaper = true;
    paper.style.zIndex = highestZ;
    highestZ++;
    
    // Remove o hint após interagir
    if (paper.classList.contains('hint')) {
      setTimeout(() => {
        paper.style.opacity = '0';
        paper.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
          paper.style.display = 'none';
        }, 500);
      }, 100);
    }
    
    // Detectar se é clique direito ou toque com dois dedos para rotacionar
    if (e.button === 2) {
      this.rotating = true;
    }
    
    this.lastX = e.clientX;
    this.lastY = e.clientY;
    this.touchStartX = e.clientX;
    this.touchStartY = e.clientY;
  }

  drag(e, paper) {
    if (!this.holdingPaper) return;
    
    const deltaX = e.clientX - this.lastX;
    const deltaY = e.clientY - this.lastY;
    
    if (!this.rotating) {
      this.currentPaperX += deltaX;
      this.currentPaperY += deltaY;
    } else {
      // Rotaciona baseado no movimento horizontal
      this.rotation += deltaX * 0.5;
    }
    
    this.lastX = e.clientX;
    this.lastY = e.clientY;
    
    paper.style.transform = `
      translateX(${this.currentPaperX}px) 
      translateY(${this.currentPaperY}px) 
      rotateZ(${this.rotation}deg)
    `;
  }

  stopDrag() {
    this.holdingPaper = false;
    this.rotating = false;
  }
}

// Inicializar todos os papéis
const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach((paper, index) => {
  if (paper.classList.contains('hint')) {
    paper.style.zIndex = 10000;
  } else {
    paper.style.zIndex = papers.length - index;
  }
  
  const p = new Paper();
  p.init(paper);
});

// Ajuste para garantir que o body não role em dispositivos móveis
document.body.addEventListener('touchmove', (e) => {
  if (e.target.closest('.paper')) {
    e.preventDefault();
  }
}, { passive: false });