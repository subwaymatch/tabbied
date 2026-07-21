// Tiny runtime for the static-HTML sample sites. The vendored css-doodle
// element renders whatever grid it is told; on its own, a fixed grid stretches
// its cells to fill a non-square box. This script gives each decorative doodle
// a grid whose cell count matches its box, so cells stay square (a "cover" fit
// with no stretching), and optionally re-seeds it on an interval so the drawing
// shuffles over time.
//
// Markup contract (emitted by samples/lib/tabbied-embed.mjs):
//   <css-doodle data-tabbied use="var(--rule)" grid="8x8"
//               data-cell="48" data-reseed="4200"> ... </css-doodle>
// where data-cell is the target cell size in px and data-reseed (optional) is
// the shuffle interval in ms. The doodle's parent element is the sized box.
(function () {
  var reduceMotion =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function randomSeed() {
    var s = '';
    var alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    for (var i = 0; i < 5; i++) {
      s += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return s;
  }

  // Choose cols x rows for a box so each cell is close to `cell` px and square.
  function gridFor(w, h, cell) {
    var cols = Math.max(1, Math.round(w / cell));
    var rows = Math.max(1, Math.round(h / cell));
    return cols + 'x' + rows;
  }

  function setup(el) {
    if (el.__tabbiedReady) return;
    el.__tabbiedReady = true;

    var box = el.parentElement || el;
    var cell = parseInt(el.getAttribute('data-cell') || '48', 10);
    var reseed = parseInt(el.getAttribute('data-reseed') || '0', 10);

    // Fresh random arrangement on every page load for decorative doodles.
    if (reseed > 0) el.setAttribute('seed', randomSeed());

    var current = '';
    function fit() {
      var rect = box.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      var g = gridFor(rect.width, rect.height, cell);
      if (g !== current) {
        current = g;
        el.setAttribute('grid', g);
      }
    }

    fit();
    if (typeof ResizeObserver !== 'undefined') {
      var ro = new ResizeObserver(fit);
      ro.observe(box);
    } else {
      window.addEventListener('resize', fit);
    }

    if (reseed > 0 && !reduceMotion) {
      var visible = true;
      if (typeof IntersectionObserver !== 'undefined') {
        var io = new IntersectionObserver(function (entries) {
          visible = entries[0].isIntersecting;
        });
        io.observe(box);
      }
      setInterval(function () {
        if (visible && !document.hidden) el.setAttribute('seed', randomSeed());
      }, reseed);
    }
  }

  function run() {
    var nodes = document.querySelectorAll('css-doodle[data-tabbied]');
    for (var i = 0; i < nodes.length; i++) setup(nodes[i]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
