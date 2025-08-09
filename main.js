
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const contactForm = document.getElementById('contact-form');
const downloadResumeBtn = document.getElementById('download-resume');
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

// Navigation functionality
function initNavigation() {
    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Update active nav link based on scroll position
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Project filtering functionality
function initProjectFilters() {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

// Contact form functionality
function initContactForm() {
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Clear previous errors
        clearFormErrors();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };
        
        // Validate form
        const errors = validateForm(data);
        if (Object.keys(errors).length > 0) {
            displayFormErrors(errors);
            return;
        }
        
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn.classList.add('btn-loading');
        
        try {
            // Simulate form submission (replace with actual endpoint)
            await simulateFormSubmission(data);
            
            // Show success message
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            contactForm.reset();
        } catch (error) {
            showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            submitBtn.classList.remove('btn-loading');
        }
    });
}

function validateForm(data) {
    const errors = {};
    
    if (!data.name || data.name.trim().length < 2) {
        errors.name = 'Name must be at least 2 characters long';
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.email = 'Please enter a valid email address';
    }
    
    if (!data.subject || data.subject.trim().length < 3) {
        errors.subject = 'Subject must be at least 3 characters long';
    }
    
    if (!data.message || data.message.trim().length < 10) {
        errors.message = 'Message must be at least 10 characters long';
    }
    
    return errors;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function clearFormErrors() {
    const errorMessages = contactForm.querySelectorAll('.error-message');
    const inputs = contactForm.querySelectorAll('input, textarea');
    
    errorMessages.forEach(error => error.textContent = '');
    inputs.forEach(input => input.classList.remove('error'));
}

function displayFormErrors(errors) {
    Object.keys(errors).forEach(field => {
        const input = contactForm.querySelector(`[name="${field}"]`);
        const errorElement = document.getElementById(`${field}-error`);
        
        if (input && errorElement) {
            input.classList.add('error');
            errorElement.textContent = errors[field];
        }
    });
}

function simulateFormSubmission(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate success (90% of the time)
            if (Math.random() > 0.1) {
                console.log('Form submitted:', data);
                resolve();
            } else {
                reject(new Error('Submission failed'));
            }
        }, 2000);
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles for notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--accent-500)' : 'var(--error)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--radius-base);
        box-shadow: var(--shadow-lg);
        z-index: 1001;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `;
    
    const content = notification.querySelector('.notification-content');
    content.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    `;
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    const timer = setTimeout(() => {
        notification.remove();
    }, 5000);
    
    // Close button functionality
    closeBtn.addEventListener('click', () => {
        clearTimeout(timer);
        notification.remove();
    });
}

// Resume download functionality
function initResumeDownload() {
    if (!downloadResumeBtn) return;

    downloadResumeBtn.addEventListener('click', () => {
        // Create a sample resume content
        const resumeContent = `
John Doe - Full Stack Developer

Contact Information:
Email: john.doe@example.com
Phone: +1 (555) 123-4567
Location: San Francisco, CA

Experience:
2022 - Present: Senior Full Stack Developer at Tech Solutions Inc.
2020 - 2022: Full Stack Developer at Digital Innovations Ltd.
2019 - 2020: Frontend Developer at StartUp Hub

Education:
2017 - 2019: Bachelor's in Computer Science, University of Technology

Skills:
- JavaScript, React, Node.js, Python
- CSS/SCSS, HTML5, Responsive Design
- MongoDB, SQL, Firebase
- Git, Docker, AWS

Projects:
- E-commerce Platform: Full-featured platform with React, Node.js, MongoDB
- Task Management App: Mobile-first app with React Native and Firebase
- Weather Dashboard: Responsive dashboard with Vue.js and Chart.js
        `;
        
        // Create and download the file
        const blob = new Blob([resumeContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'DINUSHA.G CV (1).pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        showNotification('Resume downloaded successfully!', 'success');
    });
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add animation classes to elements
    const animatedElements = document.querySelectorAll('.section-header, .hero-text, .hero-image, .about-text, .about-stats, .project-card, .timeline-item, .contact-info, .contact-form');
    
    animatedElements.forEach((el, index) => {
        // Add staggered delay
        el.style.transitionDelay = `${index * 0.1}s`;
        
        // Add appropriate animation class
        if (el.classList.contains('hero-text') || el.classList.contains('contact-info')) {
            el.classList.add('slide-in-left');
        } else if (el.classList.contains('hero-image') || el.classList.contains('contact-form')) {
            el.classList.add('slide-in-right');
        } else {
            el.classList.add('fade-in');
        }
        
        observer.observe(el);
    });
}

// Skills animation
function initSkillsAnimation() {
    const skillsSection = document.querySelector('.skills-section');
    if (!skillsSection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBars = entry.target.querySelectorAll('.skill-progress');
                skillBars.forEach(bar => {
                    const skill = bar.getAttribute('data-skill');
                    setTimeout(() => {
                        bar.style.width = `${skill}%`;
                    }, 500);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(skillsSection);
}

// Keyboard navigation
function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // ESC key closes mobile menu
        if (e.key === 'Escape') {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
        
        // Arrow key navigation for project filters
        if (e.target.classList.contains('filter-btn')) {
            const currentIndex = Array.from(filterBtns).indexOf(e.target);
            let nextIndex;
            
            if (e.key === 'ArrowLeft') {
                nextIndex = currentIndex > 0 ? currentIndex - 1 : filterBtns.length - 1;
                filterBtns[nextIndex].focus();
            } else if (e.key === 'ArrowRight') {
                nextIndex = currentIndex < filterBtns.length - 1 ? currentIndex + 1 : 0;
                filterBtns[nextIndex].focus();
            }
        }
    });
}

// Performance optimization
function initPerformanceOptimizations() {
    // Lazy load images
    const images = document.querySelectorAll('img[src]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => {
            if (img.dataset.src) {
                imageObserver.observe(img);
            }
        });
    }
}

// Add CSS animations keyframes
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.05);
            }
        }
        
        .notification {
            animation: slideInRight 0.3s ease;
        }
        
        .hero-avatar:hover {
            animation: pulse 2s infinite;
        }
`;
    document.head.appendChild(style);
}
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initProjectFilters();
    initContactForm();
    initResumeDownload();
    initScrollAnimations();
    initSkillsAnimation();
    initKeyboardNavigation();
    initPerformanceOptimizations();
    addAnimationStyles();
    updateActiveNavLink();
    console.log('Portfolio website initialized successfully!');
});
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        updateActiveNavLink();
    }
});
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateForm,
        isValidEmail,
        showNotification
    };
}