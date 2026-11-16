// Upit za ponudu u 6 koraka: jedno pitanje po koraku, klik na odgovor vodi dalje, sažetak i kontakt na kraju.
(function () {
  var form = document.getElementById('upit');
  if (!form) return;

  var CARDS = "<button type=\"button\" class=\"an-t an-card\" data-type=\"pres\"><svg class=\"ic\" viewBox=\"0 0 48 48\" aria-hidden=\"true\"><rect x=\"6\" y=\"10\" width=\"36\" height=\"28\" rx=\"1\"></rect><path d=\"M6 17h36M6 24h36M6 31h36\"></path><path d=\"M13 10v28M20 10v28M27 10v28M34 10v28\" stroke-width=\"2.4\"></path></svg><span>Presovano gazište</span></button><button type=\"button\" class=\"an-t an-card\" data-type=\"sp\"><svg class=\"ic\" viewBox=\"0 0 48 48\" aria-hidden=\"true\"><rect x=\"6\" y=\"10\" width=\"36\" height=\"28\" rx=\"1\"></rect><path d=\"M14 10v28M24 10v28M34 10v28\" stroke-width=\"2.4\"></path><path d=\"M6 19l2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2M6 30l2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2\"></path></svg><span>SP gazište</span></button><button type=\"button\" class=\"an-t an-card\" data-type=\"step\"><svg class=\"ic\" viewBox=\"0 0 48 48\" aria-hidden=\"true\"><path d=\"M6 40h8v-8h8v-8h8v-8h8V8h4\"></path><path d=\"M14 40V32M22 32v-8M30 24v-8M38 16V8\"></path><path d=\"M6 40h36\"></path></svg><span>Stepenišno gazište</span></button><button type=\"button\" class=\"an-t an-card\" data-type=\"pk\"><svg class=\"ic\" viewBox=\"0 0 48 48\" aria-hidden=\"true\"><path d=\"M6 38h36\"></path><path d=\"M10 38V16l2 2 2-2 2 2v20M22 38V16l2 2 2-2 2 2v20M34 38V16l2 2 2-2 2 2v20\"></path></svg><span>Protivklizno</span></button><button type=\"button\" class=\"an-t an-card\" data-type=\"puno\"><svg class=\"ic\" viewBox=\"0 0 48 48\" aria-hidden=\"true\"><rect x=\"6\" y=\"10\" width=\"36\" height=\"28\" rx=\"1\"></rect><path d=\"M15 10v28M24 10v28M33 10v28M6 19.3h36M6 28.6h36\" stroke-width=\"2.4\"></path></svg><span>Puno gazište</span></button><button type=\"button\" class=\"an-t an-card\" data-type=\"traka\"><svg class=\"ic\" viewBox=\"0 0 48 48\" aria-hidden=\"true\"><rect x=\"4\" y=\"18\" width=\"40\" height=\"12\" rx=\"1.5\"></rect><path d=\"M9 26l3-4M15 26l3-4M21 26l3-4M27 26l3-4M33 26l3-4M39 26l2-3\"></path><path d=\"M10 36h28M14 33v6M34 33v6\" stroke-width=\"1\"></path></svg><span>Protivklizna traka</span></button><button type=\"button\" class=\"an-t an-wide\" data-type=\"drugo\"><svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M12 5v14M5 12h14\"></path></svg><span>Nešto drugo</span><svg class=\"ar\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M7 17 17 7M8 7h9v9\"></path></svg></button>";
  var ARROW = '<svg class="ar" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"></path></svg>';
  var PLUS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg>';

  var TYPES = {
    pres: { label: 'Presovano gazište', okca: [['33 × 33 mm', 'najčešće okce'], ['33 × 11 mm', '']], mere: [['995 × 195 mm', 'standard za prelaz vozila'], ['995 × 245 mm', 'standard za prelaz vozila'], ['995 × 295 mm', 'standard za prelaz vozila']] },
    sp: { label: 'SP gazište', okca: [['34 × 38 mm', 'svetlo okce 30 × 30 mm']], mere: [], m2L: 'Mera 2, stabilizator' },
    step: { label: 'Stepenišno gazište', okca: [['34 × 38 mm', 'svetlo okce 30 × 30 mm']], mere: [], m1L: 'Širina stepenika', m2L: 'Dubina stepenika' },
    pk: { label: 'Protivklizno gazište', okca: [['34 × 38 mm', 'nazubljena lamela, svetlo okce 30 × 30 mm']], mere: [], m2L: 'Mera 2, stabilizator' },
    puno: { label: 'Puno gazište', okca: [['Po dogovoru', 'lamele i stabilizatori iste debljine i visine']], mere: [], m2L: 'Mera 2, stabilizator' },
    traka: { label: 'Protivklizna traka', mere: [], m1L: 'Širina trake', m2L: 'Dužina trake',
      step3: { key: 'okce', label: 'Namena', q: 'Gde postavljate traku?', opts: [['Na stepenice', ''], ['Na rampu ili prilaz', ''], ['Na platformu ili pod', ''], ['Negde drugde', 'opišite na kraju']] } },
    drugo: { label: 'Nešto drugo', okca: [['Po dogovoru', '']], mere: [] }
  };
  function blank() { return { step: 1, type: '', mere: '', okce: '', kol: '', obrada: '', m1: '', m2: '', ime: '', tel: '', mail: '', poruka: '', err: '' }; }
  var s = blank();

  function steps(t) {
    return {
      2: { key: 'mere', q: 'Koje mere vam trebaju?', opts: t.mere.concat([['Po mojoj meri', 'mere upisujete na kraju'], ['Imam crtež', 'pošaljite ga na office@md.co.rs'], ['Još ne znam mere', 'dogovaramo se telefonom']]) },
      3: t.step3 || { key: 'okce', label: 'Okce', q: 'Koje okce vam treba?', opts: t.okca.concat([['Savetujte me', '']]) },
      4: { key: 'kol', q: 'Koliko komada vam treba?', opts: [['Do 10 komada', ''], ['10 do 50 komada', ''], ['50 do 200 komada', ''], ['Više od 200 komada', '']] },
      5: { key: 'obrada', q: 'Kakva obrada vam treba?', opts: [['Toplo cinkovano, sa veznim elementima', 'vijak M8×60, matica, leptirić'], ['Samo toplo cinkovano', 'EN ISO 1461'], ['Bez cinkovanja', ''], ['Savetujte me', '']] }
    };
  }
  function esc(v) { return String(v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  function render(focusQ) {
    var t = TYPES[s.type], cur = t ? steps(t)[s.step] : null, h = '<h3 class="an-title">Upit za ponudu</h3>';
    if (s.step < 7) h += '<div class="an-h"><div class="an-pg" aria-hidden="true"><i style="width:' + Math.round(s.step / 6 * 100) + '%"></i></div><p class="an-st">Korak ' + s.step + ' od 6</p></div>';
    if (s.step === 1) {
      h += '<div class="an-step"><p class="an-q" tabindex="-1">Šta vam treba?</p><div class="an-l cards1">' +
        CARDS.replace(/data-type="(\w+)"/g, function (m, id) { return m + (s.type === id ? ' aria-pressed="true"' : ''); })
             .replace(/class="an-t (an-card|an-wide)" data-type="(\w+)"/g, function (m, k, id) { return 'class="an-t ' + k + (s.type === id ? ' sel' : '') + '" data-type="' + id + '"'; }) +
        '</div></div>';
    } else if (cur) {
      h += '<div class="an-step"><p class="an-q" tabindex="-1">' + cur.q + '</p><div class="an-l">' + cur.opts.map(function (o, i) {
        var on = s[cur.key] === o[0];
        return '<button type="button" class="an-t' + (on ? ' sel' : '') + '" data-opt="' + i + '" aria-pressed="' + on + '"><span>' + o[0] + '<small>' + o[1] + '</small></span>' + ARROW + '</button>';
      }).join('') + '</div></div>';
    } else if (s.step === 6) {
      var mere = s.mere === 'Po mojoj meri' && s.m1 && s.m2 ? s.m1 + ' × ' + s.m2 + ' mm' : s.mere;
      var row = function (k, v) { return '<div><dt>' + k + '</dt><dd>' + esc(v) + '</dd></div>'; };
      var f = function (lbl, name, extra) { return '<label>' + lbl + '<input class="field" name="' + name + '" value="' + esc(s[name]) + '" ' + extra + '></label>'; };
      h += '<div class="an-step"><p class="an-q" tabindex="-1">Proverite upit i ostavite kontakt</p><dl class="an-sum">' +
        row('Proizvod', t.label) + row('Mere', mere) + row(steps(t)[3].label, s.okce) + row('Količina', s.kol) + row('Obrada', s.obrada) +
        '</dl><div class="an-c">' +
        (s.mere === 'Po mojoj meri' ? '<div class="row2">' + f((t.m1L || 'Mera 1, noseća lamela') + ' (mm)', 'm1', 'inputmode="numeric" placeholder="npr. 995"') + f((t.m2L || 'Mera 2, podužna traka') + ' (mm)', 'm2', 'inputmode="numeric" placeholder="npr. 245"') + '</div>' : '') +
        f('Ime i firma', 'ime', 'autocomplete="organization" placeholder="Marko Marković, Firma doo"') +
        f('Telefon', 'tel', 'type="tel" inputmode="tel" autocomplete="tel" placeholder="063 123 4567"') +
        f('E-pošta <span>(nije obavezno)</span>', 'mail', 'type="email" autocomplete="email" placeholder="ime@firma.rs"') +
        '<label>Dodatni opis <span>(nije obavezno)</span><textarea class="field" name="poruka" rows="2" placeholder="Mesto ugradnje, rok, crtež šaljem mejlom...">' + esc(s.poruka) + '</textarea></label>' +
        (s.err ? '<p class="err" role="alert">' + s.err + '</p>' : '') +
        '<button type="submit" class="btn">Pošaljite upit</button><p class="note">Podatke koristimo samo da vam odgovorimo na upit.</p></div></div>';
    } else {
      h += '<div class="done" role="status"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m7 12 3.5 3.5L17 9"></path></svg>' +
        '<p class="an-q" tabindex="-1">Hvala, upit je spreman</p><p>Javićemo vam se na ' + esc(s.tel) + '. Ako imate crtež, pošaljite ga na office@md.co.rs. <span class="ex">[PRIMER] Slanje upita treba povezati sa e-poštom ili Formspree.</span></p></div>';
    }
    if (s.step > 1) h += '<div class="an-bks">' + (s.step < 7 ? '<button type="button" class="an-bk" data-act="back">← Nazad</button>' : '') +
      '<button type="button" class="an-bk" data-act="reset">' + (s.step === 7 ? '↺ Pošaljite novi upit' : '↺ Počni ispočetka') + '</button></div>';
    form.innerHTML = h;
    if (focusQ) { var q = form.querySelector('.an-q'); if (q) q.focus(); }
  }

  form.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b || b.type === 'submit') return;
    if (b.dataset.type) { var id = b.dataset.type; s = id === s.type ? Object.assign(s, { step: 2 }) : Object.assign(s, { type: id, mere: '', okce: '', step: 2, err: '' }); }
    else if (b.dataset.opt) { var cur = steps(TYPES[s.type])[s.step]; s[cur.key] = cur.opts[+b.dataset.opt][0]; s.step++; s.err = ''; }
    else if (b.dataset.act === 'back') { s.step--; s.err = ''; }
    else if (b.dataset.act === 'reset') { s = blank(); }
    else return;
    render(true);
  });
  form.addEventListener('input', function (e) { if (e.target.name) s[e.target.name] = e.target.value; });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (s.step !== 6) return;
    if (s.ime.trim().length < 2) s.err = 'Upišite ime i firmu.';
    else if (s.tel.replace(/\D/g, '').length < 6) s.err = 'Upišite broj telefona da bismo vas pozvali.';
    else { s.err = ''; s.step = 7; }
    render(true);
  });
  render(false);
})();
