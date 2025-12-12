/**
 * Laurel Cottage Dental Practice
 * Main JavaScript - Interactivity & Enhancements
 */

(function() {
    'use strict';

    // ============================================
    // DOM Elements
    // ============================================
    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu__link');
    const contactForm = document.getElementById('contactForm');
    const currentYearEl = document.getElementById('currentYear');

    // ============================================
    // Header Scroll Effect
    // ============================================
    function handleHeaderScroll() {
        if (window.scrollY > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    }

    // ============================================
    // Mobile Menu Toggle
    // ============================================
    function toggleMobileMenu() {
        const isActive = mobileMenu.classList.contains('active');

        mobileMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');

        // Prevent body scroll when menu is open
        document.body.style.overflow = isActive ? '' : 'hidden';
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.style.overflow = '';
    }

    // ============================================
    // Smooth Scroll for Navigation Links
    // ============================================
    function handleSmoothScroll(e) {
        const href = e.currentTarget.getAttribute('href');

        if (href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                // Close mobile menu if open
                closeMobileMenu();

                // Scroll to target
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    }

    // ============================================
    // Form Handling
    // ============================================
    function handleFormSubmit(e) {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());

        // Basic validation
        const name = data.name?.trim();
        const email = data.email?.trim();
        const phone = data.phone?.trim();

        if (!name || !email || !phone) {
            showFormMessage('Please fill in all required fields.', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showFormMessage('Please enter a valid email address.', 'error');
            return;
        }

        // Show success message (in production, this would submit to a server)
        showFormMessage('Thank you for your enquiry! We will be in touch shortly.', 'success');
        contactForm.reset();

        // Log form data for demo purposes
        console.log('Form submitted:', data);
    }

    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function showFormMessage(message, type) {
        // Remove any existing message
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `form-message form-message--${type}`;
        messageEl.textContent = message;
        messageEl.style.cssText = `
            padding: 1rem;
            margin-bottom: 1rem;
            border-radius: 0.5rem;
            font-weight: 500;
            ${type === 'success'
                ? 'background-color: #d1fae5; color: #065f46; border: 1px solid #6ee7b7;'
                : 'background-color: #fee2e2; color: #991b1b; border: 1px solid #fca5a5;'}
        `;

        // Insert at top of form
        contactForm.insertBefore(messageEl, contactForm.firstChild);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            messageEl.remove();
        }, 5000);
    }

    // ============================================
    // Intersection Observer for Animations
    // ============================================
    function initScrollAnimations() {
        // Check if IntersectionObserver is supported
        if (!('IntersectionObserver' in window)) {
            return;
        }

        // Check for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        const animatedElements = document.querySelectorAll(
            '.service-card, .team-card, .testimonial-card, .feature'
        );

        // Set initial state
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Stagger animation
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);

                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => observer.observe(el));
    }

    // ============================================
    // Update Current Year
    // ============================================
    function updateCurrentYear() {
        if (currentYearEl) {
            currentYearEl.textContent = new Date().getFullYear();
        }
    }

    // ============================================
    // Click to Call Tracking (placeholder for analytics)
    // ============================================
    function initCallTracking() {
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');

        phoneLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Track phone call clicks (integrate with analytics)
                console.log('Phone call initiated');

                // Example: Google Analytics event
                // gtag('event', 'click', { event_category: 'Contact', event_label: 'Phone Call' });
            });
        });
    }

    // ============================================
    // Initialize
    // ============================================
    function init() {
        // Update year
        updateCurrentYear();

        // Header scroll effect
        window.addEventListener('scroll', handleHeaderScroll, { passive: true });
        handleHeaderScroll(); // Check on load

        // Mobile menu
        if (menuToggle && mobileMenu) {
            menuToggle.addEventListener('click', toggleMobileMenu);

            mobileMenuLinks.forEach(link => {
                link.addEventListener('click', handleSmoothScroll);
            });
        }

        // Smooth scroll for all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', handleSmoothScroll);
        });

        // Form handling
        if (contactForm) {
            contactForm.addEventListener('submit', handleFormSubmit);
        }

        // Scroll animations
        initScrollAnimations();

        // Call tracking
        initCallTracking();

        // Log initialization
        console.log('Laurel Cottage Dental - Site initialized');
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
