/* ============================================
   SUDHIR SAH PORTFOLIO — script.js
   All Interactivity, Animations & Effects
   ============================================ */

'use strict';

// ============================================
// INTRO LOADER
// ============================================
window.addEventListener('load', () => {
    // Reset scroll to top immediately on refresh/load
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    const loader = document.getElementById('intro-loader');
    if (!loader) return;

    setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
        window.scrollTo(0, 0);
        initScrollReveal();
    }, 1800);

    document.body.style.overflow = 'hidden';
});

// ============================================
// DAY / DARK MODE TOGGLE
// ============================================
(function () {
    const toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;

    const savedTheme = localStorage.getItem('portfolioTheme');
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        const icon = toggleBtn.querySelector('i');
        if (icon) {
            icon.className = 'fa-solid fa-sun';
        }
    }

    toggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const icon = toggleBtn.querySelector('i');

        if (currentTheme === 'light') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('portfolioTheme', 'dark');
            if (icon) icon.className = 'fa-solid fa-moon';
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('portfolioTheme', 'light');
            if (icon) icon.className = 'fa-solid fa-sun';
        }
    });
})();



// ============================================
// PARTICLES CANVAS BACKGROUND
// ============================================
(function () {
    const canvas = document.getElementById('particles-bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let particles = [];
    let animFrame;
    let W, H;

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    function createParticle() {
        return {
            x: Math.random() * W,
            y: Math.random() * H,
            r: Math.random() * 1.5 + 0.3,
            dx: (Math.random() - 0.5) * 0.3,
            dy: (Math.random() - 0.5) * 0.3,
            alpha: Math.random() * 0.5 + 0.1,
            hue: Math.random() < 0.5 ? 195 : 280, // cyan or purple
        };
    }

    function init() {
        resize();
        particles = [];
        const count = Math.min(Math.floor((W * H) / 12000), 120);
        for (let i = 0; i < count; i++) {
            particles.push(createParticle());
        }
    }

    function connectParticles() {
        const maxDist = 120;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < maxDist) {
                    const alpha = (1 - dist / maxDist) * 0.08;
                    ctx.beginPath();
                    ctx.strokeStyle = `hsla(${particles[i].hue}, 80%, 70%, ${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        animFrame = requestAnimationFrame(animate);
        ctx.clearRect(0, 0, W, H);

        for (const p of particles) {
            p.x += p.dx;
            p.y += p.dy;

            if (p.x < 0 || p.x > W) p.dx *= -1;
            if (p.y < 0 || p.y > H) p.dy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${p.hue}, 80%, 75%, ${p.alpha})`;
            ctx.fill();
        }

        connectParticles();
    }

    init();
    animate();

    window.addEventListener('resize', () => {
        cancelAnimationFrame(animFrame);
        init();
        animate();
    });
})();

// ============================================
// HERO SCROLL CANVAS (Aurora Effect)
// ============================================
(function () {
    const canvas = document.getElementById('hero-scroll-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    let progress = 0;

    window.addEventListener('resize', () => {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    });

    function drawAurora(p) {
        ctx.clearRect(0, 0, W, H);
        if (p <= 0) return;

        const alpha = Math.min(p * 2, 0.35);

        // Top-left blob (cyan)
        const g1 = ctx.createRadialGradient(W * 0.15, H * 0.2, 0, W * 0.15, H * 0.2, W * 0.55);
        g1.addColorStop(0, `rgba(0, 210, 255, ${alpha})`);
        g1.addColorStop(1, `rgba(0, 210, 255, 0)`);
        ctx.fillStyle = g1;
        ctx.fillRect(0, 0, W, H);

        // Bottom-right blob (purple)
        const g2 = ctx.createRadialGradient(W * 0.85, H * 0.8, 0, W * 0.85, H * 0.8, W * 0.55);
        g2.addColorStop(0, `rgba(168, 85, 247, ${alpha * 0.8})`);
        g2.addColorStop(1, `rgba(168, 85, 247, 0)`);
        ctx.fillStyle = g2;
        ctx.fillRect(0, 0, W, H);
    }

    function onScroll() {
        const hero = document.getElementById('hero');
        if (!hero) return;
        const heroH = hero.offsetHeight;
        const scrollY = window.scrollY;
        progress = Math.min(scrollY / heroH, 1);
        canvas.style.opacity = Math.min(progress * 1.5, 0.7).toString();
        drawAurora(progress);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    drawAurora(0);
})();

// ============================================
// SCROLL PROGRESS BAR
// ============================================
(function () {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;

    function update() {
        const scrollTop = window.scrollY;
        const docH = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = `${(scrollTop / docH) * 100}%`;
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
})();

// ============================================
// HEADER SCROLL STATE
// ============================================
(function () {
    const header = document.getElementById('header');
    if (!header) return;

    let ticking = false;

    function update() {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(update);
            ticking = true;
        }
    }, { passive: true });
})();

// ============================================
// MOBILE MENU TOGGLE
// ============================================
(function () {
    const toggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('nav-menu');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = nav.classList.toggle('open');
        toggle.classList.toggle('open', isOpen);
        toggle.setAttribute('aria-expanded', isOpen.toString());
    });

    // Close on nav link click
    nav.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('open');
            toggle.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Close when clicking anywhere outside of the menu and the toggle button
    document.addEventListener('click', (e) => {
        if (nav.classList.contains('open')) {
            const isClickInsideMenu = nav.contains(e.target);
            const isClickOnToggle = toggle.contains(e.target);

            if (!isClickInsideMenu && !isClickOnToggle) {
                nav.classList.remove('open');
                toggle.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
            }
        }
    });
})();

// ============================================
// SCROLL REVEAL (Intersection Observer)
// ============================================
function initScrollReveal() {
    const elements = document.querySelectorAll('.scroll-reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    });

    elements.forEach(el => observer.observe(el));
}

// ============================================
// TIMELINE SCROLL DOT & CONTENT ANIMATION
(function () {
    const timeline = document.querySelector('.timeline');
    const dot = document.querySelector('.timeline-scroll-dot');
    if (!timeline || !dot) return;

    const timelineTop = timeline.offsetTop;
    const timelineHeight = timeline.offsetHeight;

    // Update dot position based on scroll progress within timeline
    function updateDot() {
        const scrollY = window.scrollY;
        const progress = Math.min(Math.max(scrollY - timelineTop, 0), timelineHeight);
        const percent = progress / timelineHeight;
        dot.style.top = `${percent * timelineHeight}px`;
    }

    // Show/hide timeline items based on scroll direction
    let lastScroll = 0;
    function updateItems() {
        const scrollY = window.scrollY;
        const scrollingDown = scrollY > lastScroll;
        lastScroll = scrollY;

        document.querySelectorAll('.timeline-item').forEach(item => {
            const rect = item.getBoundingClientRect();
            const inView = rect.top < window.innerHeight && rect.bottom > 0;
            if (inView && scrollingDown) {
                item.classList.add('visible');
            } else if (!scrollingDown) {
                item.classList.remove('visible');
            }
        });
    }

    function onScroll() {
        updateDot();
        updateItems();
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    // Initial run
    updateDot();
    updateItems();
})();

// ACTIVE NAV LINK on SCROLL
// ============================================
(function () {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => link.classList.remove('active'));
                const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                if (active) active.classList.add('active');
            }
        });
    }, { threshold: 0.3 });

    sections.forEach(s => observer.observe(s));
})();

// ============================================
// READ MORE TOGGLES
// ============================================
(function () {
    const toggles = document.querySelectorAll('.read-more-toggle');

    toggles.forEach(toggle => {
        const targetId = toggle.getAttribute('data-target');
        const target = document.getElementById(targetId);
        if (!target) return;

        // On desktop, show all content by default
        if (window.innerWidth >= 1024) {
            target.style.maxHeight = 'none';
            target.style.opacity = '1';
            target.style.overflow = 'visible';
            toggle.style.display = 'none';
            return;
        }

        // On mobile, collapse by default
        target.classList.add('collapsed');

        toggle.addEventListener('click', () => {
            const isOpen = toggle.classList.toggle('open');
            if (isOpen) {
                target.classList.remove('collapsed');
                target.style.maxHeight = target.scrollHeight + 'px';
                target.style.opacity = '1';
                toggle.innerHTML = 'Read Less <i class="fa-solid fa-chevron-up"></i>';
            } else {
                target.classList.add('collapsed');
                target.style.maxHeight = '0';
                target.style.opacity = '0';
                toggle.innerHTML = 'Read More <i class="fa-solid fa-chevron-down"></i>';
            }
        });
    });
})();

// ============================================
// SKILLS TAB NAVIGATION (WITH ROW EXPAND/COLLAPSE)
// ============================================
(function () {
    const tabNav = document.querySelector('.skills-tab-nav');
    if (!tabNav) return;

    const tabBtns = tabNav.querySelectorAll('.tab-btn');
    const indicator = tabNav.querySelector('.tab-slider-indicator');
    const contents = document.querySelectorAll('.skills-tab-content');

    function moveIndicator(btn) {
        if (!indicator) return;
        const navRect = tabNav.getBoundingClientRect();
        const btnRect = btn.getBoundingClientRect();
        indicator.style.width = `${btnRect.width}px`;
        indicator.style.left = `${btnRect.left - navRect.left}px`;
    }

    // Function to calculate and update visibility of skills items
    function updateSkillsToggle(tabContent, forceExpand = false) {
        const grid = tabContent.querySelector('.skills-compact-grid, .capabilities-grid');
        if (!grid) return;
        const cards = grid.children;
        const toggleWrap = tabContent.querySelector('.skills-toggle-wrap');
        if (!toggleWrap) return;
        const toggleBtn = toggleWrap.querySelector('.skills-toggle-btn');
        if (!toggleBtn) return;

        // Temporarily clear styling on children so we can measure columns correctly
        for (let i = 0; i < cards.length; i++) {
            cards[i].style.display = '';
        }

        // Get current grid columns count
        const cols = window.getComputedStyle(grid).gridTemplateColumns.split(' ').length;
        const maxVisible = cols * 3;
        const isExpanded = toggleBtn.classList.contains('expanded') || forceExpand;

        if (cards.length <= maxVisible) {
            toggleWrap.style.display = 'none';
            return;
        }

        toggleWrap.style.display = 'flex';

        if (isExpanded) {
            toggleBtn.classList.add('expanded');
            toggleBtn.querySelector('span').textContent = 'Show Less';
            toggleBtn.querySelector('i').className = 'fa-solid fa-chevron-up';
        } else {
            toggleBtn.classList.remove('expanded');
            for (let i = maxVisible; i < cards.length; i++) {
                cards[i].style.display = 'none';
            }
            toggleBtn.querySelector('span').textContent = 'Show More';
            toggleBtn.querySelector('i').className = 'fa-solid fa-chevron-down';
        }
    }

    // Setup toggles for each tab
    contents.forEach(tabContent => {
        const toggleBtn = tabContent.querySelector('.skills-toggle-btn');
        if (!toggleBtn) return;

        toggleBtn.addEventListener('click', () => {
            const isExpanded = toggleBtn.classList.toggle('expanded');
            updateSkillsToggle(tabContent, isExpanded);
        });
    });

    // Initial positioning and row calculations
    const activeBtn = tabNav.querySelector('.tab-btn.active');
    if (activeBtn) {
        setTimeout(() => {
            moveIndicator(activeBtn);
            contents.forEach(c => {
                if (c.classList.contains('active')) {
                    updateSkillsToggle(c);
                    const grid = c.querySelector('.skills-compact-grid, .capabilities-grid');
                    if (grid) {
                        Array.from(grid.children).forEach((card, index) => {
                            card.style.animationDelay = `${index * 0.04}s`;
                        });
                    }
                }
            });
        }, 50);
    }

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');

            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            contents.forEach(c => c.classList.remove('active'));
            const target = document.getElementById(`skills-tab-${tabId}`);
            if (target) {
                target.classList.add('active');
                // Calculate toggle immediately for the newly opened tab
                updateSkillsToggle(target);

                // Add stagger animation delays to the newly active cards
                const grid = target.querySelector('.skills-compact-grid, .capabilities-grid');
                if (grid) {
                    Array.from(grid.children).forEach((card, index) => {
                        card.style.animationDelay = `${index * 0.04}s`;
                    });
                }
            }

            moveIndicator(btn);
        });
    });

    window.addEventListener('resize', () => {
        const current = tabNav.querySelector('.tab-btn.active');
        if (current) moveIndicator(current);
        
        contents.forEach(c => {
            if (c.classList.contains('active')) {
                updateSkillsToggle(c);
            }
        });
    });
})();

// ============================================
// PORTFOLIO TAB NAVIGATION
// ============================================
(function () {
    const portfolioTabs = document.querySelector('.portfolio-tabs');
    if (!portfolioTabs) return;

    const tabBtns = portfolioTabs.querySelectorAll('.portfolio-tab-btn');
    const indicator = portfolioTabs.querySelector('.portfolio-slider-indicator');

    function moveIndicator(btn) {
        if (!indicator) return;
        const navRect = portfolioTabs.getBoundingClientRect();
        const btnRect = btn.getBoundingClientRect();
        indicator.style.width = btnRect.width + 'px';
        indicator.style.left = (btnRect.left - navRect.left) + 'px';
    }

    tabBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var filter = btn.getAttribute('data-filter');

            // Update active state
            tabBtns.forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            moveIndicator(btn);

            // Show/hide items directly with staggered delay
            let visibleIndex = 0;
            document.querySelectorAll('.portfolio-item').forEach(function(item) {
                if (item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    item.style.animation = 'none';
                    // Trigger reflow to restart animation
                    void item.offsetWidth;
                    item.style.animation = 'portfolioEntrance 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards';
                    item.style.animationDelay = `${visibleIndex * 0.06}s`;
                    visibleIndex++;
                } else {
                    item.style.display = 'none';
                    item.style.animation = 'none';
                }
            });
        });
    });

    // Move indicator and animate active portfolio items after load
    window.addEventListener('load', function() {
        var active = portfolioTabs.querySelector('.portfolio-tab-btn.active');
        if (active) {
            moveIndicator(active);
            var activeFilter = active.getAttribute('data-filter');
            let visibleIndex = 0;
            document.querySelectorAll('.portfolio-item').forEach(function(item) {
                if (item.getAttribute('data-category') === activeFilter) {
                    item.style.animation = 'portfolioEntrance 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards';
                    item.style.animationDelay = `${visibleIndex * 0.06}s`;
                    visibleIndex++;
                }
            });
        }
    });

    window.addEventListener('resize', function() {
        var current = portfolioTabs.querySelector('.portfolio-tab-btn.active');
        if (current) moveIndicator(current);
    });
})();

// ============================================
// CONTACT FORM (Mock Submit)
// ============================================
(function () {
    const form = document.getElementById('contact-form');
    const feedback = document.getElementById('form-feedback');
    if (!form || !feedback) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        // Simulate async send
        await new Promise(resolve => setTimeout(resolve, 1800));

        feedback.className = 'form-feedback success';
        feedback.innerHTML = `
            <div class="success-title">Message Sent!</div>
            <div class="success-desc">✓ I'll get back to you within 24 hours.</div>
        `;

        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        form.reset();

        setTimeout(() => {
            feedback.className = 'form-feedback';
            feedback.innerHTML = '';
        }, 6000);
    });
})();

// ============================================
// PORTFOLIO ITEM HOVER CURSOR EFFECT
// ============================================
(function () {
    const items = document.querySelectorAll('.portfolio-item');
    items.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotX = ((y - centerY) / centerY) * 5;
            const rotY = ((x - centerX) / centerX) * -5;

            item.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
        });

        item.addEventListener('mouseleave', () => {
            item.style.transform = '';
        });
    });
})();

// ============================================
// SMOOTH NUMBER COUNT-UP FOR STATS
// ============================================
(function () {
    const stats = document.querySelectorAll('.stat-num');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const el = entry.target;
            const text = el.textContent.trim();
            const numMatch = text.match(/^(\d+)/);
            if (!numMatch) return;

            const target = parseInt(numMatch[1]);
            const suffix = text.replace(numMatch[1], '');
            const duration = 1500;
            const start = performance.now();

            function step(now) {
                const progress = Math.min((now - start) / duration, 1);
                const ease = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.round(ease * target) + suffix;
                if (progress < 1) requestAnimationFrame(step);
            }

            requestAnimationFrame(step);
            observer.unobserve(el);
        });
    }, { threshold: 0.5 });

    stats.forEach(s => observer.observe(s));
})();

// ============================================
// SERVICE CARD HOVER GLOW
// ============================================
(function () {
    const cards = document.querySelectorAll('.service-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(0, 210, 255, 0.06) 0%, rgba(255,255,255,0.04) 60%)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.background = '';
        });
    });
})();

// ============================================
// SKILL CARD SUBTLE TILT
// ============================================
(function () {
    const cards = document.querySelectorAll('.skill-compact-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const rotX = ((y - cy) / cy) * 6;
            const rotY = ((x - cx) / cx) * -6;
            card.style.transform = `perspective(400px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-3px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
})();

// ============================================
// GLOWING CURSOR TRAIL (Desktop Only)
// ============================================
(function () {
    if (window.innerWidth < 1024) return;

    const trail = document.createElement('div');
    trail.style.cssText = `
        position: fixed;
        width: 300px;
        height: 300px;
        border-radius: 50%;
        pointer-events: none;
        z-index: 0;
        opacity: 0;
        transition: opacity 0.5s ease;
        background: radial-gradient(circle, rgba(0, 210, 255, 0.06) 0%, transparent 70%);
        transform: translate(-50%, -50%);
    `;
    document.body.appendChild(trail);

    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;
    let isMoving = false;
    let hideTimer;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        trail.style.opacity = '1';
        isMoving = true;
        clearTimeout(hideTimer);
        hideTimer = setTimeout(() => {
            trail.style.opacity = '0';
        }, 2000);
    });

    function animate() {
        trailX += (mouseX - trailX) * 0.08;
        trailY += (mouseY - trailY) * 0.08;
        trail.style.left = `${trailX}px`;
        trail.style.top = `${trailY}px`;
        requestAnimationFrame(animate);
    }

    animate();
})();

// ============================================
// TIMELINE ITEM REVEAL WITH STAGGER
// ============================================
(function () {
    const timelineItems = document.querySelectorAll('.timeline-item');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, i * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

        item.classList.add = (className) => {
            if (className === 'visible') {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }
            HTMLElement.prototype.classList.add.call(item.classList, className);
        };

        observer.observe(item);
    });
})();

// ============================================
// FOOTER YEAR AUTO-UPDATE
// ============================================
(function () {
    const yearSpans = document.querySelectorAll('.year-auto');
    const year = new Date().getFullYear();
    yearSpans.forEach(s => (s.textContent = year));
})();

// ============================================
// KEYBOARD NAVIGATION
// ============================================
(function () {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close mobile menu
            const nav = document.getElementById('nav-menu');
            const toggle = document.getElementById('menu-toggle');
            if (nav && nav.classList.contains('open')) {
                nav.classList.remove('open');
                if (toggle) toggle.classList.remove('open');
            }
        }
    });
})();

// ============================================
// HERO SECTION TEXT GLITCH ON HOVER
// ============================================
(function () {
    const heroTitle = document.querySelector('.hero-title-main');
    if (!heroTitle) return;

    let glitchTimer;

    heroTitle.addEventListener('mouseenter', () => {
        heroTitle.style.animation = 'none';
        glitchTimer = setInterval(() => {
            heroTitle.style.textShadow = Math.random() > 0.5
                ? `2px 0 rgba(255, 0, 127, 0.5), -2px 0 rgba(0, 210, 255, 0.5)`
                : `none`;
        }, 80);
    });

    heroTitle.addEventListener('mouseleave', () => {
        clearInterval(glitchTimer);
        heroTitle.style.textShadow = 'none';
    });
})();

// ============================================
// BACK TO TOP ON LOGO CLICK
// ============================================
(function () {
    const logo = document.querySelector('.logo');
    if (!logo) return;

    logo.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();

// ============================================
// INITIALIZE SCROLL REVEAL ON DOM READY
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // If loader is not present or already dismissed
    const loader = document.getElementById('intro-loader');
    if (!loader || loader.classList.contains('hidden')) {
        initScrollReveal();
    }
});

// ============================================
// TIMELINE SCROLL INDICATOR LIGHT
// ============================================
(function () {
    const timeline = document.querySelector('.timeline');
    const scrollDot = document.querySelector('.timeline-scroll-dot');
    if (!timeline || !scrollDot) return;

    function updateTimelineDot() {
        const rect = timeline.getBoundingClientRect();
        const viewHeight = window.innerHeight;
        const timelineHeight = rect.height;

        // Bounding rect top of the timeline
        const timelineTop = rect.top;

        // If the timeline is in the viewport (or close to it)
        if (timelineTop < viewHeight && timelineTop + timelineHeight > 0) {
            // Trigger point is at 45% of viewport height (near center of screen)
            const triggerPoint = viewHeight * 0.45;
            
            // Calculate how far into the timeline we have scrolled
            const scrolledDistance = triggerPoint - timelineTop;
            
            // Calculate progress (0 to 1)
            let progress = scrolledDistance / timelineHeight;
            progress = Math.max(0, Math.min(1, progress));

            // Subtract height of the dot (12px) to prevent overflowing the bottom
            const maxTravel = timelineHeight - 12;
            const topPosition = progress * maxTravel;

            scrollDot.style.transform = `translate(-50%, ${topPosition}px)`;
        }
    }

    window.addEventListener('scroll', updateTimelineDot);
    window.addEventListener('resize', updateTimelineDot);
    // Run once on load to initialize position
    setTimeout(updateTimelineDot, 200);
})();

// ============================================
// MOUSE TRACKING SPOTLIGHT GLOW FOR HERO BUTTONS
// ============================================
(function () {
    const buttons = document.querySelectorAll('.hero-actions .btn');
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            btn.style.setProperty('--mouse-x', `${x}px`);
            btn.style.setProperty('--mouse-y', `${y}px`);
        });
    });
})();
