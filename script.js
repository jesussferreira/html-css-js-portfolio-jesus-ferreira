function initMenu() {
    const toggle = document.querySelector(".menu-toggle");
    const menu = document.querySelector("#menu-movil");
    if (!toggle || !menu) return;

    function setMenu(isOpen) {
        menu.classList.toggle("open", isOpen);
        toggle.setAttribute("aria-expanded", String(isOpen));
        toggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
    }

    toggle.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
    menu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => setMenu(false));
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && menu.classList.contains("open")) {
            setMenu(false);
            toggle.focus();
        }
    });
    document.addEventListener("click", (event) => {
        if (!menu.classList.contains("open")) return;
        const nav = document.querySelector(".site-nav");
        if (nav && !nav.contains(event.target)) setMenu(false);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initMenu();
});