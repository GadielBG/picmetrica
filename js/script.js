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

// Carousel Functionality
class ProjectCarousel {
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

        // Touch/swipe support
        this.addTouchSupport();

        // Auto-play
        this.startAutoPlay();

        // Pause auto-play on hover
        this.carousel.addEventListener('mouseenter', () => this.pauseAutoPlay());
        this.carousel.addEventListener('mouseleave', () => this.startAutoPlay());

        // Pause auto-play when carousel is not visible
        this.addVisibilityObserver();
    }

    prevSlide() {
        this.currentSlide = this.currentSlide === 0 ? this.totalSlides - 1 : this.currentSlide - 1;
        this.updateCarousel();
    }

    nextSlide() {
        this.currentSlide = this.currentSlide === this.totalSlides - 1 ? 0 : this.currentSlide + 1;
        this.updateCarousel();
    }

    goToSlide(slideIndex) {
        this.currentSlide = slideIndex;
        this.updateCarousel();
    }

    updateCarousel() {
        // Update slides
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlide);
        });

        // Update indicators
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
    }

    startAutoPlay() {
        if (this.isPlaying) {
            this.autoPlayInterval = setInterval(() => {
                this.nextSlide();
            }, 4000); // Change slide every 4 seconds
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

        this.carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });

        this.carousel.addEventListener('touchend', (e) => {
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
        }, { passive: true });
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
        }, { threshold: 0.5 });

        observer.observe(this.carousel);
    }
}

// Initialize all carousels
function initializeCarousels() {
    carousels.forEach(carousel => {
        new ProjectCarousel(carousel);
    });
}

// Lazy Loading Images
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
                };
                newImg.onerror = function() {
                    // Fallback if image fails to load
                    img.classList.remove('image-placeholder');
                    img.alt = 'Imagen no disponible';
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

// Scroll animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-card, .project-card, .service-item').forEach(el => {
        observer.observe(el);
    });
}

// Header background on scroll
function handleHeaderScroll() {
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            scrollTopBtn.classList.add('visible');
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
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

// Form submission handler
function setupFormSubmission() {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Basic form validation
        if (!data.nombre || !data.email) {
            showNotification('Por favor completa todos los campos requeridos.', 'error');
            return;
        }
        
        if (!isValidEmail(data.email)) {
            showNotification('Por favor ingresa un email válido.', 'error');
            return;
        }
        
        // Simulate form submission (replace with actual submission logic)
        showNotification('¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.', 'success');
        
        // Reset form
        this.reset();
        
        // Optional: Send data to your backend
        // submitFormData(data);
    });
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
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
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
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
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// WhatsApp integration
function setupWhatsAppIntegration() {
    floatingCta.addEventListener('click', function() {
        const phoneNumber = '59163091512'; // ← CAMBIAR POR TU NÚMERO REAL
        const message = encodeURIComponent('Hola, me interesa conocer más sobre sus servicios de construcción.');
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;
        window.open(whatsappURL, '_blank');
    });
}

// Scroll to top button
function setupScrollToTop() {
    scrollTopBtn.addEventListener('click', scrollToTop);
}

// Performance optimization: Preload critical images
function preloadCriticalImages() {
    const criticalImages = [
        'images/hero-construccion.jpg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
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

    // Skip to main content link (for screen readers)
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
}

// Touch device detection and optimization
function setupTouchOptimizations() {
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
    }
}

// Service Worker registration (for PWA features)
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js')
                .then(function(registration) {
                    console.log('ServiceWorker registration successful');
                })
                .catch(function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                });
        });
    }
}

// Intersection Observer polyfill fallback
function setupIntersectionObserverFallback() {
    if (!window.IntersectionObserver) {
        // Fallback for older browsers
        const images = document.querySelectorAll('.lazy-image');
        images.forEach(img => {
            img.classList.remove('image-placeholder');
            img.classList.add('loaded');
        });
        
        const animatedElements = document.querySelectorAll('.feature-card, .project-card, .service-item');
        animatedElements.forEach(el => {
            el.classList.add('fade-in-up');
        });
    }
}

// Form data submission (replace with your actual backend integration)
async function submitFormData(data) {
    try {
        // Example API call - replace with your actual endpoint
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const result = await response.json();
        console.log('Form submitted successfully:', result);
        
    } catch (error) {
        console.error('Error submitting form:', error);
        showNotification('Hubo un error al enviar el mensaje. Por favor intenta nuevamente.', 'error');
    }
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

// Enhanced carousel keyboard navigation
function setupCarouselKeyboardNavigation() {
    carousels.forEach(carousel => {
        carousel.addEventListener('keydown', function(e) {
            const activeCarousel = carousel.querySelector('.project-carousel');
            if (!activeCarousel) return;

            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    carousel.querySelector('.carousel-prev').click();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    carousel.querySelector('.carousel-next').click();
                    break;
                case ' ': // Spacebar
                    e.preventDefault();
                    // Toggle auto-play
                    const carouselInstance = activeCarousel.carouselInstance;
                    if (carouselInstance) {
                        if (carouselInstance.isPlaying) {
                            carouselInstance.pauseAutoPlay();
                        } else {
                            carouselInstance.startAutoPlay();
                        }
                    }
                    break;
            }
        });

        // Make carousel focusable
        carousel.setAttribute('tabindex', '0');
    });
}

// Page performance monitoring
function setupPerformanceMonitoring() {
    // Monitor page load performance
    window.addEventListener('load', function() {
        const loadTime = performance.now();
        console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
        
        // Report to analytics if needed
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_load_time', {
                value: Math.round(loadTime)
            });
        }
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
    setupCarouselKeyboardNavigation();
    
    // Enhancements
    setupAccessibility();
    setupTouchOptimizations();
    setupIntersectionObserverFallback();
    setupPerformanceMonitoring();
    
    // Performance
    preloadCriticalImages();
    
    // PWA features
    registerServiceWorker();
    
    // Add loading animations with delay
    setTimeout(() => {
        document.querySelectorAll('.hero-text, .hero-image').forEach(el => {
            el.classList.add('fade-in-up');
        });
    }, 100);
    
    console.log('Constructora Picmetrica website initialized successfully!');
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden, pause any animations or heavy processes
        console.log('Page hidden - pausing non-essential operations');
        carousels.forEach(carousel => {
            const carouselInstance = carousel.carouselInstance;
            if (carouselInstance) {
                carouselInstance.pauseAutoPlay();
            }
        });
    } else {
        // Page is visible again
        console.log('Page visible - resuming operations');
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
        // Replace with placeholder or hide image
        e.target.style.display = 'none';
        
        // Show placeholder text
        const placeholder = document.createElement('div');
        placeholder.style.cssText = `
            width: 100%;
            height: 200px;
            background: var(--gray-200);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--gray-600);
            border-radius: 10px;
        `;
        placeholder.textContent = 'Imagen no disponible';
        e.target.parentNode.insertBefore(placeholder, e.target);
    }
}, true);

// Global error handler
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    // You could send this to an error reporting service
});

// Global unhandled promise rejection handler
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    e.preventDefault(); // Prevents the default browser error handling
});

// Utility functions for external use
window.PicmetricaConstructora = {
    scrollToContact,
    scrollToTop,
    showNotification,
    submitFormData
};

// Easter egg - console message
console.log(`
🏗️ Constructora Picmetrica SRL
💻 Sitio web desarrollado con las mejores prácticas
📱 Completamente responsive y optimizado
🚀 Cargado y listo para construir sueños!
`);

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

// Track important user interactions
document.addEventListener('click', function(e) {
    const target = e.target.closest('a, button');
    if (!target) return;
    
    // Track CTA clicks
    if (target.classList.contains('btn-primary')) {
        trackEvent('cta_click', {
            button_text: target.textContent.trim(),
            page_location: window.location.href
        });
    }
    
    // Track navigation to interior design
    if (target.href && target.href.includes('/interiores/')) {
        trackEvent('navigation_interiores', {
            source_page: 'constructora'
        });
    }
    
    // Track WhatsApp clicks
    if (target.classList.contains('floating-cta') || target.href?.includes('wa.me')) {
        trackEvent('whatsapp_click', {
            source: target.classList.contains('floating-cta') ? 'floating_button' : 'link'
        });
    }
});

// Track form submissions
if (contactForm) {
    contactForm.addEventListener('submit', function() {
        trackEvent('form_submit', {
            form_type: 'contact',
            page_location: window.location.href
        });
    });
}

// Track scroll depth
let maxScrollDepth = 0;
window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.round((scrollTop / docHeight) * 100);
    
    if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = scrollPercent;
        
        // Track milestone scroll depths
        if ([25, 50, 75, 90].includes(scrollPercent)) {
            trackEvent('scroll_depth', {
                percent: scrollPercent,
                page_location: window.location.href
            });
        }
    }
});

// Track time on page
let startTime = Date.now();
window.addEventListener('beforeunload', function() {
    const timeOnPage = Math.round((Date.now() - startTime) / 1000);
    trackEvent('time_on_page', {
        seconds: timeOnPage,
        page_location: window.location.href
    });
});