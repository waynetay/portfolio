document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.querySelector(".projects-scroll");
  if (!gallery) return;

  document.querySelectorAll("[data-projects-direction]").forEach((button) => {
    button.addEventListener("click", () => {
      const direction = Number(button.dataset.projectsDirection) || 1;
      const card = gallery.querySelector(".project-card");
      const gap = 18;
      const distance = card ? card.getBoundingClientRect().width + gap : gallery.clientWidth * 0.8;
      gallery.scrollBy({ left: direction * distance, behavior: "smooth" });
    });
  });
});
