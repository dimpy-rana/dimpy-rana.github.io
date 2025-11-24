document.addEventListener('DOMContentLoaded', () => {
    
    // --- Navigation Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // --- Smooth Scrolling ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // --- Number Counter Animation ---
    const stats = document.querySelectorAll('.stat-number');
    
    const animateStats = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = +entry.target.getAttribute('data-target');
                const duration = 2000; // ms
                const increment = target / (duration / 16); // 60fps
                
                let current = 0;
                const updateCount = () => {
                    current += increment;
                    if (current < target) {
                        entry.target.innerText = Math.ceil(current);
                        requestAnimationFrame(updateCount);
                    } else {
                        entry.target.innerText = target;
                    }
                };
                updateCount();
                observer.unobserve(entry.target);
            }
        });
    };

    const statsObserver = new IntersectionObserver(animateStats, {
        threshold: 0.5
    });

    stats.forEach(stat => {
        statsObserver.observe(stat);
    });

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.project-card, .skill-category, .achievement-item');
    
    const revealOnScroll = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealOnScroll, {
        threshold: 0.1
    });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s ease-out';
        revealObserver.observe(el);
    });

    // --- Contact Form Handling ---
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;
            
            btn.innerText = 'Sending...';
            btn.style.opacity = '0.7';
            
            // Simulate sending
            setTimeout(() => {
                btn.innerText = 'Inquiry Sent';
                btn.style.background = 'var(--accent-primary)';
                btn.style.color = '#000';
                
                // Reset form
                contactForm.reset();
                
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.background = 'transparent';
                    btn.style.color = 'var(--accent-primary)';
                    btn.style.opacity = '1';
                }, 3000);
            }, 1500);
        });
    }

    // --- Large Molecular Background Animation ---
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const heroBg = document.getElementById('particles-js');
    
    if (heroBg) {
        heroBg.appendChild(canvas);
        
        let width, height;
        let molecules = [];
        
        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        
        window.addEventListener('resize', resize);
        resize();
        
        let mouse = { x: null, y: null };
        
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Molecule {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.2; // Slightly faster base speed
                this.vy = (Math.random() - 0.5) * 0.2;
                this.rotation = Math.random() * Math.PI * 2;
                this.rotationSpeed = (Math.random() - 0.5) * 0.002;
                this.size = Math.random() * 100 + 150; 
                this.type = Math.floor(Math.random() * 3); 
                this.opacity = Math.random() * 0.1 + 0.05; 
            }
            
            update() {
                // Mouse interaction
                if (mouse.x != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    let forceDirectionX = dx / distance;
                    let forceDirectionY = dy / distance;
                    let maxDistance = 300;
                    let force = (maxDistance - distance) / maxDistance;
                    
                    if (distance < maxDistance) {
                        this.vx -= forceDirectionX * force * 0.05;
                        this.vy -= forceDirectionY * force * 0.05;
                    }
                }

                this.x += this.vx;
                this.y += this.vy;
                this.rotation += this.rotationSpeed;
                
                // Friction to return to normal speed
                this.vx *= 0.99; 
                this.vy *= 0.99;

                // Minimum speed maintenance
                if (Math.abs(this.vx) < 0.1) this.vx += (Math.random() - 0.5) * 0.01;
                if (Math.abs(this.vy) < 0.1) this.vy += (Math.random() - 0.5) * 0.01;

                // Wrap around
                if (this.x < -this.size) this.x = width + this.size;
                if (this.x > width + this.size) this.x = -this.size;
                if (this.y < -this.size) this.y = height + this.size;
                if (this.y > height + this.size) this.y = -this.size;
            }
            
            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);
                ctx.strokeStyle = `rgba(57, 255, 20, ${this.opacity})`;
                ctx.lineWidth = 2;
                
                if (this.type === 0) {
                    this.drawHexagon(0, 0, this.size / 2);
                    ctx.beginPath();
                    ctx.arc(0, 0, this.size / 4, 0, Math.PI * 2);
                    ctx.stroke();
                } else if (this.type === 1) {
                    this.drawHexagon(-this.size/2, 0, this.size / 3);
                    this.drawHexagon(this.size/2, 0, this.size / 3);
                    ctx.beginPath();
                    ctx.moveTo(-this.size/6, 0);
                    ctx.lineTo(this.size/6, 0);
                    ctx.stroke();
                } else {
                    this.drawHexagon(0, -this.size/3, this.size / 4);
                    this.drawHexagon(-this.size/3, this.size/3, this.size / 4);
                    this.drawHexagon(this.size/3, this.size/3, this.size / 4);
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(0, -this.size/12);
                    ctx.stroke();
                }
                
                ctx.restore();
            }
            
            drawHexagon(x, y, radius) {
                ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                    const angle = (Math.PI / 3) * i;
                    const hx = x + Math.cos(angle) * radius;
                    const hy = y + Math.sin(angle) * radius;
                    if (i === 0) ctx.moveTo(hx, hy);
                    else ctx.lineTo(hx, hy);
                }
                ctx.closePath();
                ctx.stroke();
            }
        }
        
        const initMolecules = () => {
            molecules = [];
            for (let i = 0; i < 8; i++) { 
                molecules.push(new Molecule());
            }
        };
        
        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            
            molecules.forEach(m => {
                m.update();
                m.draw();
            });
            
            requestAnimationFrame(animate);
        };
        
        initMolecules();
        animate();
    }
});
