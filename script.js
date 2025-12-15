// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialize loading screen
    initLoadingScreen();
    
    // Initialize 3D background
    init3DBackground();
    
    // Initialize particle system
    initParticles();
    
    // Initialize animations
    initAnimations();
    
    // Initialize event listeners
    initEventListeners();
    
    // Initialize GSAP animations
    initGSAPAnimations();
    
    // Initialize inquire modal
    initInquireModal();
});

function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const progressFill = document.querySelector('.progress-fill');
    const loadingPercentage = document.querySelector('.loading-percentage');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            // Hide loading screen after a delay
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 800);
            }, 500);
        }
        
        progressFill.style.width = `${progress}%`;
        loadingPercentage.textContent = `${Math.round(progress)}%`;
    }, 100);
}

function init3DBackground() {
    const canvas = document.getElementById('threeCanvas');
    if (!canvas) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        canvas: canvas,
        alpha: true,
        antialias: true 
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Create floating geometry
    const geometry = new THREE.IcosahedronGeometry(1, 0);
    const material = new THREE.MeshStandardMaterial({ 
        color: 0x00f3ff,
        emissive: 0x00f3ff,
        emissiveIntensity: 0.5,
        metalness: 0.8,
        roughness: 0.2,
        wireframe: true
    });
    
    const meshes = [];
    const meshCount = 15;
    
    for (let i = 0; i < meshCount; i++) {
        const mesh = new THREE.Mesh(geometry, material);
        
        // Random position
        mesh.position.x = (Math.random() - 0.5) * 20;
        mesh.position.y = (Math.random() - 0.5) * 20;
        mesh.position.z = (Math.random() - 0.5) * 10;
        
        // Random scale
        const scale = Math.random() * 0.5 + 0.2;
        mesh.scale.set(scale, scale, scale);
        
        // Store animation properties
        mesh.userData = {
            speed: Math.random() * 0.02 + 0.01,
            rotationSpeed: Math.random() * 0.02 + 0.01,
            direction: new THREE.Vector3(
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.02
            )
        };
        
        scene.add(mesh);
        meshes.push(mesh);
    }
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0x00f3ff, 0.1);
    scene.add(ambientLight);
    
    const pointLight1 = new THREE.PointLight(0x00f3ff, 0.5, 50);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xff00ff, 0.5, 50);
    pointLight2.position.set(-10, -10, 10);
    scene.add(pointLight2);
    
    camera.position.z = 15;
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Animate meshes
        meshes.forEach(mesh => {
            mesh.rotation.x += mesh.userData.rotationSpeed;
            mesh.rotation.y += mesh.userData.rotationSpeed;
            
            // Float movement
            mesh.position.x += mesh.userData.direction.x;
            mesh.position.y += mesh.userData.direction.y;
            mesh.position.z += mesh.userData.direction.z;
            
            // Bounce off boundaries
            if (Math.abs(mesh.position.x) > 15) mesh.userData.direction.x *= -1;
            if (Math.abs(mesh.position.y) > 15) mesh.userData.direction.y *= -1;
            if (Math.abs(mesh.position.z) > 10) mesh.userData.direction.z *= -1;
            
            // Pulsing scale
            const scale = 0.2 + 0.1 * Math.sin(Date.now() * mesh.userData.speed);
            mesh.scale.set(scale, scale, scale);
        });
        
        // Rotate camera slowly
        camera.position.x = Math.sin(Date.now() * 0.0005) * 5;
        camera.position.y = Math.cos(Date.now() * 0.0005) * 5;
        camera.lookAt(0, 0, 0);
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    const particleCount = 100;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random properties
        const size = Math.random() * 4 + 1;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${Math.random() > 0.5 ? '#00f3ff' : '#ff00ff'};
            border-radius: 50%;
            left: ${posX}%;
            top: ${posY}%;
            opacity: ${Math.random() * 0.5 + 0.2};
            box-shadow: 0 0 ${size * 2}px currentColor;
            animation: floatParticle ${duration}s linear infinite ${delay}s;
        `;
        
        container.appendChild(particle);
        particles.push(particle);
    }
    
    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatParticle {
            0% {
                transform: translate(0, 0) rotate(0deg);
                opacity: 0.2;
            }
            25% {
                transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(90deg);
                opacity: 0.7;
            }
            50% {
                transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(180deg);
                opacity: 0.2;
            }
            75% {
                transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(270deg);
                opacity: 0.7;
            }
            100% {
                transform: translate(0, 0) rotate(360deg);
                opacity: 0.2;
            }
        }
    `;
    document.head.appendChild(style);
}

function initAnimations() {
    // Typewriter effect
    const typewriterText = document.getElementById('typewriter');
    const texts = [
        "Premium Used Laptops in Sharjah",
        "Gaming & Business Laptops",
        "Laptop Parts & Accessories",
        "Best Prices in UAE",
        "Warranty Included"
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function typeWriter() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typewriterText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typewriterText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            typingSpeed = 1000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingSpeed = 500; // Pause before next
        }
        
        setTimeout(typeWriter, typingSpeed);
    }
    
    // Start typewriter after a delay
    setTimeout(typeWriter, 1000);
    
    // Animate counter numbers
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };
        
        // Start counter when in view
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                updateCounter();
                observer.unobserve(counter);
            }
        }, { threshold: 0.5 });
        
        observer.observe(counter);
    });
    
    // Initialize Vanilla Tilt for 3D effect
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
            max: 25,
            speed: 400,
            glare: true,
            "max-glare": 0.5,
            scale: 1.05
        });
    }
}

function initEventListeners() {
    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        });
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (window.innerWidth <= 992) {
                    menuToggle.classList.remove('active');
                    navLinks.style.display = 'none';
                }
                
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Update active nav link on scroll
    const sections = document.querySelectorAll('section');
    const navLinksAll = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });
        
        navLinksAll.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Parallax effect on scroll
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero-section');
        
        if (hero) {
            const rate = scrolled * -0.5;
            hero.style.transform = `translate3d(0, ${rate}px, 0)`;
        }
    });
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn, .product-btn, .gaming-btn, .submit-btn, .part-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', (event) => {
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = event.clientX - rect.left - size / 2;
            const y = event.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple 0.6s linear;
                width: ${size}px;
                height: ${size}px;
                top: ${y}px;
                left: ${x}px;
                pointer-events: none;
            `;
            
            button.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Add ripple animation CSS
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
}

function initGSAPAnimations() {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Animate sections on scroll
    gsap.utils.toArray('section').forEach(section => {
        gsap.from(section, {
            opacity: 0,
            y: 50,
            duration: 1,
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            }
        });
    });
    
    // Animate product cards
    gsap.from('.product-card-3d', {
        scrollTrigger: {
            trigger: '.brands-section',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power2.out'
    });
    
    // Animate gaming section elements
    gsap.from('.gaming-main-card', {
        scrollTrigger: {
            trigger: '.gaming-section',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        x: -50,
        duration: 1,
        ease: 'power2.out'
    });
    
    gsap.from('.gaming-features .feature', {
        scrollTrigger: {
            trigger: '.gaming-section',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        x: 50,
        stagger: 0.2,
        duration: 1,
        ease: 'power2.out'
    });
    
    // Continuous floating animation for elements
    gsap.to('.floating-laptop-3d', {
        y: '20px',
        duration: 3,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true
    });
    
    // Animate neon glow pulses
    const neonElements = document.querySelectorAll('.neon-text, .neon-gradient');
    neonElements.forEach(element => {
        gsap.to(element, {
            filter: 'drop-shadow(0 0 30px currentColor)',
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    });
}

function initInquireModal() {
    const inquireModal = document.getElementById('inquireModal');
    const modalClose = document.getElementById('modalClose');
    const submitBtn = document.getElementById('submitInquiry');
    const successMessage = document.getElementById('successMessage');
    const inquireButtons = document.querySelectorAll('.inquire-btn');
    
    // Open modal when clicking inquire buttons
    inquireButtons.forEach(button => {
        button.addEventListener('click', () => {
            const title = button.getAttribute('data-title');
            const specs = button.getAttribute('data-specs');
            const price = button.getAttribute('data-price');
            const image = button.getAttribute('data-image');
            
            // Set modal content
            document.getElementById('modalProductTitle').textContent = title;
            document.getElementById('modalProductSpecs').textContent = specs;
            document.getElementById('modalProductPrice').textContent = price;
            document.getElementById('modalProductImage').src = image;
            
            // Show modal
            inquireModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close modal
    modalClose.addEventListener('click', () => {
        inquireModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    
    // Close modal when clicking overlay
    document.querySelector('.modal-overlay').addEventListener('click', () => {
        inquireModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && inquireModal.classList.contains('active')) {
            inquireModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Handle form submission
    submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('customerName').value;
        const phone = document.getElementById('customerPhone').value;
        const email = document.getElementById('customerEmail').value;
        const message = document.getElementById('customerMessage').value;
        const product = document.getElementById('modalProductTitle').textContent;
        
        if (!name || !phone) {
            alert('Please fill in at least your name and phone number');
            return;
        }
        
        // Simulate form submission
        console.log('Inquiry submitted:', {
            name,
            phone,
            email,
            message,
            product
        });
        
        // Show success message
        successMessage.classList.add('active');
        
        // Reset form
        document.getElementById('customerName').value = '';
        document.getElementById('customerPhone').value = '';
        document.getElementById('customerEmail').value = '';
        document.getElementById('customerMessage').value = '';
        
        // Close modal after delay
        setTimeout(() => {
            inquireModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }, 1000);
        
        // Hide success message after delay
        setTimeout(() => {
            successMessage.classList.remove('active');
        }, 3000);
        
        // Optional: Send WhatsApp message
        const whatsappMessage = `Hello, I'm interested in ${product}.\nName: ${name}\nPhone: ${phone}${email ? `\nEmail: ${email}` : ''}${message ? `\nMessage: ${message}` : ''}`;
        const whatsappUrl = `https://wa.me/91742678632?text=${encodeURIComponent(whatsappMessage)}`;
        
        // You can choose to automatically open WhatsApp
        // window.open(whatsappUrl, '_blank');
    });
}

// Initialize everything when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

function init() {
    // Set current year in footer if needed
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}