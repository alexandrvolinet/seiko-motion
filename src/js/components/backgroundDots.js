import { gsap } from "gsap";

const CONFIG = {
    dotCount: 50,         
    minSize: 2,           
    maxSize: 5,           
    minOpacity: 0.3,      
    maxOpacity: 1,        
    minDuration: 2,       
    maxDuration: 5,       
    minDelay: 0,          
    maxDelay: 3           
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
