/* ================================================================
   STARLINK ULTRANET — site animations & interactions
   
   ⚙️  CONTACT CONFIG:
       CLIENT_WHATSAPP  → customer form messages land here (client)
       CLIENT_PHONE     → display number for the client
       DEV_WHATSAPP     → ONLY used in footer "Made by Reinhard" (you)
   
   Numbers must be in international format WITHOUT the plus sign.
   ================================================================ */

// ================================================================
// CONTACT CONFIG
// ================================================================
const CLIENT_WHATSAPP = '254110641185'; // 👈 CLIENT's WhatsApp
const CLIENT_PHONE = '0110641185'; // 👈 CLIENT's display number
const DEV_WHATSAPP = '254759592457'; // 👈 YOUR number — footer "Made by" only

// ================================================================
// MAIN SCRIPT
// ================================================================
document.addEventListener('DOMContentLoaded', () => {

    /* ---------------- YEAR ---------------- */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------------- WIRE DYNAMIC NUMBERS ---------------- */
    // Elements with data-contact="*" pull the CLIENT number from the config.
    // Elements with data-dev="*" pull YOUR number (footer only).

    document.querySelectorAll('[data-contact="phone"]').forEach(el => {
        el.href = `tel:${CLIENT_PHONE}`;
    });
    document.querySelectorAll('[data-contact="phone-text"]').forEach(el => {
        el.textContent = CLIENT_PHONE;
    });
    document.querySelectorAll('[data-contact="whatsapp"]').forEach(el => {
        const existing = new URL(el.href, location.origin).searchParams.get('text') || '';
        el.href = `https://wa.me/${CLIENT_WHATSAPP}${existing ? '?text=' + encodeURIComponent(existing) : ''}`;
    });

    document.querySelectorAll('[data-dev="whatsapp"]').forEach(el => {
        const existing = new URL(el.href, location.origin).searchParams.get('text') || '';
        el.href = `https://wa.me/${DEV_WHATSAPP}${existing ? '?text=' + encodeURIComponent(existing) : ''}`;
    });
    document.querySelectorAll('[data-dev="phone-text"]').forEach(el => {
        el.textContent = '0759592457';
    });

    /* ---------------- HEADER SCROLL ---------------- */
    const header = document.getElementById('siteHeader');
    const backBtn = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        if (header) header.classList.toggle('scrolled', y > 40);
        if (backBtn) backBtn.classList.toggle('visible', y > 400);
        updateActiveNav();
    }, { passive: true });

    /* ---------------- ACTIVE NAV LINK ---------------- */
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNav() {
        const scrollY = window.scrollY + 140;
        sections.forEach(sec => {
            const top = sec.offsetTop;
            const bottom = top + sec.offsetHeight;
            const id = sec.getAttribute('id');
            const link = document.querySelector(`.nav-link[href="#${id}"]`);
            if (!link) return;
            if (scrollY >= top && scrollY < bottom) {
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    }

    /* ---------------- MOBILE MENU ---------------- */
    const toggle = document.getElementById('mobileToggle');
    const nav = document.getElementById('mainNav');
    if (toggle && nav) {
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggle.classList.toggle('active');
            nav.classList.toggle('open');
        });
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                toggle.classList.remove('active');
                nav.classList.remove('open');
            });
        });
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !toggle.contains(e.target)) {
                toggle.classList.remove('active');
                nav.classList.remove('open');
            }
        });
    }

    /* ---------------- SMOOTH SCROLL ---------------- */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            const id = a.getAttribute('href');
            if (id === '#' || id.length < 2) return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            const top = target.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

    /* ---------------- SCROLL REVEAL ---------------- */
    const revealEls = document.querySelectorAll('.reveal');
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), i * 60);
                revealObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => revealObs.observe(el));

    /* ---------------- COUNTER ANIMATION ---------------- */
    const counters = document.querySelectorAll('[data-count]');
    const counterObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseFloat(el.dataset.count);
            const decimals = parseInt(el.dataset.decimal || '0');
            const duration = 1600;
            const start = performance.now();

            function step(now) {
                const t = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - t, 3);
                const val = target * eased;
                el.textContent = decimals > 0 ?
                    val.toFixed(decimals) :
                    Math.round(val).toLocaleString();
                if (t < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
            counterObs.unobserve(el);
        });
    }, { threshold: 0.4 });
    counters.forEach(c => counterObs.observe(c));

    /* ---------------- FLIP CARDS (click to flip) ---------------- */
    document.querySelectorAll('[data-flip]').forEach(card => {
        const flipBtn = card.querySelector('.flip-btn');
        const backBtn = card.querySelector('.flip-back-btn');
        const toggleFlip = (e) => {
            if (e) e.stopPropagation();
            card.classList.toggle('flipped');
        };
        card.addEventListener('click', toggleFlip);
        if (flipBtn) flipBtn.addEventListener('click', toggleFlip);
        if (backBtn) backBtn.addEventListener('click', toggleFlip);
    });

    /* ---------------- SPEED TEST ---------------- */
    const runBtn = document.getElementById('runSpeedTest');
    const gaugeValue = document.getElementById('gaugeValue');
    const gaugeArc = document.getElementById('gaugeArc');
    const downEl = document.getElementById('downSpeed');
    const upEl = document.getElementById('upSpeed');
    const pingEl = document.getElementById('pingValue');

    if (runBtn && gaugeValue && gaugeArc) {
        const CIRC = 502; // 2 * PI * 80

        function animateGauge(toValue, onDone) {
            const duration = 2000;
            const start = performance.now();

            function frame(now) {
                const t = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - t, 3);
                const val = toValue * eased;
                gaugeValue.textContent = val.toFixed(0);
                gaugeArc.style.strokeDashoffset = String(CIRC - (CIRC * Math.min(val, 150) / 150));
                if (t < 1) requestAnimationFrame(frame);
                else if (onDone) onDone();
            }
            requestAnimationFrame(frame);
        }

        runBtn.addEventListener('click', () => {
            runBtn.disabled = true;
            runBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Testing...';
            gaugeValue.textContent = '0';
            gaugeArc.style.strokeDashoffset = String(CIRC);
            if (downEl) downEl.textContent = '—';
            if (upEl) upEl.textContent = '—';
            if (pingEl) pingEl.textContent = '—';

            const target = 100 + Math.random() * 40;
            const pingVal = Math.round(8 + Math.random() * 12);
            if (pingEl) pingEl.textContent = pingVal;

            animateGauge(target, () => {
                if (downEl) downEl.textContent = target.toFixed(1);
                if (upEl) upEl.textContent = (target * 0.45).toFixed(1);
                runBtn.disabled = false;
                runBtn.innerHTML = '<i class="fas fa-rotate-right"></i> Run Again';
            });
        });
    }

    /* ---------------- COVERAGE CHECKER ---------------- */
    const checkBtn = document.getElementById('checkCoverage');
    const covInput = document.getElementById('coverageInput');
    const covResult = document.getElementById('coverageResult');
    const KNOWN_AREAS = [
        'nairobi', 'mombasa', 'kisumu', 'nakuru', 'eldoret', 'thika', 'kiambu',
        'nyeri', 'machakos', 'kajiado', 'kitale', 'meru', 'embu', 'kericho',
        'naivasha', 'malindi', 'kilifi', 'diani', 'westlands', 'karen', 'runda', 'langata'
    ];

    if (checkBtn && covInput && covResult) {
        checkBtn.addEventListener('click', () => {
            const q = covInput.value.trim().toLowerCase();
            if (!q) {
                covResult.textContent = '⚠️ Please enter your location.';
                covResult.className = 'coverage-result error';
                return;
            }
            const found = KNOWN_AREAS.some(a => q.includes(a) || a.includes(q));
            if (found) {
                covResult.innerHTML = `<i class="fas fa-check-circle"></i> Great news — <strong>${covInput.value}</strong> is covered! Call us to schedule installation.`;
                covResult.className = 'coverage-result success';
            } else {
                covResult.innerHTML = `<i class="fas fa-info-circle"></i> We're expanding. <strong>${covInput.value}</strong> isn't on our map yet — but call us, we may reach you soon.`;
                covResult.className = 'coverage-result info';
            }
        });
        covInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') checkBtn.click(); });
    }

    /* ---------------- PARTICLE CANVAS ---------------- */
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let w, h, particles;
        const PARTICLE_COUNT = 55;

        function resize() {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        }

        function createParticles() {
            particles = Array.from({ length: PARTICLE_COUNT }, () => ({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.35,
                vy: (Math.random() - 0.5) * 0.35,
                r: Math.random() * 1.8 + 0.4,
                hue: [200, 190, 180, 45][Math.floor(Math.random() * 4)],
                alpha: Math.random() * 0.45 + 0.2,
            }));
        }

        function draw() {
            ctx.clearRect(0, 0, w, h);
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 130) {
                        ctx.strokeStyle = `hsla(200, 90%, 55%, ${0.12 * (1 - dist / 130)})`;
                        ctx.lineWidth = 0.6;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > w) p.vx *= -1;
                if (p.y < 0 || p.y > h) p.vy *= -1;
                ctx.fillStyle = `hsla(${p.hue}, 90%, 60%, ${p.alpha})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
            });
            requestAnimationFrame(draw);
        }
        resize();
        createParticles();
        draw();
        window.addEventListener('resize', () => { resize();
            createParticles(); });
    }

    /* ---------------- LIVE STRIP NUMBERS ---------------- */
    const avgSpeedEl = document.getElementById('avgSpeed');
    const onlineEl = document.getElementById('onlineNow');
    if (avgSpeedEl) {
        setInterval(() => {
            avgSpeedEl.textContent = Math.round(112 + Math.random() * 12);
        }, 2500);
    }
    if (onlineEl) {
        setInterval(() => {
            const val = 3800 + Math.floor(Math.random() * 200 - 100);
            onlineEl.textContent = val.toLocaleString();
        }, 3000);
    }

    /* ================================================================
       CONTACT FORM → sends to CLIENT'S WhatsApp (254110641185)
       ================================================================ */
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameEl = document.getElementById('name');
            const emailEl = document.getElementById('email');
            const phoneEl = document.getElementById('phone');
            const topicEl = document.getElementById('interest');
            const msgEl = document.getElementById('message');

            const name = nameEl ? nameEl.value.trim() : '';
            const email = emailEl ? emailEl.value.trim() : '';
            const phone = phoneEl ? phoneEl.value.trim() : '';
            const topic = topicEl ? topicEl.value : '';
            const msg = msgEl ? msgEl.value.trim() : '';

            if (!name || !email || !msg) {
                alert('Please fill in Name, Email and Message.');
                return;
            }
            if (!email.includes('@') || !email.includes('.')) {
                alert('Please enter a valid email.');
                return;
            }

            const btn = form.querySelector('button[type="submit"]');
            const original = btn ? btn.innerHTML : '';
            if (btn) {
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                btn.disabled = true;
            }

            setTimeout(() => {
                const waText = encodeURIComponent(
                    `Hi Starlink Ultranet,\n\n` +
                    `Name: ${name}\n` +
                    `Email: ${email}\n` +
                    (phone ? `Phone: ${phone}\n` : '') +
                    (topic ? `Interested in: ${topic}\n` : '') +
                    `\nMessage:\n${msg}`
                );

                // 👇 SENDS TO CLIENT: 254110641185
                window.open(`https://wa.me/${CLIENT_WHATSAPP}?text=${waText}`, '_blank');

                form.reset();
                if (btn) {
                    btn.innerHTML = original;
                    btn.disabled = false;
                }
            }, 800);
        });
    }

    /* ---------------- BACK TO TOP ---------------- */
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ---------------- HERO MOUSE PARALLAX ---------------- */
    if (window.matchMedia('(hover: hover)').matches) {
        const hero = document.querySelector('.hero-visual');
        if (hero) {
            hero.addEventListener('mousemove', (e) => {
                const rect = hero.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                document.querySelectorAll('.float-card').forEach((card, i) => {
                    const depth = (i + 1) * 4;
                    card.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
                });
            });
            hero.addEventListener('mouseleave', () => {
                document.querySelectorAll('.float-card').forEach(card => {
                    card.style.transform = '';
                });
            });
        }
    }

});
