function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    if (!menu || !icon) return;
    const isOpen = menu.classList.toggle("open");
    icon.classList.toggle("open", isOpen);
    icon.setAttribute("aria-expanded", String(isOpen));
    icon.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
}

function initMenu() {
    const icon = document.querySelector(".hamburger-icon");
    const menu = document.querySelector(".menu-links");
    if (!icon || !menu) return;

    icon.addEventListener("click", toggleMenu);

    menu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            if (menu.classList.contains("open")) toggleMenu();
        });
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && menu.classList.contains("open")) {
            toggleMenu();
            icon.focus();
        }
    });

    document.addEventListener("click", (event) => {
        if (!menu.classList.contains("open")) return;
        const wrapper = document.querySelector(".hamburger-menu");
        if (wrapper && !wrapper.contains(event.target)) toggleMenu();
    });
}

function initContactForm() {
    const form = document.querySelector('form[name="contact"]');
    if (!form) return;
    const status = form.querySelector(".form-status");
    const validators = {
        name: (value) => value.trim().length >= 2 ? "" : "Ingresa tu nombre (mínimo 2 caracteres).",
        email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? "" : "Ingresa un email válido.",
        subject: (value) => value.trim().length >= 3 ? "" : "Ingresa un asunto (mínimo 3 caracteres).",
        message: (value) => value.trim().length >= 10 ? "" : "El mensaje debe tener mínimo 10 caracteres."
    };

    function setError(field, message) {
        const input = form.querySelector(`[name="${field}"]`);
        const error = form.querySelector(`.form-error[data-for="${field}"]`);
        if (input) input.setAttribute("aria-invalid", message ? "true" : "false");
        if (error) error.textContent = message;
    }

    function validate() {
        let valid = true;
        Object.keys(validators).forEach((field) => {
            const input = form.querySelector(`[name="${field}"]`);
            const message = validators[field](input ? input.value : "");
            setError(field, message);
            if (message) valid = false;
        });
        return valid;
    }

    Object.keys(validators).forEach((field) => {
        const input = form.querySelector(`[name="${field}"]`);
        if (!input) return;
        input.addEventListener("blur", () => {
            setError(field, validators[field](input.value));
        });
        input.addEventListener("input", () => {
            if (input.getAttribute("aria-invalid") === "true") {
                setError(field, validators[field](input.value));
            }
        });
    });

    form.addEventListener("submit", async (event) => {
        if (!validate()) {
            event.preventDefault();
            if (status) status.textContent = "Revisa los campos marcados.";
            return;
        }

        const honeypot = form.querySelector('[name="bot-field"]');
        if (honeypot && honeypot.value.trim() !== "") {
            event.preventDefault();
            return;
        }

        event.preventDefault();
        const originalLabel = form.querySelector('button[type="submit"]').textContent;
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = "Enviando...";
        if (status) status.textContent = "";

        try {
            const response = await fetch("/", {
                method: "POST",
                headers: { "Accept": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(new FormData(form)).toString()
            });
            if (!response.ok) throw new Error("network");
            if (status) {
                status.textContent = "Mensaje enviado correctamente. Te responderé pronto.";
                status.style.color = "var(--accent)";
            }
            form.reset();
            Object.keys(validators).forEach((field) => setError(field, ""));
        } catch (error) {
            if (status) {
                status.textContent = "No se pudo enviar. Escríbeme a cardozoferreirajesus2003@gmail.com.";
                status.style.color = "var(--danger)";
            }
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalLabel;
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initMenu();
    initContactForm();
});