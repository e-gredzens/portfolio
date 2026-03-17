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

const animModal = document.getElementById('anim-modal');
const animClose = document.getElementById('anim-close');
const animPrev = document.getElementById('anim-prev');
const animNext = document.getElementById('anim-next');
const animVideo = document.getElementById('anim-video');
const animImage = document.getElementById('anim-image');

const animItems = Array.from(document.querySelectorAll('.anim-item'));
let animIndex = 0;

function openAnimModal(index) {
    animIndex = index;
    const src = animItems[index].getAttribute('data-full');

    animVideo.pause();
    animVideo.classList.remove('show');
    animImage.classList.remove('show');

    if (src.endsWith('.mp4')) {
        animVideo.src = src;
        animVideo.style.display = 'block';
        animImage.style.display = 'none';

        setTimeout(() => animVideo.classList.add('show'), 20);
    } else {
        animImage.src = src;
        animImage.style.display = 'block';
        animVideo.style.display = 'none';

        setTimeout(() => animImage.classList.add('show'), 20);
    }

    animModal.style.display = 'block';
}

animItems.forEach((item, index) => {
    item.addEventListener('click', () => openAnimModal(index));
});

animClose.addEventListener('click', () => {
    animModal.style.display = 'none';
    animVideo.pause();
});

animModal.addEventListener('click', e => {
    if (e.target === animModal) {
        animModal.style.display = 'none';
        animVideo.pause();
    }
});

// Next / Prev
animNext.addEventListener('click', () => {
    animIndex = (animIndex + 1) % animItems.length;
    openAnimModal(animIndex);
});

animPrev.addEventListener('click', () => {
    animIndex = (animIndex - 1 + animItems.length) % animItems.length;
    openAnimModal(animIndex);
});

// Keyboard navigation
document.addEventListener('keydown', e => {
    if (animModal.style.display !== 'block') return;

    if (e.key === 'ArrowRight') {
        animIndex = (animIndex + 1) % animItems.length;
        openAnimModal(animIndex);
    }

    if (e.key === 'ArrowLeft') {
        animIndex = (animIndex - 1 + animItems.length) % animItems.length;
        openAnimModal(animIndex);
    }

    if (e.key === 'Escape') {
        animModal.style.display = 'none';
        animVideo.pause();
    }
});

