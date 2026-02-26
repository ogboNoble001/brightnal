window.onload = () => {
  const overlay_jwt = document.getElementById('overlay_jwt');
  const token = localStorage.getItem("auth_token");

  if (token) {
    overlay_jwt.classList.remove('hidden_jwt');

    fetch("https://brightnal.onrender.com/api/verify-token", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          window.location.replace("/explore");
        } else {
          overlay_jwt.classList.add('hidden_jwt');
          localStorage.removeItem("auth_token");
          localStorage.removeItem("user");
        }
      })
      .catch(() => {
        overlay_jwt.classList.add('hidden_jwt');
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
      });

  } else {
    overlay_jwt.classList.add('hidden_jwt');
  }

  const exploreBtn = document.querySelector('.exploreBtn');
  if (exploreBtn) {
    exploreBtn.addEventListener('click', () => {
      window.location.href = './explore';
    });
  }

  if (typeof AOS !== "undefined") {
    AOS.init({
      offset: 20,
      delay: 0,
      easing: 'ease-in-out',
      once: false,
      anchorPlacement: 'top-bottom'
    });
  }

  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  // ── Masonry shuffle ──────────────────────────────────────────────
  const container = document.querySelector('.masonry-container');
  const originals = Array.from(container.children);
  const MIN_DISTANCE = 14;
  const TARGET_COUNT = 75;

  function shuffleWithDistance(items, minDistance) {
    const result = [];

    while (result.length < items.length) {
      const available = items.filter(item => {
        const lastIndex = result.lastIndexOf(item);
        return lastIndex === -1 || result.length - lastIndex > minDistance;
      });

      if (!available.length) {
        result.length = 0;
        continue;
      }

      const pick = available[Math.floor(Math.random() * available.length)];
      result.push(pick);
    }

    return result;
  }

  const pool = [];
  while (pool.length < TARGET_COUNT) {
    pool.push(...originals);
  }

  const trimmedPool = pool.slice(0, TARGET_COUNT);
  const shuffled = shuffleWithDistance(trimmedPool, MIN_DISTANCE);

  container.innerHTML = '';
  shuffled.forEach((item, i) => {
    const clone = item.cloneNode(true);
    clone.dataset.aosDelay = (i % 6) * 100;
    container.appendChild(clone);
  });

  // ── Overlay transition ───────────────────────────────────────────
  document.getElementById('overlay').style.transition = 'opacity 0.3s ease';

  // ── View more button ─────────────────────────────────────────────
  const viewMore = document.querySelector('.view-more');
  const viewMoreIcon = viewMore.querySelector('svg');
  viewMore.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  viewMoreIcon.style.transition = 'transform 0.3s ease';

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    const distanceToBottom = docHeight - (scrollTop + windowHeight);

    if (distanceToBottom < 200) {
      viewMore.style.opacity = distanceToBottom / 200;

      if (distanceToBottom <= 50) {
        viewMoreIcon.style.transform = `rotate(${180 * (1 - distanceToBottom / 50)}deg)`;
      } else {
        viewMoreIcon.style.transform = 'rotate(0deg)';
      }

      if (distanceToBottom <= 0) {
        viewMore.style.opacity = 0;
        setTimeout(() => {
          viewMoreIcon.style.transform = 'rotate(180deg)';
          viewMore.style.opacity = 1;
        }, 300);
      }
    } else {
      viewMore.style.opacity = 1;
      viewMoreIcon.style.transform = 'rotate(0deg)';
    }
  });

  viewMore.addEventListener('click', () => {
    viewMore.style.transform = 'translateY(20px)';
    setTimeout(() => {
      viewMore.style.transform = 'translateY(0)';
    }, 300);

    const distanceToBottom =
      document.documentElement.scrollHeight - (window.scrollY + window.innerHeight);

    if (distanceToBottom > 0) {
      window.scrollBy({ top: 500, left: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  });
};
