(() => {
  const decks = Array.from(document.querySelectorAll("[data-horizontal-deck]"));
  if (!decks.length) return;

  const updateDeck = (deck) => {
    const track = deck.querySelector(".horizontal-deck-track");
    const cards = Array.from(deck.querySelectorAll(".horizontal-deck-card"));
    const counter = deck.querySelector(".deck-counter");
    const progressBar = deck.querySelector(".deck-progress span");
    if (!track || !cards.length) return;

    const maxScroll = Math.max(1, deck.offsetHeight - window.innerHeight);
    const rect = deck.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, -rect.top / maxScroll));
    const index = Math.min(cards.length - 1, Math.round(progress * (cards.length - 1)));

    track.style.transform = `translate3d(${-progress * (cards.length - 1) * 100}%, 0, 0)`;
    if (counter) counter.textContent = `${String(index + 1).padStart(2, "0")} / ${String(cards.length).padStart(2, "0")}`;
    if (progressBar) progressBar.style.transform = `scaleX(${Math.max(0.04, progress)})`;
  };

  let queued = false;
  const updateAll = () => {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(() => {
      decks.forEach(updateDeck);
      queued = false;
    });
  };

  window.addEventListener("scroll", updateAll, { passive: true });
  window.addEventListener("resize", updateAll);
  window.addEventListener("load", updateAll);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(updateAll);
  updateAll();
})();
