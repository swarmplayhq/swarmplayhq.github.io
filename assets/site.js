// SwarmPlay's website: theme switch, install tabs, Copy, screenshots full size, the latest
// version from GitHub, and things easing in as they scroll into view. The page works without it.
(function () {
  "use strict";
  var root = document.documentElement;
  root.classList.add("js");

  // Theme: dark unless the visitor picked light (kept in localStorage when it can be).
  var toggle = document.querySelector("[data-theme-toggle]");
  function label() {
    var light = root.dataset.theme === "light";
    toggle.setAttribute("aria-label", light ? "Switch to dark theme" : "Switch to light theme");
  }
  if (toggle) {
    label();
    toggle.addEventListener("click", function () {
      var next = root.dataset.theme === "light" ? "dark" : "light";
      root.dataset.theme = next;
      try { localStorage.setItem("theme", next); } catch (e) {}
      label();
    });
  }

  // The header gets a backdrop once the page moves.
  var top = document.querySelector("[data-top]");
  function onScroll() { top.classList.toggle("scrolled", window.scrollY > 8); }
  if (top) { onScroll(); window.addEventListener("scroll", onScroll, { passive: true }); }

  // Install tabs (arrow keys move between them, as in a tab list).
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
  function select(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () { select(tab); });
    tab.addEventListener("keydown", function (e) {
      var step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!step) return;
      var next = tabs[(i + step + tabs.length) % tabs.length];
      select(next);
      next.focus();
      e.preventDefault();
    });
  });

  // Copy the install command.
  var copy = document.querySelector("[data-copy]");
  var command = document.querySelector("[data-command]");
  if (copy && command) {
    copy.addEventListener("click", function () {
      var text = command.textContent;
      var done = function () {
        copy.textContent = "Copied";
        copy.classList.add("done");
        setTimeout(function () { copy.textContent = "Copy"; copy.classList.remove("done"); }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, selectCommand);
      } else {
        selectCommand();
      }
    });
  }
  function selectCommand() {
    var range = document.createRange();
    range.selectNodeContents(command);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  // Screenshots full size.
  var dialog = document.querySelector("[data-zoom-dialog]");
  if (dialog && typeof dialog.showModal === "function") {
    var big = dialog.querySelector("img");
    document.querySelectorAll("[data-zoom]").forEach(function (button) {
      button.addEventListener("click", function () {
        var img = button.querySelector("img");
        big.src = img.currentSrc || img.src;
        big.alt = img.alt;
        dialog.showModal();
      });
    });
    dialog.querySelector("[data-zoom-close]").addEventListener("click", function () { dialog.close(); });
    dialog.addEventListener("click", function (e) { if (e.target === dialog || e.target === big) dialog.close(); });
  } else {
    document.querySelectorAll("[data-zoom]").forEach(function (b) { b.style.cursor = "default"; });
  }

  // The latest version (the page already says the last one known).
  fetch("https://api.github.com/repos/swarmplayhq/swarmplay/releases/latest", { headers: { Accept: "application/vnd.github+json" } })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (release) {
      var tag = release && release.tag_name && release.tag_name.replace(/^v/, "");
      if (!tag || !/^\d+\.\d+\.\d+$/.test(tag)) return;
      document.querySelectorAll("[data-version]").forEach(function (el) { el.textContent = tag; });
    })
    .catch(function () {});

  // Ease things in as they come into view.
  var items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("in"); });
    return;
  }
  var seen = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        seen.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -40px 0px", threshold: 0.08 });
  items.forEach(function (el) { seen.observe(el); });
})();
