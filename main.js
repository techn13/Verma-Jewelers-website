document.addEventListener('DOMContentLoaded', () => {

    // 3D hero responds gently to pointer movement on desktop.
    const jewelStage = document.querySelector('.jewel-stage');
    const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (jewelStage && supportsHover && !prefersReducedMotion) {
        jewelStage.addEventListener('pointermove', event => {
            const bounds = jewelStage.getBoundingClientRect();
            const x = (event.clientX - bounds.left) / bounds.width;
            const y = (event.clientY - bounds.top) / bounds.height;

            jewelStage.style.setProperty('--scene-tilt-x', `${(0.5 - y) * 10}deg`);
            jewelStage.style.setProperty('--scene-tilt-y', `${(x - 0.5) * 14}deg`);
        });

        jewelStage.addEventListener('pointerleave', () => {
            jewelStage.style.setProperty('--scene-tilt-x', '0deg');
            jewelStage.style.setProperty('--scene-tilt-y', '0deg');
        });

        document.querySelectorAll('.depth-card').forEach(card => {
            card.addEventListener('pointermove', event => {
                const bounds = card.getBoundingClientRect();
                const x = (event.clientX - bounds.left) / bounds.width;
                const y = (event.clientY - bounds.top) / bounds.height;

                card.style.setProperty('--tilt-x', `${(0.5 - y) * 8}deg`);
                card.style.setProperty('--tilt-y', `${(x - 0.5) * 8}deg`);
            });

            card.addEventListener('pointerleave', () => {
                card.style.setProperty('--tilt-x', '2deg');
                card.style.setProperty('--tilt-y', '-2deg');
            });
        });
    }

    document.querySelectorAll('.card-img-wrapper img, .image-wrapper img').forEach(image => {
        const showPlaceholder = () => {
            image.parentElement.classList.add('image-unavailable');
            image.classList.add('image-unavailable');
        };

        image.addEventListener('error', showPlaceholder, { once: true });
        if (image.complete && image.naturalWidth === 0) showPlaceholder();
    });

    // 1. Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.getElementById('nav-links');
    const navLinksItems = document.querySelectorAll('.nav-link');

    mobileMenuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileMenuToggle.querySelector('i');
        icon.classList.toggle('fa-bars', !navLinks.classList.contains('active'));
        icon.classList.toggle('fa-xmark', navLinks.classList.contains('active'));
    });

    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = mobileMenuToggle.querySelector('i');
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        });
    });

    // 2. Sticky Header style on scroll
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
            header.style.padding = '5px 0';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
            header.style.padding = '0';
        }
    });

    // 3. Active Nav Link on Scroll
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            if (scrollY >= section.offsetTop - 200) current = section.getAttribute('id');
        });
        navLinksItems.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href').includes(current));
        });
    });

    // 4. Testimonial Carousel
    const track = document.getElementById('testimonial-track');
    const slides = Array.from(track.children);
    const dotsNav = document.getElementById('carousel-dots');
    const dots = Array.from(dotsNav.children);
    let currentIndex = 0;

    const updateCarousel = (index) => {
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        track.style.transform = `translateX(-${index * 100}%)`;
    };

    document.getElementById('next-btn').addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarousel(currentIndex);
    });

    document.getElementById('prev-btn').addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateCarousel(currentIndex);
    });

    dotsNav.addEventListener('click', e => {
        const targetDot = e.target.closest('span');
        if (!targetDot) return;
        currentIndex = dots.findIndex(d => d === targetDot);
        updateCarousel(currentIndex);
    });

    setInterval(() => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarousel(currentIndex);
    }, 5000);

    // 5. Scroll Animations
    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

    document.querySelectorAll('.fade-in-up, .slide-in-left, .slide-in-right')
        .forEach(el => appearOnScroll.observe(el));

    // 6. Language Toggle
    const langToggleBtn = document.getElementById('lang-toggle');
    let currentLang = 'en';
    const elementsToTranslate = document.querySelectorAll('[data-en][data-hi]');

    langToggleBtn.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'hi' : 'en';
        langToggleBtn.textContent = currentLang === 'en' ? 'हिंदी / EN' : 'EN / हिंदी';
        elementsToTranslate.forEach(el => { el.innerHTML = el.getAttribute(`data-${currentLang}`); });
        document.body.style.fontFamily = currentLang === 'hi'
            ? "'Roboto', 'Noto Sans Devanagari', sans-serif"
            : "'Roboto', sans-serif";
    });

    // 7. Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            alert(`Thank you ${document.getElementById('name').value}! We have received your message. We will contact you soon.`);
            contactForm.reset();
        });
    }
});
