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


/* ===== UNIVERSĀLAIS MODĀLIS ===== */
const modal = document.getElementById('universal-modal');
const modalClose = modal.querySelector('.modal-close');
const modalPrev = modal.querySelector('.modal-prev');
const modalNext = modal.querySelector('.modal-next');

const modalImage = document.getElementById('modal-image');
const modalVideo = document.getElementById('modal-video');
const modalIframe = document.getElementById('modal-iframe');
const zoomContainer = document.getElementById('modal-zoom-container');

let modalItems = Array.from(document.querySelectorAll(".modal-item"));
let modalIndex = 0;

/* ZOOM MAINĪGIE */
let currentScale = 1;
let minScale = 1;
let maxScale = 4;
let posX = 0;
let posY = 0;
let startX = 0;
let startY = 0;
let isPanning = false;
let lastTapTime = 0;
let pinchStartDistance = 0;
let pinchStartScale = 1;

function applyZoomTransform() {
    modalImage.style.transform = `translate(${posX}px, ${posY}px) scale(${currentScale})`;
}
function resetZoom() {
    currentScale = 1;
    posX = 0;
    posY = 0;
    applyZoomTransform();
}

/* ATVĒRŠANA */
function openUniversalModal(index) {
    modalIndex = index;
    const item = modalItems[index];
    const type = item.dataset.type || "image";
    const src = item.dataset.full;

    modalImage.classList.remove("show");
    modalVideo.classList.remove("show");
    modalIframe.classList.remove("show");

    zoomContainer.style.display = "none";
    modalVideo.style.display = "none";
    modalIframe.style.display = "none";

    if (type === "image") {
        resetZoom();
        zoomContainer.style.display = "block";
        modalImage.src = src;
        setTimeout(() => modalImage.classList.add("show"), 20);
    } else if (type === "video") {
        modalVideo.src = src;
        modalVideo.style.display = "block";
        setTimeout(() => {
            modalVideo.classList.add("show");
            modalVideo.play();
        }, 20);
    } else if (type === "html") {
        modalIframe.src = src;
        if (item.dataset.width) modalIframe.style.width = item.dataset.width + "px";
        if (item.dataset.height) modalIframe.style.height = item.dataset.height + "px";
        modalIframe.style.display = "block";
        setTimeout(() => modalIframe.classList.add("show"), 20);
    }

    modal.style.display = "flex";
}

/* AIZVĒRŠANA */
function closeUniversalModal() {
    modal.style.display = "none";
    modalVideo.pause();
    resetZoom();
}
modalClose.addEventListener("click", closeUniversalModal);
modal.addEventListener("click", e => {
    if (e.target.classList.contains("modal")) closeUniversalModal();
});

/* BULTIŅAS */
modalNext.addEventListener("click", () => {
    modalIndex = (modalIndex + 1) % modalItems.length;
    openUniversalModal(modalIndex);
});
modalPrev.addEventListener("click", () => {
    modalIndex = (modalIndex - 1 + modalItems.length) % modalItems.length;
    openUniversalModal(modalIndex);
});

/* TASTATŪRA */
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
    if (e.key === "Escape") closeUniversalModal();
});

/* SWIPE */
let touchStartX = 0, touchStartY = 0, touchEndX = 0, touchEndY = 0;

function triggerHaptic() {
    if (navigator.vibrate) navigator.vibrate(10);
}
function animateSwipe(direction) {
    modal.classList.remove("modal-swipe-left", "modal-swipe-right", "modal-swipe-down");
    void modal.offsetWidth;
    modal.classList.add(direction);
}
function handleSwipe() {
    if (currentScale > 1) return; // ja pietuvināts, neswipe-ojam
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;

    if (modal.style.display !== "flex") return;

    if (dy > 80 && Math.abs(dx) < 60) {
        animateSwipe("modal-swipe-down");
        triggerHaptic();
        setTimeout(closeUniversalModal, 200);
        return;
    }
    if (dx > 80 && Math.abs(dy) < 60) {
        animateSwipe("modal-swipe-right");
        triggerHaptic();
        modalIndex = (modalIndex - 1 + modalItems.length) % modalItems.length;
        openUniversalModal(modalIndex);
        return;
    }
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
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
});

/* ZOOM — DESKTOP SCROLL */
zoomContainer.addEventListener("wheel", e => {
    e.preventDefault();
    const delta = -e.deltaY;
    const step = 0.2;
    let newScale = currentScale + (delta > 0 ? step : -step);
    newScale = Math.min(maxScale, Math.max(minScale, newScale));
    currentScale = newScale;
    applyZoomTransform();
}, { passive: false });

/* ZOOM — DESKTOP DRAG */
zoomContainer.addEventListener("mousedown", e => {
    if (currentScale === 1) return;
    isPanning = true;
    zoomContainer.classList.add("grabbing");
    startX = e.clientX - posX;
    startY = e.clientY - posY;
});
document.addEventListener("mousemove", e => {
    if (!isPanning) return;
    posX = e.clientX - startX;
    posY = e.clientY - startY;
    applyZoomTransform();
});
document.addEventListener("mouseup", () => {
    isPanning = false;
    zoomContainer.classList.remove("grabbing");
});

/* ZOOM — DESKTOP DOUBLE CLICK */
zoomContainer.addEventListener("dblclick", () => {
    if (currentScale === 1) {
        currentScale = 2;
    } else {
        currentScale = 1;
        posX = 0;
        posY = 0;
    }
    applyZoomTransform();
});

/* ZOOM — MOBILE DOUBLE TAP */
zoomContainer.addEventListener("touchend", e => {
    const now = Date.now();
    if (now - lastTapTime < 300) {
        if (currentScale === 1) {
            currentScale = 2;
        } else {
            currentScale = 1;
            posX = 0;
            posY = 0;
        }
        applyZoomTransform();
    }
    lastTapTime = now;
});

/* ZOOM — MOBILE PINCH + PAN */
zoomContainer.addEventListener("touchstart", e => {
    if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        pinchStartDistance = Math.hypot(dx, dy);
        pinchStartScale = currentScale;
    } else if (e.touches.length === 1 && currentScale > 1) {
        isPanning = true;
        startX = e.touches[0].clientX - posX;
        startY = e.touches[0].clientY - posY;
    }
}, { passive: false });

zoomContainer.addEventListener("touchmove", e => {
    if (e.touches.length === 2) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const distance = Math.hypot(dx, dy);
        let newScale = pinchStartScale * (distance / pinchStartDistance);
        newScale = Math.min(maxScale, Math.max(minScale, newScale));
        currentScale = newScale;
        applyZoomTransform();
    } else if (e.touches.length === 1 && isPanning) {
        e.preventDefault();
        posX = e.touches[0].clientX - startX;
        posY = e.touches[0].clientY - startY;
        applyZoomTransform();
    }
}, { passive: false });

zoomContainer.addEventListener("touchend", e => {
    if (e.touches.length === 0) {
        isPanning = false;
    }
});

/* ELEMENTU REĢISTRĒŠANA */
modalItems.forEach((item, index) => {
    item.addEventListener("click", () => openUniversalModal(index));
});

/* SCROLL TO TOP */
const scrollBtn = document.getElementById("scrollTopBtn");
window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
        scrollBtn.classList.add("show");
        scrollBtn.classList.remove("hide");
    } else {
        scrollBtn.classList.add("hide");
        scrollBtn.classList.remove("show");
    }
});
scrollBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});
