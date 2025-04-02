// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for navigation and buttons
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    scrollLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animate service cards on scroll
    const serviceCards = document.querySelectorAll('.service-card');
    const benefitCards = document.querySelectorAll('.benefit-card');
    
    // Intersection Observer for animations
    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -100px 0px"
    };
    
    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('appear');
            observer.unobserve(entry.target);
        });
    }, appearOptions);
    
    // Observe service cards
    serviceCards.forEach(card => {
        card.classList.add('fade-in');
        appearOnScroll.observe(card);
    });
    
    // Observe benefit cards
    benefitCards.forEach(card => {
        card.classList.add('fade-in');
        appearOnScroll.observe(card);
    });
    
    // Typewriter effect for hero heading
    const heroHeading = document.querySelector('.hero-content h1');
    if (heroHeading) {
        const text = heroHeading.textContent;
        heroHeading.innerHTML = '';
        let i = 0;
        const speed = 50; // Speed in milliseconds
        
        function typeWriter() {
            if (i < text.length) {
                heroHeading.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            }
        }
        
        // Start the typewriter effect after a short delay
        setTimeout(typeWriter, 500);
    }
    
    // Interactive hover effects for SVG graphics
    const svgElements = document.querySelectorAll('.icon svg path, .icon svg rect, .icon svg circle');
    svgElements.forEach(element => {
        element.addEventListener('mouseover', () => {
            element.setAttribute('data-original-stroke', element.getAttribute('stroke'));
            element.setAttribute('stroke', '#004C99');
            element.style.transition = 'all 0.3s ease';
        });
        
        element.addEventListener('mouseout', () => {
            element.setAttribute('stroke', element.getAttribute('data-original-stroke'));
        });
    });
    
    // Form validation with feedback
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple validation
            let valid = true;
            const formFields = contactForm.querySelectorAll('input, textarea');
            
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
            
            if (valid) {
                // Simulate form submission
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                submitBtn.innerHTML = 'Sending...';
                submitBtn.disabled = true;
                
                // Fake API call to simulate form submission
                setTimeout(() => {
                    const formResponse = document.createElement('div');
                    formResponse.className = 'form-response success';
                    formResponse.innerHTML = 'Thank you for your message! We\'ll be in touch soon.';
                    contactForm.appendChild(formResponse);
                    
                    submitBtn.innerHTML = 'Send Message';
                    submitBtn.disabled = false;
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Remove the success message after 5 seconds
                    setTimeout(() => {
                        formResponse.remove();
                    }, 5000);
                }, 1500);
            }
        });
    }
    
    // Sticky header with background change on scroll
    const header = document.querySelector('header');
    const heroSection = document.querySelector('.hero');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Animated counter for statistics (can be added to the about section)
    function animateCounter(element, target, duration) {
        let start = 0;
        const step = timestamp => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            element.textContent = Math.floor(progress * target);
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                element.textContent = target;
            }
        };
        
        window.requestAnimationFrame(step);
    }
    
    // Create and add statistics section
    const createStatsSection = () => {
        const aboutSection = document.querySelector('.about');
        if (!aboutSection) return;
        
        const statsSection = document.createElement('div');
        statsSection.className = 'stats-container';
        
        const stats = [
            { value: 334, label: 'Successful Migrations' },
            { value: 9, label: 'Enterprise Clients' },
            { value: 20, label: 'Years of Experience' },
            { value: 100, label: 'Client Satisfaction %' }
        ];
        
        stats.forEach(stat => {
            const statItem = document.createElement('div');
            statItem.className = 'stat-item';
            
            const statValue = document.createElement('div');
            statValue.className = 'stat-value';
            statValue.textContent = '0';
            statValue.dataset.target = stat.value;
            
            const statLabel = document.createElement('div');
            statLabel.className = 'stat-label';
            statLabel.textContent = stat.label;
            
            statItem.appendChild(statValue);
            statItem.appendChild(statLabel);
            statsSection.appendChild(statItem);
        });
        
        aboutSection.querySelector('.about-content').appendChild(statsSection);
        
        // Set up intersection observer for the stats section
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statValues = entry.target.querySelectorAll('.stat-value');
                    statValues.forEach(value => {
                        const target = parseInt(value.dataset.target);
                        animateCounter(value, target, 2000);
                    });
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statsObserver.observe(statsSection);
    };
    
    // Add the statistics section
    createStatsSection();
    
    // Add parallax effect to hero section
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrollValue = window.scrollY;
            heroSection.style.backgroundPositionY = scrollValue * 0.5 + 'px';
        });
    }
    
    // Add animated background to services section
    const addAnimatedBackground = () => {
        const servicesSection = document.querySelector('.services');
        if (!servicesSection) return;
        
        const backgroundCanvas = document.createElement('div');
        backgroundCanvas.className = 'animated-background';
        
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random positioning and animation duration
            const size = Math.floor(Math.random() * 30) + 10;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.opacity = Math.random() * 0.2 + 0.1;
            particle.style.animationDuration = `${Math.random() * 20 + 10}s`;
            particle.style.animationDelay = `${Math.random() * 10}s`;
            
            backgroundCanvas.appendChild(particle);
        }
        
        servicesSection.insertBefore(backgroundCanvas, servicesSection.firstChild);
    };
    
    // Add the animated background
    addAnimatedBackground();
});

// Initialize the map when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize map
    const map = L.map('contact-map').setView([37.7887459, -122.4019838], 16);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Add custom marker
    const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="10" fill="#0066CC"/>
                <circle cx="20" cy="20" r="18" fill="#0066CC" fill-opacity="0.2"/>
              </svg>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });
    
    // Add marker for office location
    const marker = L.marker([37.7887459, -122.4019838], {
        icon: customIcon
    }).addTo(map);
    
    // Add popup with address
    marker.bindPopup('v2v.tech<br>535 Mission Street, 14th Floor<br>San Francisco, CA 94105').openPopup();
}); 