// DOM Elements
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');
const contactForm = document.getElementById('contactForm');
const floatingCta = document.getElementById('floatingCta');
const scrollTopBtn = document.getElementById('scrollTop');

// Carousel Elements
const carousels = document.querySelectorAll('.project-carousel');

// Mobile Menu Toggle
mobileMenuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const icon = mobileMenuBtn.querySelector('i');
    if (navMenu.classList.contains('active')) {
        icon.classList.replace('fa-bars', 'fa-times');
    } else {
        icon.classList.replace('fa-times', 'fa-bars');
    }
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuBtn.querySelector('i').classList.replace('fa-times', 'fa-bars');
    });
});

// Enhanced Carousel Class for Interior Design Projects
class InteriorCarousel {
    constructor(carouselElement) {
        this.carousel = carouselElement;
        this.slides = carouselElement.querySelectorAll('.carousel-slide');
        this.indicators = carouselElement.querySelectorAll('.indicator');
        this.prevBtn = carouselElement.querySelector('.carousel-prev');
        this.nextBtn = carouselElement.querySelector('.carousel-next');
        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        this.autoPlayInterval = null;
        this.isPlaying = true;
        this.touchStartX = 0;
        this.touchEndX = 0;

        this.init();
    }

    init() {
        // Add event listeners
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());

        // Indicator click events
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });

        // Enhanced touch/swipe support
        this.addTouchSupport();

        // Auto-play with smart pausing
        this.startAutoPlay();

        // Enhanced hover interactions
        this.addHoverEffects();

        // Visibility observer for performance
        this.addVisibilityObserver();

        // Keyboard navigation
        this.addKeyboardNavigation();
    }

    prevSlide() {
        this.currentSlide = this.currentSlide === 0 ? this.totalSlides - 1 : this.currentSlide - 1;
        this.updateCarousel();
        this.trackSlideChange('previous');
    }

    nextSlide() {
        this.currentSlide = this.currentSlide === this.totalSlides - 1 ? 0 : this.currentSlide + 1;
        this.updateCarousel();
        this.trackSlideChange('next');
    }

    goToSlide(slideIndex) {
        if (slideIndex !== this.currentSlide) {
            this.currentSlide = slideIndex;
            this.updateCarousel();
            this.trackSlideChange('indicator');
        }
    }

    updateCarousel() {
        // Update slides with enhanced transitions
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlide);
            
            // Add accessibility attributes
            slide.setAttribute('aria-hidden', index !== this.currentSlide);
        });

        // Update indicators
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
            indicator.setAttribute('aria-label', `Ir a imagen ${index + 1} de ${this.totalSlides}`);
        });

        // Update button states
        this.updateButtonStates();
    }

    updateButtonStates() {
        // Add ARIA labels for screen readers
        this.prevBtn.setAttribute('aria-label', 'Imagen anterior');
        this.nextBtn.setAttribute('aria-label', 'Imagen siguiente');
    }

    startAutoPlay() {
        if (this.isPlaying && this.totalSlides > 1) {
            this.autoPlayInterval = setInterval(() => {
                this.nextSlide();
            }, 5000); // 5 seconds for interior design viewing
        }
    }

    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    addTouchSupport() {
        let startX = 0;
        let endX = 0;
        let startY = 0;
        let endY = 0;
        let isDragging = false;

        this.carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isDragging = true;
            this.pauseAutoPlay();
        }, { passive: true });

        this.carousel.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            // Prevent vertical scrolling while swiping
            const deltaY = Math.abs(e.touches[0].clientY - startY);
            const deltaX = Math.abs(e.touches[0].clientX - startX);
            
            if (deltaX > deltaY) {
                e.preventDefault();
            }
        }, { passive: false });

        this.carousel.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;

            const deltaX = startX - endX;
            const deltaY = startY - endY;

            // Only trigger swipe if horizontal movement is greater than vertical
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
            
            isDragging = false;
            setTimeout(() => this.startAutoPlay(), 1000);
        }, { passive: true });
    }

    addHoverEffects() {
        // Pause auto-play on hover
        this.carousel.addEventListener('mouseenter', () => {
            this.pauseAutoPlay();
            this.carousel.style.transform = 'scale(1.02)';
        });

        this.carousel.addEventListener('mouseleave', () => {
            this.startAutoPlay();
            this.carousel.style.transform = 'scale(1)';
        });

        // Enhanced button visibility on hover
        const buttons = this.carousel.querySelectorAll('.carousel-btn');
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.opacity = '1';
                btn.style.transform = btn.classList.contains('carousel-prev') ? 
                    'translateY(-50%) translateX(-5px)' : 
                    'translateY(-50%) translateX(5px)';
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.opacity = '0.8';
                btn.style.transform = 'translateY(-50%)';
            });
        });
    }

    addKeyboardNavigation() {
        this.carousel.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.prevSlide();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case ' ': // Spacebar
                    e.preventDefault();
                    if (this.isPlaying) {
                        this.pauseAutoPlay();
                        this.isPlaying = false;
                    } else {
                        this.startAutoPlay();
                        this.isPlaying = true;
                    }
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(0);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSlide(this.totalSlides - 1);
                    break;
            }
        });

        // Make carousel focusable
        this.carousel.setAttribute('tabindex', '0');
        this.carousel.setAttribute('role', 'region');
        this.carousel.setAttribute('aria-label', 'Galería de imágenes del proyecto');
    }

    addVisibilityObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.isPlaying = true;
                    this.startAutoPlay();
                } else {
                    this.isPlaying = false;
                    this.pauseAutoPlay();
                }
            });
        }, { threshold: 0.3 });

        observer.observe(this.carousel);
    }

    trackSlideChange(method) {
        // Analytics tracking for user interactions
        if (typeof trackEvent === 'function') {
            trackEvent('carousel_interaction', {
                method: method,
                slide: this.currentSlide + 1,
                total_slides: this.totalSlides,
                page: 'interiores'
            });
        }
    }
}

// Initialize all carousels
function initializeCarousels() {
    carousels.forEach(carousel => {
        new InteriorCarousel(carousel);
    });
}

// Enhanced Lazy Loading for Interior Images
function setupLazyLoading() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.getAttribute('src');
                
                // Create a new image to preload
                const newImg = new Image();
                newImg.onload = function() {
                    img.classList.remove('image-placeholder');
                    img.classList.add('loaded');
                    
                    // Add a subtle fade-in effect
                    img.style.opacity = '0';
                    setTimeout(() => {
                        img.style.transition = 'opacity 0.5s ease';
                        img.style.opacity = '1';
                    }, 50);
                };
                newImg.onerror = function() {
                    // Fallback if image fails to load
                    img.classList.remove('image-placeholder');
                    img.alt = 'Imagen no disponible';
                    img.style.background = 'linear-gradient(45deg, #f0f0f0, #e0e0e0)';
                };
                newImg.src = src;
                
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.01
    });

    document.querySelectorAll('.lazy-image').forEach(img => {
        imageObserver.observe(img);
    });
}

// Enhanced scroll animations for interior design elements
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                
                // Staggered animation for style cards
                if (entry.target.classList.contains('style-card')) {
                    const cards = document.querySelectorAll('.style-card');
                    const index = Array.from(cards).indexOf(entry.target);
                    entry.target.style.animationDelay = `${index * 0.2}s`;
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.style-card, .project-card, .service-item').forEach(el => {
        observer.observe(el);
    });
}

// Header background on scroll
function handleHeaderScroll() {
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
            scrollTopBtn.classList.add('visible');
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            scrollTopBtn.classList.remove('visible');
        }
    });
}

// Smooth scroll functions
function scrollToContact() {
    document.getElementById('contacto').scrollIntoView({
        behavior: 'smooth'
    });
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Enhanced form submission for interior design
function setupFormSubmission() {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Enhanced validation for interior design form
        if (!data.nombre || !data.email) {
            showNotification('Por favor completa todos los campos requeridos.', 'error');
            return;
        }
        
        if (!isValidEmail(data.email)) {
            showNotification('Por favor ingresa un email válido.', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = this.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual submission logic)
        setTimeout(() => {
            showNotification('¡Excelente! Hemos recibido tu solicitud de consulta. Te contactaremos pronto para coordinar la visita gratuita.', 'success');
            
            // Track form submission
            trackEvent('interior_consultation_request', {
                space_type: data.espacio || 'no_specified',
                style_preference: data.estilo || 'no_specified',
                budget_range: data.presupuesto || 'no_specified'
            });
            
            // Reset form
            this.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Enhanced notification system with interior design styling
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#8b5cf6'
    };
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-palette'}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        background: ${colors[type]};
        color: white;
        padding: 1rem;
        border-radius: 15px;
        box-shadow: 0 8px 30px rgba(0,0,0,0.2);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
        backdrop-filter: blur(10px);
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.5rem;
    `;
    
    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        margin-left: auto;
        padding: 0.25rem;
        border-radius: 50%;
        transition: background 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 6 seconds (longer for interior design context)
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 6000);
}

// WhatsApp integration for interior design consultation
function setupWhatsAppIntegration() {
    floatingCta.addEventListener('click', function() {
        const phoneNumber = '59163091512'; 
        const message = encodeURIComponent('Hola, me interesa una consulta de diseño de interiores. ¿Podrían brindarme más información?');
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;
        window.open(whatsappURL, '_blank');
        
        // Track WhatsApp interaction
        trackEvent('whatsapp_consultation', {
            source: 'floating_button',
            page: 'interiores'
        });
    });
}

// Scroll to top button
function setupScrollToTop() {
    scrollTopBtn.addEventListener('click', scrollToTop);
}

// Performance optimization: Preload critical images
function preloadCriticalImages() {
    const criticalImages = [
        'images/hero-interiores.jpg',
        'images/estilo-minimalista.jpg',
        'images/estilo-clasico.jpg',
        'images/estilo-moderno.jpg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Style card interactions
function setupStyleCardInteractions() {
    const styleCards = document.querySelectorAll('.style-card');
    
    styleCards.forEach(card => {
        card.addEventListener('click', function() {
            // Add selected state
            styleCards.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            
            // Pre-fill form with selected style
            const styleName = this.querySelector('h3').textContent.toLowerCase();
            const styleSelect = document.getElementById('estilo');
            if (styleSelect) {
                const option = Array.from(styleSelect.options).find(opt => 
                    opt.text.toLowerCase().includes(styleName)
                );
                if (option) {
                    styleSelect.value = option.value;
                }
            }
            
            // Scroll to contact form
            setTimeout(() => {
                scrollToContact();
            }, 500);
            
            // Track style selection
            trackEvent('style_selection', {
                style: styleName,
                page: 'interiores'
            });
        });
        
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('selected')) {
                this.style.transform = 'translateY(0) scale(1)';
            }
        });
    });
}

// Accessibility improvements
function setupAccessibility() {
    // Keyboard navigation for mobile menu
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileMenuBtn.querySelector('i').classList.replace('fa-times', 'fa-bars');
            mobileMenuBtn.focus();
        }
    });

    // Focus management for mobile menu
    mobileMenuBtn.addEventListener('click', function() {
        setTimeout(() => {
            if (navMenu.classList.contains('active')) {
                const firstLink = navMenu.querySelector('.nav-link');
                if (firstLink) {
                    firstLink.focus();
                }
            }
        }, 300);
    });

    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#inicio';
    skipLink.textContent = 'Saltar al contenido principal';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-color);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 10001;
        transition: top 0.3s;
    `;
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add ARIA labels to interactive elements
    document.querySelectorAll('.style-card').forEach((card, index) => {
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `Seleccionar estilo ${card.querySelector('h3').textContent}`);
        
        // Keyboard activation for style cards
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// Touch device detection and optimization
function setupTouchOptimizations() {
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
    }
}

// Advanced analytics for interior design website
function setupAnalytics() {
    // Track time spent viewing each section
    const sections = document.querySelectorAll('section[id]');
    const sectionTimes = {};
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const sectionId = entry.target.id;
            
            if (entry.isIntersecting) {
                sectionTimes[sectionId] = Date.now();
            } else if (sectionTimes[sectionId]) {
                const timeSpent = Date.now() - sectionTimes[sectionId];
                trackEvent('section_time', {
                    section: sectionId,
                    time_seconds: Math.round(timeSpent / 1000),
                    page: 'interiores'
                });
                delete sectionTimes[sectionId];
            }
        });
    }, { threshold: 0.5 });
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
}

// Smooth scrolling for anchor links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Core functionality
    setupLazyLoading();
    setupScrollAnimations();
    handleHeaderScroll();
    setupFormSubmission();
    setupWhatsAppIntegration();
    setupScrollToTop();
    setupSmoothScrolling();
    
    // Carousel functionality
    initializeCarousels();
    
    // Interior design specific features
    setupStyleCardInteractions();
    setupAnalytics();
    
    // Enhancements
    setupAccessibility();
    setupTouchOptimizations();
    
    // Performance
    preloadCriticalImages();
    
    // Add loading animations with delay
    setTimeout(() => {
        document.querySelectorAll('.hero-text, .hero-image').forEach(el => {
            el.classList.add('fade-in-up');
        });
    }, 100);
    
    console.log('Picmetrica Interiores website initialized successfully! 🎨');
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden, pause carousels
        carousels.forEach(carousel => {
            const carouselInstance = carousel.carouselInstance;
            if (carouselInstance) {
                carouselInstance.pauseAutoPlay();
            }
        });
    } else {
        // Page is visible again, resume carousels
        carousels.forEach(carousel => {
            const carouselInstance = carousel.carouselInstance;
            if (carouselInstance) {
                carouselInstance.startAutoPlay();
            }
        });
    }
});

// Error handling for images
document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        console.log('Image failed to load:', e.target.src);
        // Replace with interior design placeholder
        e.target.style.display = 'none';
        
        const placeholder = document.createElement('div');
        placeholder.style.cssText = `
            width: 100%;
            height: 200px;
            background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            border-radius: 10px;
            font-weight: 600;
        `;
        placeholder.innerHTML = '<i class="fas fa-palette" style="margin-right: 0.5rem;"></i>Imagen no disponible';
        e.target.parentNode.insertBefore(placeholder, e.target);
    }
}, true);

// Global error handler
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
});

// Analytics helper functions
function trackEvent(eventName, parameters = {}) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, parameters);
    }
    
    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', eventName, parameters);
    }
    
    console.log('Event tracked:', eventName, parameters);
}

// Track important user interactions specific to interior design
document.addEventListener('click', function(e) {
    const target = e.target.closest('a, button');
    if (!target) return;
    
    // Track CTA clicks
    if (target.classList.contains('btn-primary')) {
        trackEvent('interior_cta_click', {
            button_text: target.textContent.trim(),
            page_location: window.location.href
        });
    }
    
    // Track navigation to constructora
    if (target.href && target.href.includes('/principal/')) {
        trackEvent('navigation_constructora', {
            source_page: 'interiores'
        });
    }
    
    // Track service item clicks
    if (target.classList.contains('service-item')) {
        trackEvent('service_interest', {
            service: target.textContent.trim(),
            page: 'interiores'
        });
    }
});

// Export functions for external use
window.PicmetricaInteriores = {
    scrollToContact,
    scrollToTop,
    showNotification,
    trackEvent
};

// Easter egg - console message for interior design
console.log(`
🎨 Picmetrica Interiores
✨ Transformando espacios con estilo
📱 Responsive design optimizado
🚀 ¡Listo para crear ambientes únicos!
`);

// Track scroll depth for interior design engagement
let maxScrollDepth = 0;
window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.round((scrollTop / docHeight) * 100);
    
    if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = scrollPercent;
        
        // Track milestone scroll depths
        if ([25, 50, 75, 90].includes(scrollPercent)) {
            trackEvent('scroll_depth_interiores', {
                percent: scrollPercent,
                page_location: window.location.href
            });
        }
    }
});

// Track time on page for interior design consultation interest
let startTime = Date.now();
window.addEventListener('beforeunload', function() {
    const timeOnPage = Math.round((Date.now() - startTime) / 1000);
    trackEvent('time_on_interiores_page', {
        seconds: timeOnPage,
        page_location: window.location.href
    });
});