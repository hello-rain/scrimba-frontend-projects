// Utility: Toggle visibility between sections
function toggleViews(hideEls, showEl) {
  const hideViews = Array.isArray(hideEls) ? hideEls : [hideEls];
  const showView = document.querySelector(showEl);

  if (!hideViews || !showView) {
    console.error("One or both elements not found:", hideEls, showEl);
    return;
  }

  hideViews.forEach((hideEl) => {
    const el = document.querySelector(hideEl);
    if (!el.classList.contains("visually-hidden")) {
      el.classList.add("visually-hidden");
      el.setAttribute("aria-hidden", "true");
    }
  });

  showView.classList.remove("visually-hidden");
  showView.setAttribute("aria-hidden", "false");
  showView.focus();
}

// Init function to add event listeners
function initViewToggle() {
  const viewFeatured = document.querySelector('[data-section="featured"]');
  const navAbout = document.querySelector('[data-nav="about"]');

  viewFeatured.addEventListener("click", () =>
    toggleViews('[data-section="featured"]', '[data-section="detail"]')
  );

  navAbout.addEventListener("click", () =>
    toggleViews(
      ['[data-section="featured"]', '[data-section="detail"]'],
      '[data-page="about"]'
    )
  );
}

initViewToggle();
