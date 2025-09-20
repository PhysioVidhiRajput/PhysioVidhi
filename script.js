// Responsive navigation mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    mobileMenuButton.firstElementChild.classList.toggle('fa-bars');
    mobileMenuButton.firstElementChild.classList.toggle('fa-xmark');
});

// Smooth scroll for anchor links with offset for sticky header
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetEl = document.querySelector(this.getAttribute('href'));
        if (targetEl) {
            e.preventDefault();
            mobileMenu.classList.add('hidden'); // Always close on click
            const yOffset = document.querySelector('header').offsetHeight + 8;
            const y = targetEl.getBoundingClientRect().top + window.pageYOffset - yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    });
});

// Modal for appointment form successful submission
const appointmentForm = document.getElementById('appointmentForm');
const successModal = document.getElementById('successModal');
const closeModalButton = document.getElementById('closeModal');
appointmentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // You can add additional form validation here if needed
    successModal.classList.add('active');
});
// Modal close events
const closeModal = () => {
    successModal.classList.remove('active');
    appointmentForm.reset();
}
closeModalButton.addEventListener('click', closeModal);
successModal.addEventListener('click', (e) => {
    if(e.target === successModal) {
        closeModal();
    }
});

// Basic accessibility: Close menu with Escape key
document.addEventListener('keydown', function(e) {
    if ((e.key === "Escape" || e.key === "Esc") && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
    }
});

// Accessibility: Return focus to button when closing success modal
successModal.addEventListener('transitionend', () => {
    if (!successModal.classList.contains('active')) {
        appointmentForm.querySelector('input, select, textarea').focus();
    }
});
