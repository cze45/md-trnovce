// Meni za telefon (hamburger) i mapa sa pinom MD.
(function () {
  // --- zaglavlje: providno na vrhu strane, sa pozadinom posle skrola (radi i u WebKit-u na iOS-u)
  var hdr = document.querySelector('.hdr'), btn = document.querySelector('.burger'), panel = document.getElementById('mnav');
  if (hdr) {
    hdr.classList.add('js');
    var onScroll = function () { hdr.classList.toggle('solid', window.scrollY > 40); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
  // --- hamburger meni
  if (btn && panel) {
    var closeTimer;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    var setOpen = function (open) {
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Zatvori meni' : 'Otvori meni');
      hdr.classList.toggle('open', open);
      clearTimeout(closeTimer);
      if (open) {
        panel.hidden = false;
        void panel.offsetWidth; // da animacija krene od zatvorenog stanja
        panel.classList.add('show');
      } else {
        panel.classList.remove('show');
        // sakrij tek kad se animacija zatvaranja završi (tada linkovi nisu dostupni tastaturi)
        closeTimer = setTimeout(function () { panel.hidden = true; }, reduce.matches ? 0 : 420);
      }
    };
    btn.addEventListener('click', function () { setOpen(btn.getAttribute('aria-expanded') !== 'true'); });
    panel.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) { setOpen(false); btn.focus(); } });
    window.matchMedia('(min-width: 768px)').addEventListener('change', function (m) { if (m.matches) setOpen(false); });
  }

  // --- tačke ispod reda sa radovima: pokazuju koja je slika na ekranu, klik vodi na nju
  var grid = document.querySelector('.fbgrid'), dots = document.querySelector('.dots');
  if (grid && dots) {
    var tiles = [].slice.call(grid.querySelectorAll('.tile'));
    // tačke su već u HTML-u (vide se i pre nego što se skript učita); ovde dobijaju klik
    [].forEach.call(dots.children, function (d, i) {
      var t = tiles[i]; if (!t) return;
      d.addEventListener('click', function () {
        grid.scrollTo({ left: t.offsetLeft - (grid.clientWidth - t.offsetWidth) / 2, behavior: 'smooth' });
      });
    });
    var mark = function () {
      var mid = grid.scrollLeft + grid.clientWidth / 2, best = 0, bestD = Infinity;
      tiles.forEach(function (t, i) { var d = Math.abs(t.offsetLeft + t.offsetWidth / 2 - mid); if (d < bestD) { bestD = d; best = i; } });
      [].forEach.call(dots.children, function (d, i) { d.setAttribute('aria-current', String(i === best)); });
    };
    grid.addEventListener('scroll', mark, { passive: true });
    window.addEventListener('resize', mark);
    mark();
  }

  // --- mapa: Vojvode Stepe 20, Trnovče (koordinate iz OpenStreetMap)
  var el = document.getElementById('mapa');
  if (!el || !window.L) return;
  var pos = [44.431106, 21.376676];
  var map = L.map(el, { center: pos, zoom: 14, scrollWheelZoom: false, dragging: !L.Browser.mobile, tap: false, attributionControl: true });
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  var icon = L.divIcon({ className: 'md-pin', html: '<div class="pin"><img src="images/md-logo.png" alt=""></div>', iconSize: [64, 64], iconAnchor: [32, 77], popupAnchor: [0, -70] });
  L.marker(pos, { icon: icon, title: 'MD szmr Trnovče', alt: 'MD szmr Trnovče, Vojvode Stepe 20' }).addTo(map)
    .bindPopup('<b>MD szmr Trnovče</b><br>Vojvode Stepe 20, 12315 Trnovče');
})();
