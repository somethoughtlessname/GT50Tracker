// === shell/splash.js ===
// The Joystick Journal splash: THE / JOYSTICK / JOURNAL on dark navy, a blue rule,
// LOADING and three bars that fill. Tap to skip. Plays once per launch.
// Optional: delete this file (and its <script> tag) and the app opens straight to MAIN.
(function () {
  'use strict';
  try {
    if (sessionStorage.getItem('jj-splash-shown')) return;
    sessionStorage.setItem('jj-splash-shown', '1');
  } catch (e) {}

  // App palette (shell/styles.js): cream, ink, taupe, walnut, brick, olive, navy, plum
  const C = {
    bg1: '#efeadf', bg2: '#e0d7c4',
    the: '#8a8378', joyA: '#9a3b36', joyB: '#622622', journal: '#2b2620',
    rule: '#7a2f2b', loading: '#6b4a32', track: 'rgba(43,38,32,.10)',
    bars: [['#5b6633', '#7a8748'], ['#303d66', '#4d5d91'], ['#66304c', '#8c4f66']]
  };
  const quick = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const serif = "'JJ Playfair', Georgia, 'Noto Serif', serif";   // Playfair Display: J drops below the line

  const css = `
  @font-face{font-family:'JJ Playfair';font-weight:700;font-display:block;src:url('fonts/playfair-display-latin-700-normal.woff2') format('woff2')}
  #jj-splash{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;
    background:radial-gradient(ellipse 90% 60% at 70% 30%,${C.bg2} 0%,transparent 70%),
               radial-gradient(ellipse 80% 50% at 20% 75%,${C.bg2} 0%,transparent 70%),${C.bg1};
    overflow:hidden;transition:opacity .45s ease;cursor:pointer;-webkit-user-select:none;user-select:none}
  #jj-splash.out{opacity:0}
  .jj-wrap{width:min(88vw,460px);text-align:center;font-family:${serif};font-weight:700}
  .jj-the{font-size:clamp(1.1rem,5.2vw,1.7rem);line-height:1;margin-bottom:-.1em;letter-spacing:.18em;padding-left:.18em;color:${C.the};
    opacity:0;transform:translateY(-10px);transition:opacity .5s ease,transform .5s ease}
  .jj-joy{display:inline-block;font-size:clamp(2.6rem,17vw,5.8rem);line-height:1;
    padding:0 .06em .3em;margin:0 0 -.5em;white-space:nowrap;
    opacity:0;transform:scale(.92);transition:opacity .6s ease,transform .6s cubic-bezier(.2,1.3,.4,1)}
  .jj-joy span{display:inline-block;-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent}
  .jj-joy .jj-rest{background-image:linear-gradient(90deg,${C.joyA},${C.joyB})}
  .jj-jou{font-size:clamp(2rem,13vw,4.4rem);line-height:1;padding-bottom:.3em;letter-spacing:.08em;padding-left:.08em;color:${C.journal};
    opacity:0;transform:translateY(10px);transition:opacity .5s ease,transform .5s ease}
  .jj-J{display:inline-block;transform:scaleY(1.28);transform-origin:50% 18%}
  .jj-joy .jj-J{transform-origin:50% 13%;padding:0 0 .45em .12em;margin:0 0 -.45em -.12em;background-color:${C.joyA}}
  .jj-on{opacity:1!important;transform:none!important}
  .jj-rule{height:2px;margin:.6rem auto 1.4rem;width:0;
    background:linear-gradient(90deg,transparent,${C.rule},transparent);transition:width .7s ease}
  .jj-rule.jj-on{width:100%}
  .jj-load{font-size:clamp(.9rem,4vw,1.15rem);letter-spacing:.22em;padding-left:.22em;color:${C.loading};
    margin-bottom:1rem;opacity:0;transition:opacity .4s ease}
  .jj-bars{width:86%;margin:0 auto}
  .jj-track{height:10px;border-radius:5px;background:${C.track};margin:0 0 9px;overflow:hidden}
  .jj-fill{height:100%;width:0;border-radius:5px;transition:width .9s cubic-bezier(.3,.7,.3,1)}`;

  const style = document.createElement('style');
  style.textContent = css;
  const el = document.createElement('div');
  el.id = 'jj-splash';
  el.setAttribute('role', 'presentation');
  el.innerHTML = `<div class="jj-wrap">
      <div class="jj-the">THE</div>
      <div class="jj-joy"><span class="jj-J">J</span><span class="jj-rest">OYSTICK</span></div>
      <div class="jj-jou"><span class="jj-J">J</span>OURNAL</div>
      <div class="jj-rule"></div>
      <div class="jj-load">LOADING</div>
      <div class="jj-bars">${C.bars.map(([a, b]) =>
        `<div class="jj-track"><div class="jj-fill" style="background:linear-gradient(90deg,${a},${b})"></div></div>`).join('')}</div>
    </div>`;

  const timers = [];
  const at = (ms, fn) => timers.push(setTimeout(fn, quick ? 0 : ms));
  let gone = false;

  function finish() {
    if (gone) return;
    gone = true;
    timers.forEach(clearTimeout);
    el.classList.add('out');
    setTimeout(() => { el.remove(); style.remove(); }, 480);
  }

  function run() {
    el.addEventListener('click', finish);
    const q = s => el.querySelector(s);
    const go = () => {
    at(100, () => q('.jj-the').classList.add('jj-on'));
    at(350, () => q('.jj-joy').classList.add('jj-on'));
    at(700, () => q('.jj-jou').classList.add('jj-on'));
    at(1050, () => q('.jj-rule').classList.add('jj-on'));
    at(1300, () => q('.jj-load').classList.add('jj-on'));
    el.querySelectorAll('.jj-fill').forEach((f, i) => at(1450 + i * 250, () => { f.style.width = '100%'; }));
    timers.push(setTimeout(finish, quick ? 900 : 3300));
    };
    const f = document.fonts && document.fonts.load ? document.fonts.load("700 40px 'JJ Playfair'") : null;
    let started = false; const once = () => { if (!started) { started = true; go(); } };
    if (f) { f.then(once, once); setTimeout(once, 600); } else once();
  }

  const mount = () => { document.head.appendChild(style); document.body.appendChild(el); run(); };
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
})();
