/* =========================================================
   Air Cairo Clone - Main JavaScript
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

    /* ---------- 1. Hero Slider Auto-rotation ---------- */
    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.slider-indicators button');
    let current = 0;
    let sliderTimer = null;

    function showSlide(index) {
        if (!slides.length) return;
        slides.forEach((s, i) => s.classList.toggle('active', i === index));
        indicators.forEach((d, i) => d.classList.toggle('active', i === index));
        current = index;
    }

    function nextSlide() {
        showSlide((current + 1) % slides.length);
    }
    function prevSlide() {
        showSlide((current - 1 + slides.length) % slides.length);
    }

    function startSlider() {
        if (slides.length < 2) return;
        stopSlider();
        sliderTimer = setInterval(nextSlide, 5000);
    }
    function stopSlider() {
        if (sliderTimer) clearInterval(sliderTimer);
    }

    document.querySelectorAll('.slider-arrow.prev').forEach(b => b.addEventListener('click', () => { prevSlide(); startSlider(); }));
    document.querySelectorAll('.slider-arrow.next').forEach(b => b.addEventListener('click', () => { nextSlide(); startSlider(); }));
    indicators.forEach((d, i) => d.addEventListener('click', () => { showSlide(i); startSlider(); }));

    const heroSlider = document.querySelector('.hero-slider');
    if (heroSlider) {
        heroSlider.addEventListener('mouseenter', stopSlider);
        heroSlider.addEventListener('mouseleave', startSlider);
    }
    startSlider();

    /* ---------- 2. Booking Tabs ---------- */
    const tabs = document.querySelectorAll('.booking-tab');
    const panels = document.querySelectorAll('.booking-panel');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
            panels.forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            const target = document.querySelector(tab.dataset.target);
            if (target) target.classList.add('active');
        });
    });

    /* ---------- 3. Trip Type Select (per panel) ---------- */
    function bindTripType(panelSelector) {
        const panel = document.querySelector(panelSelector);
        if (!panel) return;
        const selects = panel.querySelectorAll('.tripTypeSelect');
        function update() {
            const val = selects[0] ? selects[0].value : 'round';
            panel.querySelectorAll('.return-field').forEach(function (f) {
                f.style.display = (val === 'oneway') ? 'none' : '';
            });
            const multiLeg = panel.querySelector('.multi-leg');
            if (multiLeg) multiLeg.classList.toggle('d-none', val !== 'multi');
        }
        selects.forEach(function (s) { s.addEventListener('change', update); });
        update();
    }
    bindTripType('#panelBookFlight');
    bindTripType('#panelTimetable');

    /* ---------- 4. Date: set min to today ---------- */
    const today = new Date().toISOString().split('T')[0];
    document.querySelectorAll('input[type="date"]').forEach(d => {
        if (!d.min) d.min = today;
    });

    /* ---------- 5. Swap From / To ---------- */
    const swapBtn = document.querySelector('.swap-btn');
    if (swapBtn) {
        swapBtn.addEventListener('click', () => {
            const from = document.querySelector('#from');
            const to = document.querySelector('#to');
            if (from && to) {
                const temp = from.value;
                from.value = to.value;
                to.value = temp;
            }
        });
    }

    /* ---------- 6. Passenger counters ---------- */
    document.querySelectorAll('.counter-row').forEach(row => {
        const minus = row.querySelector('.minus');
        const plus = row.querySelector('.plus');
        const valEl = row.querySelector('.count');
        const max = parseInt(row.dataset.max || '9', 10);
        if (minus && plus && valEl) {
            minus.addEventListener('click', () => {
                let v = parseInt(valEl.textContent, 10);
                if (v > 0) { v--; updateCount(); }
            });
            plus.addEventListener('click', () => {
                let v = parseInt(valEl.textContent, 10);
                if (v < max) { v++; updateCount(); }
            });
        }
        function updateCount() {
            let v = parseInt(valEl.textContent, 10);
            valEl.textContent = v;
            updateTotal();
        }
    });

    function updateTotal() {
        const totalEl = document.querySelector('#passengerTotal');
        if (!totalEl) return;
        let total = 0;
        document.querySelectorAll('.counter-row .count').forEach(c => total += parseInt(c.textContent, 10));
        totalEl.textContent = total;
        const label = document.querySelector('#passengerLabel');
        if (label) label.textContent = total === 1 ? 'Passenger' : 'Passengers';
    }

    /* ---------- 7. Passenger dropdown toggle ---------- */
    const passField = document.querySelector('#passengerField');
    const passDropdown = document.querySelector('.passenger-dropdown');
    if (passField && passDropdown) {
        passField.addEventListener('click', (e) => {
            e.stopPropagation();
            passDropdown.classList.toggle('show');
        });
    }
    document.addEventListener('click', (e) => {
        if (passDropdown && passField && !passDropdown.contains(e.target) && !passField.contains(e.target)) {
            passDropdown.classList.remove('show');
        }
    });

    /* ---------- 8. Promo code add ---------- */
    const addPromo = document.querySelector('#addPromoBtn');
    const promoWrap = document.querySelector('.promo-code-wrap');
    if (addPromo && promoWrap) {
        addPromo.addEventListener('click', (e) => {
            e.stopPropagation();
            promoWrap.classList.remove('d-none');
            addPromo.classList.add('d-none');
        });
    }

    /* ---------- 9. Check-in radio toggle ---------- */
    document.querySelectorAll('.radio-div-trigger').forEach(radio => {
        radio.addEventListener('change', () => {
            if (!radio.checked) return;
            const relatedId = radio.dataset.relatedDiv;
            const label = document.querySelector('#checkinIdLabel');
            const input = document.querySelector('#checkinIdInput');
            if (relatedId === 'the-booking-ref') {
                if (label) label.textContent = 'Booking Reference';
                if (input) {
                    input.placeholder = 'Booking reference';
                    input.maxLength = 6;
                }
            } else {
                if (label) label.textContent = 'Ticket Number';
                if (input) {
                    input.placeholder = 'Ticket number (13 digits)';
                    input.maxLength = 13;
                }
            }
        });
    });

    /* ---------- 10. Mega menu toggle ---------- */
    const hamburger = document.querySelector('.hamburger');
    const megaMenu = document.querySelector('.mega-menu');
    if (hamburger && megaMenu) {
        hamburger.addEventListener('click', () => {
            megaMenu.classList.toggle('open');
        });
        document.addEventListener('click', (e) => {
            if (!megaMenu.contains(e.target) && !hamburger.contains(e.target)) {
                megaMenu.classList.remove('open');
            }
        });
    }

    /* ---------- 11. Find Flights - simulated submit ---------- */
    document.querySelectorAll('.booking-panel form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"], .btn-main');
            if (btn) {
                const original = btn.innerHTML;
                btn.innerHTML = 'Searching...';
                btn.disabled = true;
                setTimeout(() => {
                    btn.innerHTML = original;
                    btn.disabled = false;
                    alert('This is a demo. In the real Air Cairo website you would be redirected to search results.');
                }, 900);
            }
        });
    });

    /* ---------- 12. Offers carousel arrows ---------- */
    const track = document.querySelector('.offers-track');
    const prevArrow = document.querySelector('.offers-carousel .carousel-arrow.prev');
    const nextArrow = document.querySelector('.offers-carousel .carousel-arrow.next');
    if (track) {
        const scrollAmount = () => Math.round(track.clientWidth * 0.8);
        if (prevArrow) prevArrow.addEventListener('click', () => track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }));
        if (nextArrow) nextArrow.addEventListener('click', () => track.scrollBy({ left: scrollAmount(), behavior: 'smooth' }));
    }

    /* ---------- 13. Newsletter submit ---------- */
    const newsletterForm = document.querySelector('.footer-newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]');
            const msg = newsletterForm.querySelector('.newsletter-msg');
            if (email && msg) {
                if (email.value && email.checkValidity()) {
                    msg.textContent = 'Thank you for subscribing!';
                    msg.classList.remove('text-danger');
                    msg.classList.add('text-success');
                    email.value = '';
                } else {
                    msg.textContent = 'Please enter a valid email address.';
                    msg.classList.remove('text-success');
                    msg.classList.add('text-danger');
                }
            }
        });
    }

    /* ---------- 14. Smooth scroll for in-page anchor links ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
            var href = a.getAttribute('href');
            // Skip placeholder links (#) and external "#top" links; avoid querySelector crashing
            if (!href || href === '#' || href === '#!') return;
            try {
                var target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            } catch (err) {
                // Invalid selector — ignore, let browser navigate to anchor (if any)
            }
        });
    });
});

