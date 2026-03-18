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
   UNIVERSĀLAIS MODĀLIS
============================ */

/* Elementi */
const modal = document.getElementById('universal-modal');
const modalClose = modal.querySelector('.modal-close');
const modalPrev = modal.querySelector('.modal-prev');
const modalNext = modal.querySelector('.modal-next');

const modalImage = document.getElementById('modal-image');
const modalVideo = document.getElementById('modal-video');
const modalIframe = document.getElementById('modal-iframe');

let modalItems = [];   // visi elementi, kas atver modāli
let modalIndex = 0;    // pašreizējais elements


/* ============================
   MODĀĻA ATVĒRŠANA
============================ */
function openUniversalModal(index) {
    modalIndex = index;

    const item = modalItems[index];
    const type = item.dataset.type || "image";
    const src = item.dataset.full;

    // Paslēpjam visu
    modalImage.style.display = "none";
    modalVideo.style.display = "none";
    modalIframe.style.display = "none";

    modalImage.classList.remove("show");
    modalVideo.classList.remove("show");
    modalIframe.classList.remove("show");

    // Attēls
    if (type === "image") {
        modalImage.src = src;
        modalImage.style.display = "block";
        setTimeout(() => modalImage.classList.add("show"), 20);
    }

    // Video
    else if (type === "video") {
        modalVideo.src = src;
        modalVideo.style.display = "block";
        setTimeout(() => {
            modalVideo.classList.add("show");
            modalVideo.play();
        }, 20);
    }

    // HTML5 baneris (iframe)
    else if (type === "html") {
        modalIframe.src = src;

        if (item.dataset.width) modalIframe.style.width = item.dataset.width + "px";
        if (item.dataset.height) modalIframe.style.height = item.dataset.height + "px";

        modalIframe.style.display = "block";
        setTimeout(() => modalIframe.classList.add("show"), 20);
    }

    modal.style.display = "flex";
}


/* ============================
   MODĀĻA AIZVĒRŠANA
============================ */
function closeUniversalModal() {
    modal.style.display = "none";
    modalVideo.pause();
}

modalClose.addEventListener("click", closeUniversalModal);

/* Aizver uz melnā fona */
modal.addEventListener("click", e => {
    if (e.target.classList.contains("modal")) {
        closeUniversalModal();
    }
});


/* ============================
   BULTIŅAS
============================ */
modalNext.addEventListener("click", () => {
    modalIndex = (modalIndex + 1) % modalItems.length;
    openUniversalModal(modalIndex);
});

modalPrev.addEventListener("click", () => {
    modalIndex = (modalIndex - 1 + modalItems.length) % modalItems.length;
    openUniversalModal(modalIndex);
});


/* ============================
   TASTATŪRA
============================ */
document.addEventListener("keydown", e => {
    if (modal.style.display !== "flex") return;

    if (e.key === "ArrowRight") {
        modalIndex = (modalIndex + 1) % modalItems.length;
        openUniversalModal(modalIndex);
    }

    if (e.key === "ArrowLeft") {
        modalIndex = (modalIndex - 1 + modalItems.length) % modalItems.length;
        openUniversalModal(modalIndex);
    }

    if (e.key === "Escape") {
        closeUniversalModal();
    }
});


/* ============================
   SWIPE NAVIGĀCIJA
============================ */
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

function triggerHaptic() {
    if (navigator.vibrate) navigator.vibrate(10);
}

function animateSwipe(direction) {
    modal.classList.remove("modal-swipe-left", "modal-swipe-right", "modal-swipe-down");
    void modal.offsetWidth;
    modal.classList.add(direction);
}

function handleSwipe() {
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;

    if (modal.style.display !== "flex") return;

    // Swipe down → aizvērt
    if (dy > 80 && Math.abs(dx) < 60) {
        animateSwipe("modal-swipe-down");
        triggerHaptic();
        setTimeout(closeUniversalModal, 200);
        return;
    }

    // Swipe right → iepriekšējais
    if (dx > 80 && Math.abs(dy) < 60) {
        animateSwipe("modal-swipe-right");
        triggerHaptic();
        modalIndex = (modalIndex - 1 + modalItems.length) % modalItems.length;
        openUniversalModal(modalIndex);
        return;
    }

    // Swipe left → nākamais
    if (dx < -80 && Math.abs(dy) < 60) {
        animateSwipe("modal-swipe-left");
        triggerHaptic();
        modalIndex = (modalIndex + 1) % modalItems.length;
        openUniversalModal(modalIndex);
        return;
    }
}

document.addEventListener("touchstart", e => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener("touchend", e => {
    touch

