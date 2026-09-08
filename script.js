// ================================================================
// MOBILE NAV TOGGLE - IMPROVED
// ================================================================
document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById('mobileToggle');
    const nav = document.getElementById('mainNav');

    if (toggle && nav) {
        // Toggle menu on button click
        toggle.addEventListener('click', function(e) {
            e.stopPropagation();
            nav.classList.toggle('open');
            const icon = toggle.querySelector('i');
            icon.className = nav.classList.contains('open') ? 'fas fa-times' : 'fas fa-bars';
        });

        // Close menu when clicking a link
        nav.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                nav.classList.remove('open');
                const icon = toggle.querySelector('i');
                icon.className = 'fas fa-bars';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && !toggle.contains(e.target)) {
                nav.classList.remove('open');
                const icon = toggle.querySelector('i');
                icon.className = 'fas fa-bars';
            }
        });
    }

    // ============================================================
    // SMOOTH SCROLL
    // ============================================================
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                const offset = 80;
                const top = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

    // ============================================================
    // COUNTER ANIMATION
    // ============================================================
    const statNumbers = document.querySelectorAll('.stat-number');
    let animated = false;

    function animateCounters() {
        if (animated) return;
        const triggerPoint = window.innerHeight * 0.8;
        const statsSection = document.querySelector('.stats-section');
        if (!statsSection) return;
        const rect = statsSection.getBoundingClientRect();
        if (rect.top < triggerPoint) {
            animated = true;
            statNumbers.forEach(function(el) {
                const target = parseFloat(el.getAttribute('data-count'));
                const suffix = el.getAttribute('data-suffix') || '';
                let current = 0;
                const increment = target / 60;
                const timer = setInterval(function() {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    if (Number.isInteger(target) || target % 1 === 0) {
                        el.textContent = Math.round(current) + suffix;
                    } else {
                        el.textContent = current.toFixed(1) + suffix;
                    }
                }, 25);
            });
        }
    }

    window.addEventListener('scroll', animateCounters);
    setTimeout(animateCounters, 500);

    // ============================================================
    // BACK TO TOP BUTTON
    // ============================================================
    const backBtn = document.getElementById('backToTop');
    if (backBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 400) {
                backBtn.classList.add('visible');
            } else {
                backBtn.classList.remove('visible');
            }
        });

        backBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ============================================================
    // CONTACT FORM
    // ============================================================
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                alert('Please fill in all required fields (Name, Email, and Message).');
                return;
            }

            if (!email.includes('@') || !email.includes('.')) {
                alert('Please enter a valid email address.');
                return;
            }

            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            btn.disabled = true;

            setTimeout(function() {
                alert('Thank you, ' + name + '! Your message has been sent successfully. We\'ll get back to you within 24 hours.');
                form.reset();
                btn.innerHTML = originalText;
                btn.disabled = false;
            }, 1500);
        });
    }

    // ============================================================
    // NAVBAR SHADOW ON SCROLL
    // ============================================================
    const header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 50) {
                header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
            } else {
                header.style.boxShadow = 'none';
            }
        });
    }
});
