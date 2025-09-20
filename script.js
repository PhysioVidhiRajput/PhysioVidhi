// Mobile Menu Toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
mobileMenuButton.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});

// Form Submission & Modal
const appointmentForm = document.getElementById('appointmentForm');
const successModal = document.getElementById('successModal');
const closeModalButton = document.getElementById('closeModal');

appointmentForm.addEventListener('submit', (e) => {
  e.preventDefault();
  successModal.classList.add('active');
});

const closeModal = () => {
  successModal.classList.remove('active');
  appointmentForm.reset();
};
closeModalButton.addEventListener('click', closeModal);
successModal.addEventListener('click', (e) => {
  if (e.target === successModal) {
    closeModal();
  }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    mobileMenu.classList.add('hidden');
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth',
    });
  });
});