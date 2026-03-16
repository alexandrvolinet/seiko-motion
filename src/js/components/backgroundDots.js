import { gsap } from "gsap";

const CONFIG = {
    dotCount: 50,          // Количество точек
    minSize: 2,           // Минимальный размер
    maxSize: 5,           // Максимальный размер
    minOpacity: 0.3,      // Минимальная opacity
    maxOpacity: 1,        // Максимальная opacity
    minDuration: 2,       // Минимальная длительность анимации
    maxDuration: 5,       // Максимальная длительность анимации
    minDelay: 0,          // Минимальная задержка
    maxDelay: 3           // Максимальная задержка
};

function random(min, max) {
    return Math.random() * (max - min) + min;
}

export function createBackgroundDots() {
    const container = document.createElement('div');
    container.className = 'background-dots';
    document.body.appendChild(container);

    for (let i = 0; i < CONFIG.dotCount; i++) {
        const dot = document.createElement('div');
        dot.className = 'background-dot';
        
        const size = random(CONFIG.minSize, CONFIG.maxSize);
        const x = random(0, 100);
        const y = random(0, 100);
        const duration = random(CONFIG.minDuration, CONFIG.maxDuration);
        const delay = random(CONFIG.minDelay, CONFIG.maxDelay);
        
        dot.style.cssText = `
            left: ${x}%;
            top: ${y}%;
            width: ${size}px;
            height: ${size}px;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
        `;
        
        container.appendChild(dot);
    }
}
