// Smooth scroll
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        target.scrollIntoView({ behavior: 'smooth' });
    });
});

const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const modalClose = document.getElementById('modal-close');
const modalPrev = document.getElementById('modal-prev');
const modalNext = document.getElementById('modal-next');

const logoItems = Array.from(document.querySelectorAll('.logo-item'));
let currentIndex = 0;

function openModal(index) {
    currentIndex = index;

    // Noņem iepriekšējo animācijas klasi
    modalImg.classList.remove('show');

    // Ielādē jauno attēlu
    modalImg.src = logoItems[index].getAttribute('data-full');

    // Pievieno animāciju pēc nelielas pauzes
    setTimeout(() => {
        modalImg.classList.add('show');
    }, 20);

    modal.style.display = 'block';
}

logoItems.forEach((item, index) => {
    item.addEventListener('click', () => openModal(index));
});

modalClose.addEventListener('click', () => {
    modal.style.display = 'none';
});

modal.addEventListener('click', e => {
    if (e.target === modal) modal.style.display = 'none';
});

// Next / Prev buttons
modalNext.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % logoItems.length;
    openModal(currentIndex);
});

modalPrev.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + logoItems.length) % logoItems.length;
    openModal(currentIndex);
});

// Keyboard navigation
document.addEventListener('keydown', e => {
    if (modal.style.display !== 'block') return;

    if (e.key === 'ArrowRight') {
        currentIndex = (currentIndex + 1) % logoItems.length;
        openModal(currentIndex);
    }

    if (e.key === 'ArrowLeft') {
        currentIndex = (currentIndex - 1 + logoItems.length) % logoItems.length;
        openModal(currentIndex);
    }

    if (e.key === 'Escape') {
        modal.style.display = 'none';
    }
});


