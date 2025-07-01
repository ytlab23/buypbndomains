// Function to load header and footer
function loadHeaderAndFooter() {
    const headerPlaceholder = document.getElementById('header');
    const footerPlaceholder = document.getElementById('footer');

    if (headerPlaceholder) {
        fetch('includes/header.html')
            .then(response => response.text())
            .then(data => {
                headerPlaceholder.innerHTML = data;
                initializeMobileMenu();
            });
    }

    if (footerPlaceholder) {
        fetch('includes/footer.html')
            .then(response => response.text())
            .then(data => {
                footerPlaceholder.innerHTML = data;
            });
    }
}

// Initialize mobile menu functionality
function initializeMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const overlay = document.createElement('div');
    overlay.className = 'mobile-menu-overlay';
    
    if (mobileMenuToggle && navLinks) {
        // Add overlay to body
        document.body.appendChild(overlay);
        
        // Toggle mobile menu
        function toggleMobileMenu() {
            mobileMenuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        }
        
        // Initialize event listeners
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
        
        // Close menu when clicking on overlay or nav links
        overlay.addEventListener('click', toggleMobileMenu);
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', toggleMobileMenu);
        });
    }
}

// Handle client-side routing for GitHub Pages
function handleClientRouting() {
    // Check if we were redirected from the 404 page
    const urlParams = new URLSearchParams(window.location.search);
    const redirectPath = urlParams.get('redirect');
    
    if (redirectPath) {
        // Update the URL without reloading the page
        window.history.replaceState(null, null, redirectPath);
        
        // Optional: Scroll to the section if there's a hash in the URL
        if (window.location.hash) {
            const target = document.querySelector(window.location.hash);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Handle client-side routing
    handleClientRouting();
    
    // Load header and footer on all pages
    loadHeaderAndFooter();
    
    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const mobileMenuOverlay = document.createElement('div');
    mobileMenuOverlay.className = 'mobile-menu-overlay';
    document.body.appendChild(mobileMenuOverlay);

    function toggleMobileMenu() {
        navLinks.classList.toggle('active');
        mobileMenuOverlay.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    }

    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    mobileMenuOverlay.addEventListener('click', toggleMobileMenu);

    // Close mobile menu when clicking on a nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add animation classes on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.feature-card, .section-subtitle, h2');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('animate-fade-in-up');
            }
        });
    };

    // Initial check for elements in viewport
    animateOnScroll();
    
    // Check on scroll
    window.addEventListener('scroll', animateOnScroll);

    // Add animation delays to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('animate-fade-in-up');
    });

    // Form submission handling (example)
    const searchForm = document.querySelector('.search-container');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchInput = this.querySelector('input[type="text"]');
            if (searchInput.value.trim() !== '') {
                // Here you would typically handle the search functionality
                console.log('Searching for:', searchInput.value);
                // Example: window.location.href = `/search?q=${encodeURIComponent(searchInput.value)}`;
            }
        });
    }

    // Social login buttons
    const socialButtons = document.querySelectorAll('.btn-google, .btn-github');
    socialButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const provider = this.classList.contains('btn-google') ? 'google' : 'github';
            console.log(`Logging in with ${provider}`);
            // Here you would typically redirect to OAuth provider
            // window.location.href = `/auth/${provider}`;
        });
    });

    // FAQ Toggle Functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Toggle current item
            item.classList.toggle('active');
            
            // Update toggle symbol
            const toggle = item.querySelector('.faq-toggle');
            if (item.classList.contains('active')) {
                toggle.textContent = '-';
            } else {
                toggle.textContent = '+';
            }
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-toggle').textContent = '+';
                }
            });
        });
        
        // Keyboard navigation
        question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                question.click();
            }
        });
    });
    
    // Mobile menu toggle (can be expanded if needed)
    const mobileMenuButton = document.createElement('button');
    mobileMenuButton.className = 'mobile-menu-button';
    mobileMenuButton.innerHTML = '<i class="fas fa-bars"></i>';
    mobileMenuButton.setAttribute('aria-label', 'Toggle menu');
    
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.prepend(mobileMenuButton);
        
        mobileMenuButton.addEventListener('click', function() {
            const navLinks = document.querySelector('.nav-links'); // You'll need to add this element if you want mobile navigation
            if (navLinks) {
                navLinks.classList.toggle('active');
                this.classList.toggle('active');
            }
        });
    }
});

// Add a simple loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});
