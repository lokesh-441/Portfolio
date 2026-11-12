const navigationItems = [
  { label: "Home", href: "index.html#home", page: "index.html" },
  { label: "About", href: "about.html#about", page: "about.html" },
  { label: "Skills", href: "skills.html#skills", page: "skills.html" },
  { label: "Projects", href: "projects.html#projects", page: "projects.html" },
  { label: "Contact", href: "contact.html#contact", page: "contact.html" },
];
const currentPage =
  window.location.pathname.split("/").pop().toLowerCase() || "index.html";
const headerPlaceholder = document.querySelector("#site-header");
const footerPlaceholder = document.querySelector("#site-footer");

if (headerPlaceholder) {
  const navigationMarkup = navigationItems
    .map(({ label, href, page }) => {
      const isActive = currentPage === page;
      return `<a class="nav-link${isActive ? " is-active" : ""}" href="${href}"${
        isActive ? ' aria-current="page"' : ""
      }>${label}</a>`;
    })
    .join("");

  headerPlaceholder.innerHTML = `
    <header class="site-header">
      <a class="wordmark" href="index.html#home" aria-label="KVL home">
        <span class="wordmark__bracket">&lt;</span>KVL<span class="wordmark__bracket">/&gt;</span>
      </a>
      <button
        class="menu-toggle"
        type="button"
        aria-expanded="false"
        aria-controls="primary-navigation"
        aria-label="Open navigation menu"
      >
        <span></span>
        <span></span>
      </button>
      <nav class="primary-navigation" id="primary-navigation" aria-label="Main navigation">
        ${navigationMarkup}
      </nav>
    </header>
  `;
}

if (footerPlaceholder) {
  footerPlaceholder.innerHTML = `
    <footer class="site-footer section-shell">
      <span>© <span id="current-year"></span> KOTARU VENAKATA LOKESH</span>
      <span>PERSONAL PORTFOLIO <span class="footer-dot">✳</span></span>
    </footer>
  `;
}

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-navigation");
const navigationLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");
const yearElement = document.querySelector("#current-year");
const canvas = document.querySelector(".ambient-canvas");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

if (!reducedMotion.matches) {
  document.documentElement.classList.add("page-entering");
  document.documentElement.addEventListener(
    "animationend",
    (event) => {
      if (
        event.target === document.documentElement &&
        event.animationName === "page-fade-in"
      ) {
        document.documentElement.classList.remove("page-entering");
      }
    },
  );
}

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

const profilePhoto = document.querySelector(".profile-photo");
const profileImage = profilePhoto
  ? profilePhoto.querySelector(".profile-photo__image")
  : null;

if (profilePhoto && profileImage) {
  const showProfileFallback = () => profilePhoto.classList.add("is-fallback");
  profileImage.addEventListener("error", showProfileFallback, { once: true });

  if (profileImage.complete && profileImage.naturalWidth === 0) {
    showProfileFallback();
  }
}

const contactForm = document.querySelector("#contact-form");

if (contactForm instanceof HTMLFormElement) {
  const formFields = Array.from(contactForm.querySelectorAll("input, textarea"));
  const submitButton = contactForm.querySelector(".contact-form__submit");
  const submitLabel = contactForm.querySelector(".contact-form__submit-label");
  const formStatus = contactForm.querySelector("#contact-form-status");
  contactForm.noValidate = true;

  const setFormStatus = (message, isError) => {
    formStatus.textContent = message;
    formStatus.hidden = !message;
    formStatus.classList.toggle("is-error", isError);
    formStatus.setAttribute("role", isError ? "alert" : "status");
  };

  const validateField = (field) => {
    const label = contactForm.querySelector(`label[for="${field.id}"]`);
    const error = contactForm.querySelector(`#${field.id}-error`);
    const fieldName = label.textContent.trim();
    let message = "";

    if (field.required && field.value.trim() === "") {
      message = `${fieldName} is required.`;
    } else if (field.type === "email" && field.validity.typeMismatch) {
      message = "Enter a valid email address.";
    } else if (field.validity.tooLong) {
      message = `${fieldName} is too long.`;
    }

    error.textContent = message;
    field.setAttribute("aria-invalid", String(Boolean(message)));
    return message === "";
  };

  formFields.forEach((field) => {
    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true") {
        validateField(field);
      }
    });
  });

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setFormStatus("", false);

    const isValid = formFields.map(validateField).every(Boolean);
    if (!isValid) return;

    if (contactForm.action.includes("YOUR_FORM_ID")) {
      setFormStatus(
        "Before using the form, replace YOUR_FORM_ID in its action URL with your Formspree form ID.",
        true,
      );
      return;
    }

    submitButton.disabled = true;
    submitLabel.textContent = "Sending…";
    contactForm.setAttribute("aria-busy", "true");

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        console.error("Contact form submission failed with status", response.status);
        setFormStatus(
          "Your message could not be sent. Please try again or email me directly.",
          true,
        );
        return;
      }

      contactForm.reset();
      formFields.forEach((field) => field.setAttribute("aria-invalid", "false"));
      setFormStatus("Thanks! Your message has been sent.", false);
    } catch (error) {
      console.error("Contact form submission failed.", error);
      setFormStatus(
        "Your message could not be sent. Please try again or email me directly.",
        true,
      );
    } finally {
      submitButton.disabled = false;
      submitLabel.textContent = "Send Message";
      contactForm.removeAttribute("aria-busy");
    }
  });
}

function closeMenu() {
  if (!menuToggle || !navigation) return;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
  navigation.classList.remove("is-open");
}

if (menuToggle && navigation) {
  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuToggle.setAttribute(
      "aria-label",
      isExpanded ? "Open navigation menu" : "Close navigation menu",
    );
    navigation.classList.toggle("is-open", !isExpanded);
  });

  navigationLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  document.addEventListener("click", (event) => {
    if (
      navigation.classList.contains("is-open") &&
      !navigation.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      closeMenu();
    }
  });
}

const revealSelector = [
  ".hero__copy",
  ".about-intro",
  ".section-heading",
  ".about-section-heading",
  ".skills-intro",
  ".projects-intro",
  ".contact-intro",
  ".info-card",
  ".objective-card",
  ".timeline-entry",
  ".certification-card",
  ".skill-card",
  ".project-card__header",
  ".project-detail",
  ".technology-section",
  ".contact-card",
].join(", ");
const revealTargets = document.querySelectorAll(revealSelector);

if ("IntersectionObserver" in window && !reducedMotion.matches) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -32px 0px" },
  );

  revealTargets.forEach((target) => {
    const siblings = Array.from(target.parentElement.children).filter((sibling) =>
      sibling.matches(revealSelector),
    );
    const siblingIndex = siblings.indexOf(target);
    const delay = Math.min(Math.max(siblingIndex, 0), 5) * 80;
    target.style.setProperty("--reveal-delay", `${delay}ms`);
    target.classList.add("scroll-reveal");
    revealObserver.observe(target);
  });

  document.documentElement.classList.add("has-scroll-reveal");
}

if (!reducedMotion.matches) {
  document.querySelectorAll("a[href]").forEach((link) => {
    const destination = new URL(link.href, window.location.href);
    const isLocalPage =
      destination.origin === window.location.origin &&
      destination.pathname.toLowerCase().endsWith(".html") &&
      destination.pathname !== window.location.pathname;

    if (!isLocalPage || (link.target && link.target !== "_self")) return;

    link.addEventListener("click", (event) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      event.preventDefault();
      document.documentElement.classList.add("page-leaving");
      window.setTimeout(() => window.location.assign(destination.href), 220);
    });
  });
}

if (finePointer.matches && !reducedMotion.matches) {
  const hero = document.querySelector(".hero");
  const heroVisual = document.querySelector(".hero__visual");

  if (hero && heroVisual) {
    let heroBounds;

    hero.addEventListener("pointerenter", () => {
      heroBounds = hero.getBoundingClientRect();
    });
    hero.addEventListener(
      "pointermove",
      (event) => {
        if (!heroBounds) heroBounds = hero.getBoundingClientRect();
        const offsetX = (event.clientX - heroBounds.left) / heroBounds.width - 0.5;
        const offsetY = (event.clientY - heroBounds.top) / heroBounds.height - 0.5;
        heroVisual.style.setProperty("--parallax-x", `${(offsetX * 12).toFixed(2)}px`);
        heroVisual.style.setProperty("--parallax-y", `${(offsetY * 12).toFixed(2)}px`);
      },
      { passive: true },
    );
    hero.addEventListener("pointerleave", () => {
      heroBounds = undefined;
      heroVisual.style.setProperty("--parallax-x", "0px");
      heroVisual.style.setProperty("--parallax-y", "0px");
    });
  }

  document.querySelectorAll(".button--primary").forEach((button) => {
    let buttonBounds;

    button.addEventListener("pointerenter", () => {
      buttonBounds = button.getBoundingClientRect();
    });
    button.addEventListener(
      "pointermove",
      (event) => {
        if (!buttonBounds) buttonBounds = button.getBoundingClientRect();
        const offsetX = event.clientX - (buttonBounds.left + buttonBounds.width / 2);
        const offsetY = event.clientY - (buttonBounds.top + buttonBounds.height / 2);
        button.style.setProperty("--magnet-x", `${(offsetX * 0.08).toFixed(2)}px`);
        button.style.setProperty("--magnet-y", `${(offsetY * 0.08).toFixed(2)}px`);
      },
      { passive: true },
    );
    button.addEventListener("pointerleave", () => {
      buttonBounds = undefined;
      button.style.setProperty("--magnet-x", "0px");
      button.style.setProperty("--magnet-y", "0px");
    });
  });

  document
    .querySelectorAll(
      ".info-card, .objective-card, .timeline-card, .certification-card, .skill-card, .project-card, .contact-card",
    )
    .forEach((card) => {
      let cardBounds;
      card.classList.add("spotlight-card", "tilt-card");

      card.addEventListener("pointerenter", () => {
        cardBounds = card.getBoundingClientRect();
        card.classList.add("is-spotlit");
      });
      card.addEventListener(
        "pointermove",
        (event) => {
          if (!cardBounds) cardBounds = card.getBoundingClientRect();
          const x = event.clientX - cardBounds.left;
          const y = event.clientY - cardBounds.top;
          const rotateX = (0.5 - y / cardBounds.height) * 8;
          const rotateY = (x / cardBounds.width - 0.5) * 8;
          card.style.setProperty("--spotlight-x", `${x.toFixed(1)}px`);
          card.style.setProperty("--spotlight-y", `${y.toFixed(1)}px`);
          card.style.setProperty("--tilt-x", `${rotateX.toFixed(2)}deg`);
          card.style.setProperty("--tilt-y", `${rotateY.toFixed(2)}deg`);
        },
        { passive: true },
      );
      card.addEventListener("pointerleave", () => {
        cardBounds = undefined;
        card.classList.remove("is-spotlit");
        card.style.removeProperty("--spotlight-x");
        card.style.removeProperty("--spotlight-y");
        card.style.removeProperty("--tilt-x");
        card.style.removeProperty("--tilt-y");
      });
    });

  const cursorGlow = document.createElement("div");
  cursorGlow.className = "cursor-glow";
  cursorGlow.setAttribute("aria-hidden", "true");
  document.body.append(cursorGlow);
  let cursorFrame = 0;
  let cursorX = 0;
  let cursorY = 0;

  document.addEventListener(
    "pointermove",
    (event) => {
      cursorX = event.clientX;
      cursorY = event.clientY;
      cursorGlow.classList.add("is-visible");
      if (cursorFrame) return;

      cursorFrame = window.requestAnimationFrame(() => {
        cursorGlow.style.transform = `translate3d(${cursorX - 160}px, ${cursorY - 160}px, 0)`;
        cursorFrame = 0;
      });
    },
    { passive: true },
  );
  window.addEventListener("blur", () => cursorGlow.classList.remove("is-visible"));
}

if ("IntersectionObserver" in window && currentPage === "index.html") {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navigationLinks.forEach((link) => {
          const isCurrent = link.hash === `#${entry.target.id}`;
          link.classList.toggle("is-active", isCurrent);
          if (isCurrent) {
            link.setAttribute("aria-current", "page");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      });
    },
    { rootMargin: "-35% 0px -55% 0px" },
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

if (canvas && !reducedMotion.matches) {
  const context = canvas.getContext("2d");

  if (context) {
    const particles = [];
    const particleCount = 42;
    let width = 0;
    let height = 0;
    let animationFrame = 0;

    function resizeCanvas() {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      particles.length = 0;

      for (let index = 0; index < particleCount; index += 1) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.15 + 0.35,
          speed: Math.random() * 0.16 + 0.035,
          phase: Math.random() * Math.PI * 2,
          tint: "201, 169, 110",
        });
      }
    }

    function drawParticles() {
      context.clearRect(0, 0, width, height);

      particles.forEach((particle) => {
        particle.y -= particle.speed;
        particle.phase += 0.008;
        if (particle.y < -3) {
          particle.y = height + 3;
          particle.x = Math.random() * width;
        }

        const opacity = 0.22 + (Math.sin(particle.phase) + 1) * 0.14;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(${particle.tint}, ${opacity})`;
        context.fill();
      });

      animationFrame = window.requestAnimationFrame(drawParticles);
    }

    resizeCanvas();
    drawParticles();
    window.addEventListener("resize", resizeCanvas, { passive: true });

    reducedMotion.addEventListener("change", (event) => {
      if (event.matches) {
        window.cancelAnimationFrame(animationFrame);
        context.clearRect(0, 0, width, height);
      } else {
        resizeCanvas();
        drawParticles();
      }
    });
  }
}
