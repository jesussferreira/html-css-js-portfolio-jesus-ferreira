function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    const isOpen = menu.classList.toggle("open");
    icon.classList.toggle("open", isOpen);
    icon.setAttribute("aria-expanded", String(isOpen));
    icon.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
}

// Close mobile menu on Escape or when a link is followed
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        const menu = document.querySelector(".menu-links");
        const icon = document.querySelector(".hamburger-icon");
        if (menu && menu.classList.contains("open")) {
            menu.classList.remove("open");
            icon.classList.remove("open");
            icon.setAttribute("aria-expanded", "false");
            icon.setAttribute("aria-label", "Abrir menú");
        }
    }
});