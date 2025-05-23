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
        // Remove typewriter effect - using CSS fade-in animation instead
        heroHeading.style.opacity = 1;
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
        // Remove stats section - don't create it anymore
        return;
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
    // Coordinates for Westlake, OH 44145 (approximate)
    const map = L.map('contact-map').setView([41.4480, -81.9360], 13);
    
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
    // Coordinates for Westlake, OH 44145 (approximate)
    const marker = L.marker([41.4480, -81.9360], { 
        icon: customIcon
    }).addTo(map);
    
    // Add popup with address
    marker.bindPopup('v2v.tech<br>Westlake, OH 44145').openPopup();
}); 