document.addEventListener('DOMContentLoaded', () => {

    /* Mobile navigation ---------------------------------------------------- */
    const burgerMenu = document.querySelector('.burger-menu');
    const navMenu = document.querySelector('.nav-menu');

    if (burgerMenu && navMenu) {
        const setMenu = (open) => {
            burgerMenu.classList.toggle('active', open);
            navMenu.classList.toggle('active', open);
            burgerMenu.setAttribute('aria-expanded', String(open));
        };

        burgerMenu.addEventListener('click', () => {
            setMenu(!navMenu.classList.contains('active'));
        });

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => setMenu(false));
        });

        document.addEventListener('click', (event) => {
            if (!burgerMenu.contains(event.target) && !navMenu.contains(event.target)) {
                setMenu(false);
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') setMenu(false);
        });
    }

    /* Header state (sentinel + IntersectionObserver, no scroll listener) ---- */
    const header = document.querySelector('header');
    if (header && 'IntersectionObserver' in window) {
        const sentinel = document.createElement('div');
        sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:60px;pointer-events:none;';
        document.body.prepend(sentinel);

        new IntersectionObserver(([entry]) => {
            header.classList.toggle('scrolled', !entry.isIntersecting);
        }).observe(sentinel);
    } else if (header) {
        header.classList.add('scrolled');
    }

    /* Scrollspy: mark the nav link for the section in view ------------------ */
    const navLinks = Array.from(document.querySelectorAll('.nav-menu a[href^="#"]'));
    if (navLinks.length && 'IntersectionObserver' in window) {
        const linkFor = {};
        navLinks.forEach(link => { linkFor[link.getAttribute('href').slice(1)] = link; });

        const spy = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                navLinks.forEach(l => l.classList.remove('active'));
                const link = linkFor[entry.target.id];
                if (link) link.classList.add('active');
            });
        }, { rootMargin: '-35% 0px -55% 0px' });

        Object.keys(linkFor).forEach(id => {
            const section = document.getElementById(id);
            if (section) spy.observe(section);
        });
    }

    /* Reveal on scroll, only when the user allows motion --------------------- */
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealTargets = document.querySelectorAll('[data-reveal]');

    if (!reduceMotion && revealTargets.length && 'IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.05, rootMargin: '0px 0px -60px 0px' });

        const revealInView = () => {
            revealTargets.forEach(el => {
                if (el.classList.contains('is-visible')) return;
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    el.classList.add('is-visible');
                    revealObserver.unobserve(el);
                }
            });
        };

        revealTargets.forEach(el => {
            el.classList.add('will-reveal');
            revealObserver.observe(el);
        });

        // Anchor deep-links scroll the page outside the observer's notice
        // (the browser jumps to the fragment after load), so re-check
        // whenever a jump can have happened.
        revealInView();
        window.addEventListener('load', revealInView);
        window.addEventListener('hashchange', revealInView);
        window.addEventListener('scroll', revealInView, { passive: true });
    }

    /* Contact form ------------------------------------------------------------ */
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            let valid = true;
            const formFields = contactForm.querySelectorAll('input:not([name="website"]), textarea');

            formFields.forEach(field => {
                if (field.hasAttribute('required') && !field.value.trim()) {
                    field.classList.add('error');
                    valid = false;
                } else {
                    field.classList.remove('error');
                }

                if (field.type === 'email' && field.value) {
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailPattern.test(field.value)) {
                        field.classList.add('error');
                        valid = false;
                    }
                }
            });

            if (!valid) return;

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            const showResponse = (ok, text) => {
                contactForm.querySelectorAll('.form-response').forEach(el => el.remove());
                const formResponse = document.createElement('div');
                formResponse.className = 'form-response ' + (ok ? 'success' : 'error');
                formResponse.setAttribute('role', 'status');
                formResponse.textContent = text;
                contactForm.appendChild(formResponse);
                setTimeout(() => formResponse.remove(), 8000);
            };

            fetch('https://contact-relay-ai-power-grids-projects.vercel.app/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    site: 'v2v.tech',
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    company: document.getElementById('company').value,
                    message: document.getElementById('message').value,
                    website: contactForm.querySelector('input[name="website"]')?.value || ''
                })
            })
                .then(r => r.json())
                .then(data => {
                    showResponse(!!data.success, data.message || (data.success
                        ? 'Message sent. We will get back to you shortly.'
                        : 'We could not send your message. Please email info@v2v.tech directly.'));
                    if (data.success) contactForm.reset();
                })
                .catch(() => {
                    showResponse(false, 'We could not send your message. Please email info@v2v.tech directly.');
                })
                .finally(() => {
                    submitBtn.textContent = 'Send message';
                    submitBtn.disabled = false;
                });
        });
    }

    /* Map (Leaflet loads deferred; wait for it if needed) ---------------------- */
    const initMap = () => {
        const mapEl = document.getElementById('contact-map');
        if (!mapEl || typeof L === 'undefined') return false;

        const map = L.map('contact-map', { scrollWheelZoom: false })
            .setView([41.4480, -81.9360], 12);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        const marker = L.circleMarker([41.4480, -81.9360], {
            radius: 9,
            color: '#5b9bd9',
            weight: 2,
            fillColor: '#5b9bd9',
            fillOpacity: 0.35
        }).addTo(map);

        marker.bindPopup('v2v.tech<br>Westlake, OH 44145');
        return true;
    };

    if (!initMap()) {
        window.addEventListener('load', initMap, { once: true });
    }
});
