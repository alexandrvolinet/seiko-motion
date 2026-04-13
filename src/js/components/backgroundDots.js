import { gsap } from "gsap";

const CONFIG = {
    dotCount: 60,
    minSize: 3,
    maxSize: 6,
    minDuration: 3,
    maxDuration: 7,
    minDelay: 0,
    maxDelay: 5,
    minOpacity: 0.2,
    maxOpacity: 0.9
};

function random(min, max) {
    return Math.random() * (max - min) + min;
}

export function animateBackgroundDots() {
    const container = document.createElement('div');
    container.className = 'space-bg';
    document.body.appendChild(container);

    for (let i = 0; i < CONFIG.dotCount; i++) {
        const dot = document.createElement('div');
        dot.className = 'star';
        
        const size = random(CONFIG.minSize, CONFIG.maxSize);
        const x = random(0, 100);
        const y = random(0, 100);
        
        dot.style.cssText = `
            left: ${x}%;
            top: ${y}%;
            width: ${size}px;
            height: ${size}px;
        `;
        
        container.appendChild(dot);
    }

    const stars = container.querySelectorAll('.star');
    
    stars.forEach(star => {
        const duration = random(CONFIG.minDuration, CONFIG.maxDuration);
        const delay = random(CONFIG.minDelay, CONFIG.maxDelay);
        const opacity = random(CONFIG.minOpacity, CONFIG.maxOpacity);
        
        gsap.fromTo(star, 
            { opacity: 0 },
            {
                opacity: opacity,
                duration: duration,
                delay: delay,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            }
        );
    });
}
