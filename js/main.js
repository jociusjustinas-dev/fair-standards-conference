document.addEventListener("DOMContentLoaded", function () {
  var header = document.querySelector("[data-header-part]");
  var btn = header && header.querySelector("[data-mobile-nav-toggle]");
  var nav = header && header.querySelector("[data-mobile-nav]");
  var inner = nav ? nav.querySelector("div") : null;
  var hero = document.querySelector("[data-section='heroComponent']");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (header) {
    function closeNav() {
      if (!nav || !btn) return;
      nav.style.maxHeight = "0px";
      nav.classList.add("opacity-0");
      nav.classList.remove("opacity-100");
      btn.setAttribute("aria-expanded", "false");
      header.setAttribute("data-mobile-nav-open", "0");
    }

    function openNav() {
      if (!nav || !btn) return;
      nav.classList.remove("opacity-0");
      nav.classList.add("opacity-100");
      nav.style.maxHeight = (inner ? inner.scrollHeight : nav.scrollHeight) + "px";
      btn.setAttribute("aria-expanded", "true");
      header.setAttribute("data-mobile-nav-open", "1");
    }

    if (btn && nav) {
      btn.addEventListener("click", function () {
        if (btn.getAttribute("aria-expanded") === "true") closeNav();
        else openNav();
      });
      nav.addEventListener("click", function (e) {
        if (e.target.closest("a")) closeNav();
      });
      window.addEventListener("resize", function () {
        if (window.matchMedia("(min-width: 1024px)").matches) {
          closeNav();
          return;
        }
        if (btn.getAttribute("aria-expanded") === "true") openNav();
      });
      closeNav();
    }

    function updateContrast() {
      if (header.getAttribute("data-mobile-nav-open") === "1") return;
      var y = Math.min(80, header.getBoundingClientRect().bottom || 72);
      var tone = "dark";
      document.querySelectorAll("[data-header-tone]").forEach(function (section) {
        var r = section.getBoundingClientRect();
        if (r.top <= y && r.bottom > y) tone = section.getAttribute("data-header-tone");
      });
      header.setAttribute("data-contrast", tone);
    }

    window.addEventListener("scroll", updateContrast, { passive: true });
    window.addEventListener("resize", updateContrast);
    updateContrast();
  }

  (function initPanelTabs() {
    document.querySelectorAll("[data-panel-tabs]").forEach(function (root) {
      var tabs = Array.from(root.querySelectorAll('[role="tab"]'));
      var panes = Array.from(root.querySelectorAll('[role="tabpanel"]'));
      if (!tabs.length) return;

      function activate(index) {
        tabs.forEach(function (tab, i) {
          var on = i === index;
          tab.classList.toggle("is-active", on);
          tab.setAttribute("aria-selected", on ? "true" : "false");
          tab.tabIndex = on ? 0 : -1;
        });
        panes.forEach(function (pane, i) {
          pane.hidden = i !== index;
        });
      }

      document.querySelectorAll("[data-open-panel]").forEach(function (link) {
        link.addEventListener("click", function () {
          var index = Number(link.getAttribute("data-open-panel"));
          if (!Number.isFinite(index)) return;
          activate(index);
        });
      });

      tabs.forEach(function (tab, index) {
        tab.addEventListener("click", function () {
          activate(index);
        });
        tab.addEventListener("keydown", function (e) {
          var next = index;
          if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (index + 1) % tabs.length;
          else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (index - 1 + tabs.length) % tabs.length;
          else if (e.key === "Home") next = 0;
          else if (e.key === "End") next = tabs.length - 1;
          else return;
          e.preventDefault();
          activate(next);
          tabs[next].focus();
        });
      });

      activate(0);
    });
  })();


  (function initFadeIn() {
    var els = Array.from(document.querySelectorAll('[data-animation="fade-in"], [data-animation="fade-in-no-y"]'));
    if (!els.length) return;

    function attr(el, name) {
      return el.getAttribute(name) || el.getAttribute("data-" + name);
    }

    function parseTime(value, fallback) {
      if (value == null || value === "") return fallback;
      var s = String(value).trim();
      if (s.endsWith("ms")) return parseFloat(s) || fallback;
      if (s.endsWith("s")) return parseFloat(s) * 1000 || fallback;
      var n = parseFloat(s);
      return Number.isFinite(n) ? n : fallback;
    }

    function bounceEase(amount) {
      var a = Math.max(0, Math.min(1, Number(amount) || 0));
      return "cubic-bezier(0.34, " + (1 + a).toFixed(3) + ", 0.64, 1)";
    }

    function isStagger(el) {
      return el.getAttribute("data-animation") === "fade-in" &&
        (el.hasAttribute("stagger") || el.hasAttribute("data-stagger"));
    }

    function staggerItems(el) {
      var items = el.querySelectorAll("[data-animation-item]");
      return items.length ? Array.from(items) : Array.from(el.children);
    }

    var staggerMap = new Map();
    els.forEach(function (el) {
      if (!isStagger(el)) return;
      var items = staggerItems(el);
      if (!reduceMotion) {
        items.forEach(function (item) {
          item.style.opacity = "0";
          item.style.transform = "translateY(16px)";
          item.style.willChange = "opacity, transform";
        });
      }
      staggerMap.set(el, items);
    });

    function play(el) {
      if (el.dataset.animated === "true") return;
      el.dataset.animated = "true";
      el.classList.add("is-inview");
      if (!isStagger(el)) return;

      var items = staggerMap.get(el) || staggerItems(el);
      if (reduceMotion) {
        items.forEach(function (item) {
          item.style.opacity = "";
          item.style.transform = "";
          item.style.willChange = "";
        });
        return;
      }

      var duration = parseTime(attr(el, "time"), 2400);
      var delay = parseTime(attr(el, "delay"), 100);
      var stagger = parseTime(attr(el, "stagger"), 100);
      var easing = bounceEase(attr(el, "bounce") || "0.1");

      items.forEach(function (item, i) {
        if (!item.animate) {
          item.style.opacity = "";
          item.style.transform = "";
          item.style.willChange = "";
          return;
        }
        var anim = item.animate(
          [
            { opacity: 0, transform: "translateY(16px)" },
            { opacity: 1, transform: "translateY(0px)" }
          ],
          { duration: duration, delay: delay + i * stagger, easing: easing, fill: "forwards" }
        );
        anim.onfinish = function () {
          item.style.opacity = "";
          item.style.transform = "";
          item.style.willChange = "";
        };
      });
    }

    if (reduceMotion || !("IntersectionObserver" in window)) {
      els.forEach(play);
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          play(entry.target);
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    els.forEach(function (el) {
      io.observe(el);
    });
  })();

  (function initParallax() {
    if (reduceMotion || !hero || hero.getAttribute("data-animation") !== "parallax") return;
    var speed = Number(hero.getAttribute("data-parallax-speed") || 0.25);
    var max = Number(hero.getAttribute("data-parallax-max") || 260);
    var mobileOff = hero.getAttribute("data-parallax-mobile") === "off";
    hero.style.willChange = "transform";
    var frame = 0;
    function tick() {
      if (mobileOff && window.innerWidth <= 1023) {
        hero.style.transform = "";
        return;
      }
      var y = Math.min(max, Math.max(0, (window.scrollY || 0) * speed));
      hero.style.transform = "translate3d(0, " + y + "px, 0)";
    }
    function onScroll() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(tick);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    tick();
  })();
});
