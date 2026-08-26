/* ==========================================================================
   Shehan Sandaruwan — Custom Engineered Professional Portfolio JS
   Visible Animated Wave Canvas • Horizontal Roadmap Track • Dark / Light Mode Toggle
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initFluidMeshCanvas();
  initFast3DTiltAndSpotlight();
  initScrollProgressBar();
  initPinnedHeader();
  initDarkLightToggle();
  initMobileNav();
  initHorizontalRoadmap();
  initTextAnimations();
  initTyping();
  initTerminal();
  initScrollReveal();
  initSkillBars();
  initCounters();
  initProjectFilters();
  initLightbox();
  initSoundBtn();
  initYouTubePlayer();
});

/* ==========================================================================
   1. VISIBLE CUSTOM GLOWING POINTER (NO OS ARROW CURSOR)
   ========================================================================== */
function initCursor() {
  if (window.innerWidth <= 768) return;

  const ring = document.createElement('div');
  ring.className = 'c-ring';

  const dot = document.createElement('div');
  dot.className = 'c-dot';

  document.body.appendChild(ring);
  document.body.appendChild(dot);

  const TRAIL_COUNT = 6;
  const trails = [];
  for (let i = 0; i < TRAIL_COUNT; i++) {
    const t = document.createElement('div');
    t.className = 'cursor-trail-dot';
    const size = Math.max(3, 8 - i);
    t.style.cssText = `
      width: ${size}px; height: ${size}px;
      opacity: 0; box-shadow: 0 0 ${12 - i}px var(--accent-light);
    `;
    document.body.appendChild(t);
    trails.push({ el: t, x: 0, y: 0 });
  }

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let rx = mx, ry = my;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
  });

  const positions = Array(TRAIL_COUNT).fill().map(() => ({ x: mx, y: my }));

  function renderCursor() {
    rx += (mx - rx) * 0.28;
    ry += (my - ry) * 0.28;
    ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;

    positions[0].x += (mx - positions[0].x) * 0.45;
    positions[0].y += (my - positions[0].y) * 0.45;

    for (let i = 1; i < TRAIL_COUNT; i++) {
      positions[i].x += (positions[i-1].x - positions[i].x) * 0.45;
      positions[i].y += (positions[i-1].y - positions[i].y) * 0.45;
    }

    trails.forEach((t, i) => {
      t.el.style.transform = `translate3d(${positions[i].x}px, ${positions[i].y}px, 0) translate(-50%, -50%)`;
      t.el.style.opacity = (0.75 - (i * 0.11)).toString();
    });

    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  const hoverSelectors = 'a, button, .tl-img-wrap, .sid-img-wrap, .card, .filter-chip, .t-cmd, .tb-soc, .soc-btn, .road-nav-btn';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverSelectors)) ring.classList.add('c-hover');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverSelectors)) ring.classList.remove('c-hover');
  });

  document.addEventListener('mousedown', () => ring.classList.add('c-click'));
  document.addEventListener('mouseup', () => ring.classList.remove('c-click'));

  document.addEventListener('click', (e) => {
    const burst = document.createElement('div');
    burst.style.cssText = `
      position: fixed; pointer-events: none; z-index: 9997;
      left: ${e.clientX}px; top: ${e.clientY}px;
      width: 10px; height: 10px; border-radius: 50%;
      border: 2px solid var(--accent-light);
      transform: translate3d(-50%, -50%, 0) scale(1);
      box-shadow: 0 0 24px var(--accent-light);
      animation: burst-anim 0.45s ease-out forwards;
    `;
    document.body.appendChild(burst);
    setTimeout(() => burst.remove(), 500);
  });

  const style = document.createElement('style');
  style.textContent = `
    @keyframes burst-anim {
      0% { transform: translate3d(-50%, -50%, 0) scale(1); opacity: 1; }
      100% { transform: translate3d(-50%, -50%, 0) scale(7); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

/* ==========================================================================
   2. ANIMATED GEOMETRIC BACKGROUND — FLOATING SHAPES + PULSING DOT GRID
   ========================================================================== */
function initFluidMeshCanvas() {
  const canvas = document.createElement('canvas');
  canvas.id = 'fluid-mesh-canvas';
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d', { alpha: true });

  let width  = canvas.width  = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  let mouseX = width / 2, mouseY = height / 2;

  window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; }, { passive: true });
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    buildDotGrid();
  });

  /* -- Floating geometric shapes ---------------------------------------- */
  const SHAPES = 10;
  const shapes = Array.from({ length: SHAPES }, (_, i) => ({
    x:     Math.random() * width,
    y:     Math.random() * height,
    vx:    (Math.random() - 0.5) * 0.45,
    vy:    (Math.random() - 0.5) * 0.45,
    size:  Math.random() * 28 + 12,
    sides: [3, 4, 6][Math.floor(Math.random() * 3)],
    rot:   Math.random() * Math.PI * 2,
    rotV:  (Math.random() - 0.5) * 0.008,
    alpha: Math.random() * 0.18 + 0.06,
    col:   ['99,102,241', '6,182,212', '236,72,153', '16,185,129'][i % 4],
    pulse: Math.random() * Math.PI * 2,
  }));

  /* -- Dot grid ---------------------------------------------------------- */
  const GRID_GAP = 75;
  let dots = [];
  function buildDotGrid() {
    dots = [];
    const cols = Math.ceil(width  / GRID_GAP) + 1;
    const rows = Math.ceil(height / GRID_GAP) + 1;
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++)
        dots.push({ bx: c * GRID_GAP, by: r * GRID_GAP, phase: Math.random() * Math.PI * 2 });
  }
  buildDotGrid();

  /* -- Connecting particle nodes ----------------------------------------- */
  const nodes = Array.from({ length: 12 }, () => ({
    x:  Math.random() * width,  y:  Math.random() * height,
    vx: (Math.random() - 0.5) * 0.7, vy: (Math.random() - 0.5) * 0.7,
    r:  Math.random() * 2.2 + 1,
  }));

  let t = 0;

  /* -- Polygon helper ---------------------------------------------------- */
  function polygon(cx, cy, r, sides, rot) {
    ctx.beginPath();
    for (let i = 0; i <= sides; i++) {
      const angle = (i / sides) * Math.PI * 2 + rot;
      i === 0 ? ctx.moveTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle))
              : ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
    }
    ctx.closePath();
  }

  /* -- Main render loop -------------------------------------------------- */
  const MOUSE_RADIUS_SQ = 180 * 180;

  function render() {
    if (document.hidden) {
      requestAnimationFrame(render);
      return;
    }

    ctx.clearRect(0, 0, width, height);
    t += 0.012;

    /* 1 · Pulsing dot grid — fast distance squaring calculation */
    dots.forEach(d => {
      const dx = d.bx - mouseX;
      const dy = d.by - mouseY;
      const distSq = dx * dx + dy * dy;

      let proximity = 0;
      if (distSq < MOUSE_RADIUS_SQ) {
        proximity = 1 - Math.sqrt(distSq) / 180;
      }

      const pulse = Math.sin(t * 1.6 + d.phase) * 0.5 + 0.5;
      const alpha = 0.05 + pulse * 0.05 + proximity * 0.28;
      const r = 1.3 + proximity * 2.5;

      ctx.beginPath();
      ctx.arc(d.bx, d.by, r, 0, Math.PI * 2);
      ctx.fillStyle = proximity > 0.15
        ? `rgba(6,182,212,${alpha})`
        : `rgba(129,140,248,${alpha})`;
      ctx.fill();
    });

    /* 2 · Floating geometric shapes — simplified stroke drawing (no CPU blur shadows) */
    shapes.forEach(s => {
      s.x += s.vx; s.y += s.vy; s.rot += s.rotV; s.pulse += 0.018;
      if (s.x < -60)      s.x = width  + 60;
      if (s.x > width+60) s.x = -60;
      if (s.y < -60)      s.y = height + 60;
      if (s.y > height+60)s.y = -60;

      const pAlpha = s.alpha + Math.sin(s.pulse) * 0.05;
      const sz     = s.size  + Math.sin(s.pulse * 0.7) * 3;

      ctx.save();
      polygon(s.x, s.y, sz, s.sides, s.rot);
      ctx.strokeStyle = `rgba(${s.col},${pAlpha + 0.12})`;
      ctx.lineWidth   = 1.2;
      ctx.stroke();
      ctx.restore();
    });

    /* 3 · Particle nodes + connecting lines */
    nodes.forEach((n, i) => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > width)  n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;

      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(129,140,248,0.55)';
      ctx.fill();

      for (let j = i + 1; j < nodes.length; j++) {
        const n2 = nodes[j];
        const dx = n.x - n2.x;
        const dy = n.y - n2.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < 140 * 140) {
          const dist = Math.sqrt(distSq);
          ctx.strokeStyle = `rgba(129,140,248,${0.22 * (1 - dist / 140)})`;
          ctx.lineWidth   = 0.7;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.stroke();
        }
      }

      /* Line from node to mouse cursor */
      const mdx = n.x - mouseX;
      const mdy = n.y - mouseY;
      const mdistSq = mdx * mdx + mdy * mdy;
      if (mdistSq < 170 * 170) {
        const md = Math.sqrt(mdistSq);
        ctx.strokeStyle = `rgba(6,182,212,${0.45 * (1 - md / 170)})`;
        ctx.lineWidth   = 1.1;
        ctx.beginPath();
        ctx.moveTo(n.x, n.y);
        ctx.lineTo(mouseX, mouseY);
        ctx.stroke();
      }
    });

    requestAnimationFrame(render);
  }
  render();
}

/* ==========================================================================
   3. HIGH PERFORMANCE 3D TILT & SPOTLIGHT
   ========================================================================== */
function initFast3DTiltAndSpotlight() {
  if (window.innerWidth <= 768) return;

  const cards = document.querySelectorAll('.card, .pfp-wrap');

  cards.forEach(card => {
    let rect = null;
    let ticking = false;

    card.addEventListener('mouseenter', () => {
      rect = card.getBoundingClientRect();
    });

    card.addEventListener('mousemove', (e) => {
      if (!rect) rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (!ticking) {
        requestAnimationFrame(() => {
          card.style.setProperty('--mouse-x', `${x}px`);
          card.style.setProperty('--mouse-y', `${y}px`);

          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = ((y - centerY) / centerY) * -5;
          const rotateY = ((x - centerX) / centerX) * 5;

          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    card.addEventListener('mouseleave', () => {
      rect = null;
      requestAnimationFrame(() => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });
  });
}

/* ==========================================================================
   4. SCROLL PROGRESS BAR
   ========================================================================== */
function initScrollProgressBar() {
  const bar = document.querySelector('#scroll-bar');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    bar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  }, { passive: true });
}

/* ==========================================================================
   5. STICKY HEADER WRAPPER
   ========================================================================== */
function initPinnedHeader() {
  const headerWrapper = document.querySelector('.header-pinned-wrapper');
  if (!headerWrapper) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      headerWrapper.classList.add('scrolled');
    } else {
      headerWrapper.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* ==========================================================================
   6. DARK / LIGHT MODE TOGGLE
   ========================================================================== */
function initDarkLightToggle() {
  const toggleBtn = document.querySelector('#themeToggle');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light-mode');
    const icon = toggleBtn.querySelector('i');
    if (icon) {
      icon.className = isLight ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
  });
}

/* ==========================================================================
   6b. MOBILE NAVIGATION MENU TOGGLE
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navLinks  = document.querySelector('.nav-links');
  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = navLinks.classList.toggle('open');
    const icon = toggleBtn.querySelector('i');
    if (icon) {
      icon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    }
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      const icon = toggleBtn.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-bars';
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar')) {
      navLinks.classList.remove('open');
      const icon = toggleBtn.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-bars';
    }
  });
}

/* ==========================================================================
   7. HORIZONTAL ROADMAP NAVIGATION BUTTONS
   ========================================================================== */
function initHorizontalRoadmap() {
  const track = document.querySelector('#roadTrack');
  const prevBtn = document.querySelector('#roadPrev');
  const nextBtn = document.querySelector('#roadNext');

  if (!track || !prevBtn || !nextBtn) return;

  prevBtn.addEventListener('click', () => {
    track.scrollBy({ left: -340, behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    track.scrollBy({ left: 340, behavior: 'smooth' });
  });
}

/* ==========================================================================
   8. TEXT ANIMATIONS INITIALIZER
   ========================================================================== */
function initTextAnimations() {
  const titles = document.querySelectorAll('.shimmer-text');
  titles.forEach(title => {
    const text = title.textContent.trim();
    title.setAttribute('data-text', text);
  });
}

/* ==========================================================================
   9. TYPEWRITER EFFECT
   ========================================================================== */
function initTyping() {
  const el = document.querySelector('.hero-role-typed');
  if (!el) return;

  const roles = [
    'Software Engineering Undergrad',
    'Full-Stack Developer (MERN / Java / PHP)',
    'Enterprise POS & Mobile App Developer',
    'Data Analytics & Business Intelligence Enthusiast',
    'Multi-Cloud Certified (Oracle OCI / Aviatrix)'
  ];

  let ri = 0, ci = 0, deleting = false;

  function tick() {
    const word = roles[ri];
    el.textContent = deleting ? word.slice(0, ci - 1) : word.slice(0, ci + 1);
    deleting ? ci-- : ci++;

    let delay = deleting ? 25 : 65;
    if (!deleting && ci === word.length) { delay = 2200; deleting = true; }
    else if (deleting && ci === 0) { deleting = false; ri = (ri + 1) % roles.length; delay = 350; }
    setTimeout(tick, delay);
  }
  tick();
}

/* ==========================================================================
   10. INTERACTIVE TERMINAL CONSOLE
   ========================================================================== */
function initTerminal() {
  const body = document.querySelector('#termBody');
  const input = document.querySelector('#termInput');
  const cmdBtns = document.querySelectorAll('.t-cmd');
  if (!body || !input) return;

  const cmds = {
    help: `Available commands: <span style="color:var(--accent-light)">whoami · projects · skills · certs · contact · clear</span>`,
    whoami: `<strong>Shehan Sandaruwan</strong> — Software Engineering Undergraduate at Birmingham City University (Student ID: 26107103). Receiving higher diploma training at the Java Institute for Advanced Technology (ISIC: S094000015343L). Specialized in web, enterprise POS, mobile apps, multi-cloud, and data analytics.`,
    projects: `Featured Projects:<br>— <span style="color:#10b981">AutoMart</span> — Android M-Commerce App (Java)<br>— <span style="color:#10b981">Chellot</span> — Web AI Chatbot System (JavaScript)<br>— <span style="color:#10b981">Yapio</span> — Full-Stack Web Platform (MERN Stack)<br>— <span style="color:#10b981">Noara Institute POS</span> — Java Swing Enterprise System (Team Project)<br>— <span style="color:#10b981">FeniZ</span> — E-Commerce Clothing Web Store (PHP/MySQL)`,
    skills: `Technical Core:<br>— Languages: Java, JavaScript, TypeScript, PHP, Python, SQL, C/C++<br>— Web & Mobile: React.js, Node.js, Express.js, React Native, Java Swing<br>— Cloud & DBs: MongoDB, Firebase, MySQL, Oracle OCI, AWS, GitHub Actions<br>— Data & Business: Power BI, Excel, Business Analysis, Agile/Scrum`,
    certs: `Verified Credentials:<br>— Level 5 HDSE Diploma & Academic Transcript (Skills & Education Group Awards UK)<br>— Business Analyst Professional Diploma (Academy Europe)<br>— Introduction to MERN Stack (Simplilearn)<br>— ACE Multicloud Network Associate (Aviatrix)<br>— Oracle Cloud Infrastructure (OCI) Foundations & AI Foundations<br>— MongoDB for SQL Experts · BCU Student Card · Official Academic Letter · ISIC Global Card`,
    contact: `Contact Channels:<br>— Email: ssandaruwan2002@gmail.com<br>— Phone / WhatsApp: +94 76 694 0120<br>— GitHub: github.com/ShevonRuzen<br>— LinkedIn: linkedin.com/in/shehan-sandaruwan-a53802292`
  };

  function run(cmd) {
    const clean = cmd.trim().toLowerCase();
    const userLine = document.createElement('div');
    userLine.className = 't-line';
    userLine.innerHTML = `<span class="t-prompt">shehan@portfolio:~$</span> ${cmd}`;
    body.appendChild(userLine);

    if (clean === 'clear') { body.innerHTML = ''; return; }

    const out = document.createElement('div');
    out.className = 't-line t-out';
    out.innerHTML = cmds[clean] ?? `Command not found: '${clean}'. Type <span style="color:var(--accent-light)">help</span>.`;
    body.appendChild(out);
    body.scrollTop = body.scrollHeight;
  }

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') { run(input.value); input.value = ''; }
  });
  cmdBtns.forEach(b => b.addEventListener('click', () => run(b.dataset.cmd)));
}

/* ==========================================================================
   11. SCROLL REVEAL ANIMATIONS — CINEMATIC APPEAR EFFECTS
   ========================================================================== */
function initScrollReveal() {
  const SELECTORS = '.reveal, .reveal-l, .reveal-r, .reveal-scale, .reveal-flip, .reveal-blur';
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll(SELECTORS).forEach(el => observer.observe(el));
}

/* ==========================================================================
   12. SKILL BARS — STAGGERED ONE-BY-ONE WITH LIVE PERCENTAGE COUNTER
   ========================================================================== */
function initSkillBars() {
  const skillCards = document.querySelectorAll('.skill-cat');
  if (!skillCards.length) return;

  /* Set CSS custom property --bar-pct on each fill element */
  document.querySelectorAll('.skill-fill').forEach(bar => {
    bar.style.setProperty('--bar-pct', bar.dataset.pct + '%');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const card = entry.target;
      if (card.dataset.barsLoaded) return;
      card.dataset.barsLoaded = '1';

      const fills = card.querySelectorAll('.skill-fill');
      const pcts  = card.querySelectorAll('.skill-pct');

      /* Animate bars + percentage counters staggered */
      fills.forEach((bar, idx) => {
        const targetPct = parseInt(bar.dataset.pct, 10);
        const pctLabel  = pcts[idx];
        const delay     = [100, 320, 540, 760, 980][idx] || idx * 220;

        /* 1 · Slide the bar width */
        setTimeout(() => {
          bar.style.transition = 'width 1.1s cubic-bezier(0.22, 1, 0.36, 1)';
          bar.style.width = targetPct + '%';
        }, delay);

        /* 2 · Count up the percentage label in sync */
        if (pctLabel) {
          pctLabel.textContent = '0%';
          setTimeout(() => {
            const duration = 1100;
            const start    = performance.now();
            function tick(now) {
              const elapsed = now - start;
              const progress = Math.min(elapsed / duration, 1);
              /* ease-out curve matching CSS cubic-bezier */
              const eased = 1 - Math.pow(1 - progress, 3);
              pctLabel.textContent = Math.round(eased * targetPct) + '%';
              if (progress < 1) requestAnimationFrame(tick);
              else pctLabel.textContent = targetPct + '%';
            }
            requestAnimationFrame(tick);
          }, delay);
        }
      });

      observer.unobserve(card);
    });
  }, { threshold: 0.25 });

  skillCards.forEach(card => observer.observe(card));
}

/* ==========================================================================
   13. COUNTERS
   ========================================================================== */
function initCounters() {
  const section = document.querySelector('#about');
  if (!section) return;
  let done = false;
  window.addEventListener('scroll', () => {
    if (done) return;
    if (section.getBoundingClientRect().top < window.innerHeight * 0.85) {
      document.querySelectorAll('.stat-num[data-target]').forEach(el => {
        const target = +el.dataset.target;
        let curr = 0;
        const step = Math.ceil(target / 40);
        const timer = setInterval(() => {
          curr = Math.min(curr + step, target);
          el.textContent = curr + '+';
          if (curr >= target) clearInterval(timer);
        }, 35);
      });
      done = true;
    }
  }, { passive: true });
}

/* ==========================================================================
   14. PROJECT FILTERS
   ========================================================================== */
function initProjectFilters() {
  const chips = document.querySelectorAll('.filter-chip');
  const cards = document.querySelectorAll('.proj-wrap');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const filter = chip.dataset.filter;
      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.cat.includes(filter);
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
          card.style.display = match ? 'block' : 'none';
          if (match) {
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 30);
          }
        }, 200);
      });
    });
  });
}

/* ==========================================================================
   15. LIGHTBOX MODAL PREVIEW
   ========================================================================== */
function initLightbox() {
  const modal = document.createElement('div');
  modal.className = 'modal-bg';
  modal.innerHTML = `
    <div class="modal-inner">
      <button class="modal-close-btn"><i class="fa-solid fa-xmark"></i></button>
      <img src="" alt="Document Preview" />
      <div class="modal-caption"></div>
    </div>
  `;
  document.body.appendChild(modal);

  const img   = modal.querySelector('img');
  const cap   = modal.querySelector('.modal-caption');
  const close = modal.querySelector('.modal-close-btn');

  function open(src, caption) {
    img.src = src;
    cap.textContent = caption || '';
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.tl-img-wrap, .sid-img-wrap, .proj-img-wrap').forEach(wrap => {
    wrap.addEventListener('click', (e) => {
      if (e.target.closest('.sid-download')) return;
      const image = wrap.querySelector('img');
      const caption = image?.alt || '';
      if (image) open(image.src, caption);
    });
  });

  close.addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

/* ==========================================================================
   16. UI SOUND SYNTHESIZER
   ========================================================================== */
function initSoundBtn() {
  const btn = document.querySelector('#soundBtn');
  if (!btn) return;

  let enabled = false;
  let audioCtx = null;

  btn.addEventListener('click', () => {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    enabled = !enabled;
    const icon = btn.querySelector('i');
    icon.className = enabled ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
    if (enabled) playTone(audioCtx, 520, 'sine', 0.08);
  });

  function playTone(ctx, freq, type, dur) {
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type; osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + dur);
    } catch(e) {}
  }

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('click', () => {
      if (enabled && audioCtx) playTone(audioCtx, 380 + Math.random() * 300, 'sine', 0.05);
    });
  });
}

/* ==========================================================================
   17. YOUTUBE SMART PLAYER COMPONENT (ZERO ERROR 153 ON FILE:// PREVIEWS)
   ========================================================================== */
function initYouTubePlayer() {
  const box = document.querySelector('#ytPlayerBox');
  if (!box) return;

  box.addEventListener('click', () => {
    if (window.location.protocol === 'file:') {
      window.open('https://youtu.be/vKJazMI5PAY?si=_xxJos-a4b9ZwfCS', '_blank');
    } else {
      box.outerHTML = `
        <div class="video-wrap">
          <iframe width="560" height="315"
                  src="https://www.youtube.com/embed/vKJazMI5PAY?autoplay=1"
                  title="MySQL Basic Complete Tutorial — Shehan Sandaruwan"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowfullscreen>
          </iframe>
        </div>
      `;
    }
  });
}
