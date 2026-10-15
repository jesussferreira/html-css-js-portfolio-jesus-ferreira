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

function initContactForm() {
    const form = document.querySelector('form[name="contact"]');
    if (!form) return;
    const status = form.querySelector(".form-status");
    const validators = {
        name: (v) => v.trim().length >= 2 ? "" : "Ingresa tu nombre (mínimo 2 caracteres).",
        email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Ingresa un email válido.",
        subject: (v) => v.trim().length >= 3 ? "" : "Ingresa un asunto (mínimo 3 caracteres).",
        message: (v) => v.trim().length >= 10 ? "" : "El mensaje debe tener mínimo 10 caracteres."
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
        input.addEventListener("blur", () => setError(field, validators[field](input.value)));
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
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalLabel = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = "Enviando...";
        if (status) status.textContent = "";

        try {
            const response = await fetch("/", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
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