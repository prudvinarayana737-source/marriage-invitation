document.addEventListener('DOMContentLoaded', () => {

    // Elements
    const entranceOverlay = document.getElementById('entranceOverlay');
    const enterBtn = document.getElementById('enterBtn');
    const mainContent = document.getElementById('mainContent');
    const bgMusic = document.getElementById('bgMusic');
    const fadeItems = document.querySelectorAll('.fade-item');

    let audioPlaying = false;

    // Disable scrolling on initial load
    document.body.style.overflow = 'hidden';

    // Handle Entry
    enterBtn.addEventListener('click', () => {
        // Try to play local audio IMMEDIATELY
        if (bgMusic) {
            bgMusic.play().then(() => {
                audioPlaying = true;
            }).catch(e => {
                console.log("Audio play failed:", e);
            });
        }

        // Fade out overlay
        entranceOverlay.classList.add('fade-out');

        // After fade out, remove from DOM flow and show main content
        setTimeout(() => {
            entranceOverlay.style.display = 'none';
            mainContent.classList.remove('hidden');
            
            // Trigger main content fade-in
            setTimeout(() => {
                mainContent.classList.add('show');
            }, 500);

            document.body.style.overflow = 'auto'; // Enable scrolling

            // Scroll-triggered reveal logic
            const revealObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('show');
                    }
                });
            }, { 
                threshold: 0.15,
                rootMargin: "0px 0px -50px 0px" // Trigger slightly before it hits the center
            });

            fadeItems.forEach(item => {
                revealObserver.observe(item);
            });

            // Continuous scroll-linked movement (parallax)
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                fadeItems.forEach((item, index) => {
                    const rect = item.getBoundingClientRect();
                    const viewHeight = window.innerHeight;
                    
                    // Only move if visible
                    if (rect.top < viewHeight && rect.bottom > 0) {
                        const relativePos = (rect.top + rect.height / 2) / viewHeight;
                        const movement = (relativePos - 0.5) * 40; // Subtle drift
                        
                        if (item.classList.contains('left')) {
                            item.style.transform = `translateX(${movement}px)`;
                        } else if (item.classList.contains('right')) {
                            item.style.transform = `translateX(${-movement}px)`;
                        } else {
                            item.style.transform = `translateY(${movement * 0.5}px)`;
                        }
                    }
                });
            });

            audioBtn.classList.remove('hidden');

        }, 1500); // Wait a bit longer for the music to start before showing content
    });



    // -----------------------------------------------------
    // BACKGROUND PARTICLE ANIMATION (GOLDEN FIREFLIES)
    // -----------------------------------------------------
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height, particles;

    function init() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;

        particles = [];
        // Adjust number of fireflies based on screen size
        const numParticles = width < 600 ? 80 : 200;

        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
        }
    }

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            // Fireflies slowly float upwards
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 1) * 0.8 - 0.2;
            this.size = Math.random() * 3.5 + 1;
            // Golden color
            this.color = `rgba(212, 175, 55, ${Math.random() * 0.5 + 0.3})`;
            this.glow = Math.random() * 10 + 5;
            this.angle = Math.random() * Math.PI * 2;
            this.spin = (Math.random() - 0.5) * 0.1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.angle += this.spin;

            // Sway slightly left and right
            this.x += Math.sin(this.angle) * 0.3;

            // Wrap around edges
            if (this.y < -10) this.y = height + 10;
            if (this.x < -10) this.x = width + 10;
            if (this.x > width + 10) this.x = -10;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            
            // Twinkle effect
            const twinkle = Math.sin(Date.now() * 0.005 + this.angle) * 0.5 + 0.5;
            ctx.fillStyle = this.color.replace(/[\d.]+\)$/g, `${twinkle * 0.7 + 0.3})`);
            
            ctx.shadowBlur = this.glow * twinkle;
            ctx.shadowColor = '#D4AF37'; // Gold glow
            ctx.fill();
            // Reset shadow to not affect other things
            ctx.shadowBlur = 0;
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    }

    // Handle Window Resize
    window.addEventListener('resize', () => {
        init();
    });

    // Start
    init();
    animate();

    // Fireworks Trigger at the end of the page
    const fireworksTrigger = document.getElementById('fireworks-trigger');
    if (fireworksTrigger) {
        let fireworksFired = false;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !fireworksFired) {
                    fireworksFired = true;
                    if (typeof confetti === 'function') {
                        const duration = 5 * 1000;
                        const animationEnd = Date.now() + duration;
                        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };
                        function randomInRange(min, max) { return Math.random() * (max - min) + min; }
                        const interval = setInterval(function() {
                            const timeLeft = animationEnd - Date.now();
                            if (timeLeft <= 0) { return clearInterval(interval); }
                            const particleCount = 50 * (timeLeft / duration);
                            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
                            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
                        }, 250);
                    }
                }
            });
        }, { threshold: 0.1 });
        observer.observe(fireworksTrigger);
    }



    // Flower Rain Logic
    const flowers = ['🌸', '💮', '🌺', '🌼', '✨'];
    function createFlowerRain(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        setInterval(() => {
            const flower = document.createElement('div');
            flower.className = 'flower';
            flower.innerText = flowers[Math.floor(Math.random() * flowers.length)];
            flower.style.left = Math.random() * 100 + '%';
            flower.style.animationDuration = (Math.random() * 2 + 3) + 's';
            flower.style.fontSize = (Math.random() * 8 + 8) + 'px';
            
            container.appendChild(flower);

            // Remove flower after animation
            setTimeout(() => {
                flower.remove();
            }, 5000);
        }, 400);
    }

    createFlowerRain('groomFlowers');
    createFlowerRain('brideFlowers');

});
