/* ============================
   Smooth scroll navigation
============================ */
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        target.scrollIntoView({ behavior: 'smooth' });
    });
});


/* ============================
   LOGO MODAL
============================ */
const logoModal = document.getElementById('modal');
const logoModalImg = document.getElementById('modal-img');
const logoModalClose = document.getElementById('modal-close');
const logoModalPrev = document.getElementById('modal-prev');
const logoModalNext = document.getElementById('modal-next');

const logoItems = Array.from(document.querySelectorAll('.logo-item'));
let logoIndex = 0;

function openLogoModal(index) {
    logoIndex = index;

    logoModalImg.classList.remove('show');
    logoModalImg.src = logoItems[index].getAttribute('data-full');

    setTimeout(() => logoModalImg.classList.add('show'), 20);

    logoModal.style.display = 'block';
}

logoItems.forEach((item, index) => {
    item.addEventListener('click', () => openLogoModal(index));
});

logoModalClose.addEventListener('click', () => {
    logoModal.style.display = 'none';
});

logoModal.addEventListener('click', e => {
    if (e.target === logoModal) logoModal.style.display = 'none';
});

logoModalNext.addEventListener('click', () => {
    logoIndex = (logoIndex + 1) % logoItems.length;
    openLogoModal(logoIndex);
});

logoModalPrev.addEventListener('click', () => {
    logoIndex = (logoIndex - 1 + logoItems.length) % logoItems.length;
    openLogoModal(logoIndex);
});


/* ============================
   ANIMATION MODAL
============================ */
const animModal = document.getElementById('anim-modal');
const animClose = document.getElementById('anim-close');
const animPrev = document.getElementById('anim-prev');
const animNext = document.getElementById('anim-next');

const animVideo = document.getElementById('anim-video');
const animImage = document.getElementById('anim-image');
const animIframe = document.getElementById('anim-iframe');

const animItems = Array.from(document.querySelectorAll('.anim-item'));
let animIndex = 0;

function openAnimModal(index) {
    animIndex = index;

    const src = animItems[index].getAttribute('data-full');
    const type = animItems[index].getAttribute('data-type') || '';

    animVideo.pause();
    animVideo.classList.remove('show');
    animImage.classList.remove('show');
    animIframe.classList.remove('show');

    animVideo.style.display = 'none';
    animImage.style.display = 'none';
    animIframe.style.display = 'none';

   if (type === 'html') {

    const w = animItems[index].getAttribute('data-width');
    const h = animItems[index].getAttribute('data-height');

    animIframe.style.width = w + "px";
    animIframe.style.height = h + "px";

    animIframe.src = src;
    animIframe.style.display = 'block';
    setTimeout(() => animIframe.classList.add('show'), 20);
}

    } else if (src.endsWith('.mp4')) {
        animVideo.src = src;
        animVideo.style.display = 'block';
        setTimeout(() => {
            animVideo.classList.add('show');
            animVideo.play();
        }, 20);

    } else {
        animImage.src = src;
        animImage.style.display = 'block';
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

animNext.addEventListener('click', () => {
    animIndex = (animIndex + 1) % animItems.length;
    openAnimModal(animIndex);
});

animPrev.addEventListener('click', () => {
    animIndex = (animIndex - 1 + animItems.length) % animItems.length;
    openAnimModal(animIndex);
});


/* ============================
   KEYBOARD NAVIGATION
============================ */
document.addEventListener('keydown', e => {

    // Logo modal
    if (logoModal.style.display === 'block') {
        if (e.key === 'ArrowRight') {
            logoIndex = (logoIndex + 1) % logoItems.length;
            openLogoModal(logoIndex);
        }
        if (e.key === 'ArrowLeft') {
            logoIndex = (logoIndex - 1 + logoItems.length) % logoItems.length;
            openLogoModal(logoIndex);
        }
        if (e.key === 'Escape') {
            logoModal.style.display = 'none';
        }
    }

    // Animation modal
    if (animModal.style.display === 'block') {
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
    }
});
