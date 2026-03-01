// ======================== PRODUCT DATA ========================
const products = [
  { id: 1, name: 'Celestial Diamond Pendant', brand: 'Lumière Signature', price: 4999, originalPrice: 6999, discount: 29, badge: 'bestseller', category: 'necklaces', rating: 4.8, reviews: 234, img: 'product-1.png', metal: 'gold', size: 'S' },
  { id: 2, name: 'Aurora Hoop Earrings', brand: 'Lumière Classics', price: 2499, originalPrice: 3499, discount: 29, badge: 'new', category: 'earrings', rating: 4.9, reviews: 187, img: 'product-2.png', metal: 'gold', size: 'M' },
  { id: 3, name: 'Ethereal Gold Bangle', brand: 'Lumière Luxe', price: 5999, originalPrice: null, discount: 0, badge: '', category: 'bracelets', rating: 4.7, reviews: 156, img: 'product-3.png', metal: 'gold', size: 'M' },
  { id: 4, name: 'Solitaire Rosé Ring', brand: 'Lumière Bridal', price: 8999, originalPrice: 11999, discount: 25, badge: 'sale', category: 'rings', rating: 4.9, reviews: 312, img: 'product-4.png', metal: 'rose-gold', size: 'S' },
  { id: 5, name: 'Charm Chain Anklet', brand: 'Lumière Everyday', price: 1499, originalPrice: 1999, discount: 25, badge: 'new', category: 'bracelets', rating: 4.6, reviews: 89, img: 'product-5.png', metal: 'gold', size: 'M' },
  { id: 6, name: 'Layered Pearl Necklace', brand: 'Lumière Signature', price: 6499, originalPrice: null, discount: 0, badge: 'bestseller', category: 'necklaces', rating: 4.8, reviews: 201, img: 'product-1.png', metal: 'silver', size: 'L' },
  { id: 7, name: 'Diamond Cluster Studs', brand: 'Lumière Luxe', price: 3999, originalPrice: 5499, discount: 27, badge: 'sale', category: 'earrings', rating: 4.7, reviews: 143, img: 'product-2.png', metal: 'white-gold', size: 'S' },
  { id: 8, name: 'Tennis Diamond Bracelet', brand: 'Lumière Bridal', price: 12999, originalPrice: 15999, discount: 19, badge: 'bestseller', category: 'bracelets', rating: 5.0, reviews: 98, img: 'product-8.png', metal: 'white-gold', size: 'M' },
];

// ======================== CART STATE ========================
function getCart() {
  try { return JSON.parse(localStorage.getItem('lumiere_cart')) || []; }
  catch { return []; }
}
function saveCart(cart) { localStorage.setItem('lumiere_cart', JSON.stringify(cart)); updateCartCounts(); }
function addToCart(productId, qty = 1) {
  const cart = getCart();
  const existing = cart.find(i => i.id === productId);
  if (existing) { existing.qty += qty; } else { cart.push({ id: productId, qty }); }
  saveCart(cart);
  showToast('Added to cart!', 'success');
}
function removeFromCart(productId) {
  saveCart(getCart().filter(i => i.id !== productId));
}
function updateCartQty(productId, qty) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (item) { item.qty = Math.max(1, qty); }
  saveCart(cart);
}
function updateCartCounts() {
  const cart = getCart();
  const total = cart.reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('.cart-count, #navCartCount').forEach(el => { el.textContent = total; });
}
function getCartProducts() {
  return getCart().map(ci => { const p = products.find(x => x.id === ci.id); return p ? { ...p, qty: ci.qty } : null; }).filter(Boolean);
}

// Ensure default cart if empty
function ensureDefaultCart() {
  if (getCart().length === 0) {
    saveCart([{ id: 1, qty: 1 }, { id: 4, qty: 1 }, { id: 2, qty: 1 }]);
  }
}

// ======================== AUTH STATE ========================
function getUser() {
  try { return JSON.parse(localStorage.getItem('lumiere_user')); } catch { return null; }
}
function saveUser(user) { localStorage.setItem('lumiere_user', JSON.stringify(user)); }
function logoutUser() { localStorage.removeItem('lumiere_user'); }

// ======================== RENDER PRODUCT CARD ========================
function renderProductCard(product) {
  const bc = product.badge === 'new' ? 'badge-new' : product.badge === 'sale' ? 'badge-sale' : product.badge === 'bestseller' ? 'badge-bestseller' : '';
  const bl = product.badge ? product.badge.charAt(0).toUpperCase() + product.badge.slice(1) : '';
  return `
    <div class="product-card" data-category="${product.category}" data-id="${product.id}">
      <div class="product-img-wrap">
        <a href="product.html?id=${product.id}"><img src="${product.img}" alt="${product.name}" loading="lazy"></a>
        ${product.badge ? `<span class="product-badge ${bc}">${bl}</span>` : ''}
        <div class="product-actions">
          <button class="product-action-btn" title="Add to Wishlist" onclick="showToast('Added to wishlist!','success')">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
          <button class="product-action-btn" title="Add to Cart" onclick="event.preventDefault();addToCart(${product.id})">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          </button>
        </div>
      </div>
      <div class="product-info">
        <p class="product-brand">${product.brand}</p>
        <h3 class="product-name"><a href="product.html?id=${product.id}">${product.name}</a></h3>
        <div class="product-rating"><div class="stars">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}</div><span class="rating-count">(${product.reviews})</span></div>
        <div class="product-price">
          <span class="price-current">₹${product.price.toLocaleString()}</span>
          ${product.originalPrice ? `<span class="price-original">₹${product.originalPrice.toLocaleString()}</span>` : ''}
          ${product.discount ? `<span class="price-discount">${product.discount}% OFF</span>` : ''}
        </div>
      </div>
    </div>`;
}

// ======================== TOAST ========================
function showToast(msg, type = '') {
  let root = document.getElementById('toastRoot');
  if (!root) { root = document.createElement('div'); root.id = 'toastRoot'; document.body.appendChild(root); }
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
  t.innerHTML = `<span style="font-size:18px">${icon}</span> ${msg}`;
  root.appendChild(t);
  requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add('active')));
  setTimeout(() => { t.classList.remove('active'); setTimeout(() => t.remove(), 400); }, 3000);
}

// ======================== ACCOUNT MODAL ========================
function injectAccountModal() {
  const root = document.getElementById('accountModalRoot');
  if (!root) return;
  root.innerHTML = `
  <div class="modal-overlay" id="accountOverlay">
    <div class="account-modal">
      <button class="modal-close" id="accountClose">✕</button>
      <!-- Login/Signup View -->
      <div id="authView">
        <div class="modal-header">
          <p class="modal-logo">LUMI<span>È</span>RE</p>
          <h2 id="authTitle">Welcome Back</h2>
          <p id="authSubtitle">Sign in to your account</p>
        </div>
        <div class="modal-tabs">
          <button class="modal-tab active" data-tab="loginForm">Login</button>
          <button class="modal-tab" data-tab="signupForm">Sign Up</button>
        </div>
        <div class="modal-body">
          <form class="modal-form active" id="loginForm" onsubmit="return false;">
            <div class="form-group"><label>Email Address</label><input type="email" class="form-input" id="loginEmail" placeholder="you@example.com" required></div>
            <div class="form-group"><label>Password</label><div class="password-wrap"><input type="password" class="form-input" id="loginPass" placeholder="Enter password" required><button type="button" class="password-toggle" onclick="togglePassword('loginPass',this)"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button></div></div>
            <div class="form-extras"><label class="remember-wrap"><input type="checkbox" checked> Remember me</label><a href="#" class="forgot-link">Forgot password?</a></div>
            <button type="submit" class="btn-submit" id="loginBtn">Sign In</button>
            <div class="modal-divider">or continue with</div>
            <div class="social-login">
              <button class="social-btn" onclick="socialLogin('Google')"><svg viewBox="0 0 24 24" width="20" height="20"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.29-4.74 3.29-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>Google</button>
            </div>
          </form>
          <form class="modal-form" id="signupForm" onsubmit="return false;">
            <div class="form-group"><label>Full Name</label><input type="text" class="form-input" id="signupName" placeholder="Your full name" required></div>
            <div class="form-group"><label>Email Address</label><input type="email" class="form-input" id="signupEmail" placeholder="you@example.com" required></div>
            <div class="form-group"><label>Password</label><div class="password-wrap"><input type="password" class="form-input" id="signupPass" placeholder="Min 8 characters" required><button type="button" class="password-toggle" onclick="togglePassword('signupPass',this)"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button></div></div>
            <div class="form-group"><label>Confirm Password</label><div class="password-wrap"><input type="password" class="form-input" id="signupConfirm" placeholder="Repeat password" required></div></div>
            <button type="submit" class="btn-submit" id="signupBtn">Create Account</button>
          </form>
        </div>
      </div>
      <!-- Logged In View -->
      <div class="account-panel" id="accountPanel">
        <div class="account-panel-header">
          <div class="account-avatar" id="accAvatar">PS</div>
          <div><p class="account-name" id="accName">Priya Sharma</p><p class="account-email" id="accEmail">priya@example.com</p></div>
        </div>
        <div class="account-menu">
          <button class="account-menu-item"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>My Profile</button>
          <button class="account-menu-item" onclick="window.location.href='cart.html'"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>My Orders</button>
          <button class="account-menu-item"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>Wishlist</button>
          <button class="account-menu-item"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>Settings</button>
          <button class="account-menu-item logout" id="logoutBtn"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>Sign Out</button>
        </div>
      </div>
    </div>
  </div>`;
  initAccountModal();
}

function togglePassword(id, btn) {
  const inp = document.getElementById(id);
  if (!inp) return;
  inp.type = inp.type === 'password' ? 'text' : 'password';
}

function socialLogin(provider) {
  const user = { name: 'Priya Sharma', email: 'priya@example.com', initials: 'PS' };
  saveUser(user);
  showToast(`Signed in with ${provider}!`, 'success');
  refreshAccountModal();
  setTimeout(() => closeAccountModal(), 600);
}

function initAccountModal() {
  const overlay = document.getElementById('accountOverlay');
  if (!overlay) return;
  // Close
  document.getElementById('accountClose')?.addEventListener('click', closeAccountModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeAccountModal(); });
  // Tabs
  overlay.querySelectorAll('.modal-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      overlay.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
      overlay.querySelectorAll('.modal-form').forEach(f => f.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.tab)?.classList.add('active');
      const isLogin = tab.dataset.tab === 'loginForm';
      document.getElementById('authTitle').textContent = isLogin ? 'Welcome Back' : 'Create Account';
      document.getElementById('authSubtitle').textContent = isLogin ? 'Sign in to your account' : 'Join the Lumière family';
    });
  });
  // Login
  document.getElementById('loginBtn')?.addEventListener('click', () => {
    const email = document.getElementById('loginEmail')?.value;
    const pass = document.getElementById('loginPass')?.value;
    if (!email || !pass) { showToast('Please fill all fields', 'error'); return; }
    const name = email.split('@')[0].replace(/[^a-zA-Z ]/g, '');
    const initials = name.substring(0, 2).toUpperCase();
    saveUser({ name: name.charAt(0).toUpperCase() + name.slice(1), email, initials });
    showToast('Welcome back!', 'success');
    refreshAccountModal();
    setTimeout(() => closeAccountModal(), 600);
  });
  // Signup
  document.getElementById('signupBtn')?.addEventListener('click', () => {
    const name = document.getElementById('signupName')?.value;
    const email = document.getElementById('signupEmail')?.value;
    const pass = document.getElementById('signupPass')?.value;
    const conf = document.getElementById('signupConfirm')?.value;
    if (!name || !email || !pass) { showToast('Please fill all fields', 'error'); return; }
    if (pass !== conf) { showToast('Passwords do not match', 'error'); return; }
    const initials = name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
    saveUser({ name, email, initials });
    showToast('Account created successfully!', 'success');
    refreshAccountModal();
    setTimeout(() => closeAccountModal(), 600);
  });
  // Logout
  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    logoutUser(); showToast('Signed out', 'success');
    refreshAccountModal(); closeAccountModal();
  });
}

function openAccountModal() {
  refreshAccountModal();
  const overlay = document.getElementById('accountOverlay');
  if (overlay) { overlay.classList.add('active'); document.body.style.overflow = 'hidden'; }
}
function closeAccountModal() {
  const overlay = document.getElementById('accountOverlay');
  if (overlay) { overlay.classList.remove('active'); document.body.style.overflow = ''; }
}
function refreshAccountModal() {
  const user = getUser();
  const authView = document.getElementById('authView');
  const panel = document.getElementById('accountPanel');
  if (!authView || !panel) return;
  if (user) {
    authView.style.display = 'none'; panel.classList.add('active');
    document.getElementById('accName').textContent = user.name;
    document.getElementById('accEmail').textContent = user.email;
    document.getElementById('accAvatar').textContent = user.initials;
  } else {
    authView.style.display = ''; panel.classList.remove('active');
  }
}

// ======================== TRENDING GRID ========================
function initTrendingGrid() {
  const grid = document.getElementById('trendingGrid');
  if (!grid) return;
  grid.innerHTML = products.slice(0, 8).map(p => renderProductCard(p)).join('');
}

// ======================== NAVBAR ========================
function initNavbar() {
  const nb = document.getElementById('navbar');
  if (nb) window.addEventListener('scroll', () => nb.classList.toggle('scrolled', window.scrollY > 50));
}

// ======================== MOBILE NAV ========================
function initMobileNav() {
  const btn = document.getElementById('hamburgerBtn'), nav = document.getElementById('mobileNav');
  const ov = document.getElementById('mobileOverlay'), cl = document.getElementById('mobileNavClose');
  if (!btn || !nav) return;
  const tog = o => { nav.classList.toggle('active', o); ov?.classList.toggle('active', o); document.body.style.overflow = o ? 'hidden' : ''; };
  btn.addEventListener('click', () => tog(true));
  cl?.addEventListener('click', () => tog(false));
  ov?.addEventListener('click', () => tog(false));
}

// ======================== SCROLL ANIMATIONS ========================
function initScrollAnimations() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('animate-in'); obs.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.section-header,.category-card,.product-card,.feature-item,.testimonial-card,.banner-cta-inner').forEach(el => {
    el.style.opacity = '0'; el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.7s cubic-bezier(.25,.46,.45,.94),transform 0.7s cubic-bezier(.25,.46,.45,.94)';
    obs.observe(el);
  });
}
const animS = document.createElement('style');
animS.textContent = '.animate-in{opacity:1!important;transform:translateY(0)!important;}';
document.head.appendChild(animS);

// ======================== CATEGORY PAGE ========================
function initCategoryPage() {
  const grid = document.getElementById('shopGrid');
  if (!grid) return;
  const params = new URLSearchParams(window.location.search);
  const catParam = params.get('cat');
  function renderGrid(list) {
    grid.innerHTML = list.map(p => renderProductCard(p)).join('');
    const c = document.getElementById('productCount'); if (c) c.textContent = list.length;
    grid.querySelectorAll('.product-card').forEach((el, i) => {
      el.style.opacity = '0'; el.style.transform = 'translateY(20px)';
      el.style.transition = `opacity .5s ${i * .05}s ease,transform .5s ${i * .05}s ease`;
      setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }, 50);
    });
  }
  document.querySelectorAll('.filter-option').forEach(o => o.addEventListener('click', () => { o.classList.toggle('active'); applyFilters(); }));
  document.querySelectorAll('.filter-group-header').forEach(h => h.addEventListener('click', () => h.parentElement.classList.toggle('collapsed')));
  document.querySelectorAll('.color-swatch').forEach(s => s.addEventListener('click', () => { s.classList.toggle('active'); applyFilters(); }));
  const ss = document.getElementById('sortSelect'); if (ss) ss.addEventListener('change', () => applyFilters());
  function applyFilters() {
    let r = [...products];
    const ac = [...document.querySelectorAll('.filter-group[data-filter="category"] .filter-option.active')].map(e => e.dataset.value);
    if (ac.length) r = r.filter(p => ac.includes(p.category)); else if (catParam) r = r.filter(p => p.category === catParam);
    const am = [...document.querySelectorAll('.color-swatch.active')].map(e => e.dataset.metal);
    if (am.length) r = r.filter(p => am.includes(p.metal));
    const mn = document.getElementById('priceMin'), mx = document.getElementById('priceMax');
    if (mn && mx) { const a = parseInt(mn.value) || 0, b = parseInt(mx.value) || 99999; r = r.filter(p => p.price >= a && p.price <= b); }
    if (ss) { const v = ss.value; if (v === 'price-low') r.sort((a, b) => a.price - b.price); else if (v === 'price-high') r.sort((a, b) => b.price - a.price); else if (v === 'rating') r.sort((a, b) => b.rating - a.rating); else if (v === 'newest') r.sort((a, b) => b.id - a.id); }
    renderGrid(r);
  }
  if (catParam) document.querySelectorAll(`.filter-option[data-value="${catParam}"]`).forEach(e => e.classList.add('active'));
  applyFilters();
  const mfb = document.getElementById('mobileFilterBtn'), sb = document.querySelector('.shop-sidebar');
  if (mfb && sb) mfb.addEventListener('click', () => { sb.classList.toggle('active'); document.body.style.overflow = sb.classList.contains('active') ? 'hidden' : ''; });
}

// ======================== PRODUCT PAGE ========================
function initProductPage() {
  if (!document.querySelector('.product-detail-section')) return;
  const params = new URLSearchParams(window.location.search);
  const pid = parseInt(params.get('id')) || 1;
  const product = products.find(p => p.id === pid) || products[0];
  document.getElementById('detailName').textContent = product.name;
  document.getElementById('detailBrand').textContent = product.brand;
  document.getElementById('detailPrice').textContent = `₹${product.price.toLocaleString()}`;
  document.getElementById('detailMainImg').src = product.img;
  if (product.originalPrice) { document.getElementById('detailOriginalPrice').textContent = `₹${product.originalPrice.toLocaleString()}`; document.getElementById('detailDiscount').textContent = `${product.discount}% OFF`; }
  else { document.getElementById('detailOriginalPrice')?.style.setProperty('display', 'none'); document.getElementById('detailDiscount')?.style.setProperty('display', 'none'); }
  document.getElementById('detailRatingStars').innerHTML = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));
  document.getElementById('detailRatingText').innerHTML = `<span>${product.rating}</span> (${product.reviews} reviews)`;
  // Tabs
  document.querySelectorAll('.tab-btn').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(x => x.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(x => x.classList.remove('active'));
    b.classList.add('active'); document.getElementById(b.dataset.tab)?.classList.add('active');
  }));
  // Qty
  const qi = document.getElementById('qtyInput');
  document.getElementById('qtyMinus')?.addEventListener('click', () => { if (qi && parseInt(qi.value) > 1) qi.value = parseInt(qi.value) - 1; });
  document.getElementById('qtyPlus')?.addEventListener('click', () => { if (qi) qi.value = parseInt(qi.value) + 1; });
  // Variants
  document.querySelectorAll('.variant-btn:not(.disabled)').forEach(b => b.addEventListener('click', () => { b.closest('.variant-options').querySelectorAll('.variant-btn').forEach(x => x.classList.remove('active')); b.classList.add('active'); }));
  document.querySelectorAll('.metal-btn').forEach(b => b.addEventListener('click', () => { document.querySelectorAll('.metal-btn').forEach(x => x.classList.remove('active')); b.classList.add('active'); }));
  document.querySelector('.btn-wishlist-lg')?.addEventListener('click', function () { this.classList.toggle('active'); showToast(this.classList.contains('active') ? 'Added to wishlist' : 'Removed from wishlist', 'success'); });
  // Add to cart
  document.querySelector('.btn-add-cart')?.addEventListener('click', () => { const qty = parseInt(qi?.value) || 1; addToCart(product.id, qty); });
  document.querySelector('.btn-buy-now')?.addEventListener('click', () => { const qty = parseInt(qi?.value) || 1; addToCart(product.id, qty); window.location.href = 'checkout.html'; });
  // Thumbs
  document.querySelectorAll('.gallery-thumb').forEach(t => t.addEventListener('click', () => { document.querySelectorAll('.gallery-thumb').forEach(x => x.classList.remove('active')); t.classList.add('active'); document.getElementById('detailMainImg').src = t.querySelector('img').src; }));
  // Related
  const rg = document.getElementById('relatedGrid');
  if (rg) rg.innerHTML = products.filter(p => p.id !== product.id).slice(0, 4).map(p => renderProductCard(p)).join('');
}

// ======================== CART PAGE ========================
function initCartPage() {
  const container = document.getElementById('cartItems');
  if (!container) return;
  ensureDefaultCart();

  function renderCart() {
    const items = getCartProducts();
    document.getElementById('cartItemCount').textContent = `${items.length} Item${items.length !== 1 ? 's' : ''}`;
    if (items.length === 0) {
      container.innerHTML = `<div class="cart-empty"><div class="cart-empty-icon">🛍️</div><h2>Your cart is empty</h2><p>Looks like you haven't added anything yet.</p><a href="category.html" class="btn-primary">Start Shopping</a></div>`;
      document.getElementById('cartSummary').style.display = 'none';
      return;
    }
    document.getElementById('cartSummary').style.display = '';
    container.innerHTML = items.map((item, i) => `
      <div class="cart-item" style="animation-delay:${i * 0.1}s">
        <div class="cart-item-img"><a href="product.html?id=${item.id}"><img src="${item.img}" alt="${item.name}"></a></div>
        <div class="cart-item-details">
          <p class="cart-item-brand">${item.brand}</p>
          <h3 class="cart-item-name"><a href="product.html?id=${item.id}">${item.name}</a></h3>
          <div class="cart-item-meta"><span>Size: ${item.size || 'S'}</span><span>Metal: ${item.metal}</span></div>
        </div>
        <div class="cart-item-right">
          <div class="cart-item-price-wrap">
            <span class="cart-item-price">₹${(item.price * item.qty).toLocaleString()}</span>
            ${item.originalPrice ? `<span class="cart-item-original">₹${(item.originalPrice * item.qty).toLocaleString()}</span>` : ''}
            ${item.discount ? `<span class="cart-item-discount">You save ₹${((item.originalPrice - item.price) * item.qty).toLocaleString()}</span>` : ''}
          </div>
          <div class="cart-qty-wrap">
            <button class="cart-qty-btn" onclick="updateCartQty(${item.id},${item.qty - 1});document.dispatchEvent(new Event('cartUpdated'))">−</button>
            <input class="cart-qty-input" type="number" value="${item.qty}" min="1" onchange="updateCartQty(${item.id},parseInt(this.value)||1);document.dispatchEvent(new Event('cartUpdated'))">
            <button class="cart-qty-btn" onclick="updateCartQty(${item.id},${item.qty + 1});document.dispatchEvent(new Event('cartUpdated'))">+</button>
          </div>
          <button class="cart-item-remove" onclick="removeFromCart(${item.id});document.dispatchEvent(new Event('cartUpdated'))">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            Remove
          </button>
        </div>
      </div>
    `).join('');
    updateSummary(items);
  }

  function updateSummary(items) {
    const subtotal = items.reduce((s, i) => (i.originalPrice || i.price) * i.qty + s, 0);
    const total = items.reduce((s, i) => i.price * i.qty + s, 0);
    const savings = subtotal - total;
    document.getElementById('summarySubtotal').textContent = `₹${subtotal.toLocaleString()}`;
    document.getElementById('summaryDiscount').textContent = savings > 0 ? `− ₹${savings.toLocaleString()}` : '₹0';
    document.getElementById('summaryTotal').textContent = `₹${total.toLocaleString()}`;
  }

  // Coupon
  document.getElementById('couponApplyBtn')?.addEventListener('click', () => {
    const code = document.getElementById('couponInput')?.value?.toUpperCase();
    if (code === 'SHINE20') {
      document.getElementById('couponApplied').style.display = 'flex';
      document.getElementById('couponInput').parentElement.style.display = 'none';
      showToast('Coupon applied! ₹1,000 off', 'success');
    } else { showToast('Invalid coupon code', 'error'); }
  });
  document.getElementById('couponRemoveBtn')?.addEventListener('click', () => {
    document.getElementById('couponApplied').style.display = 'none';
    document.getElementById('couponInput').parentElement.style.display = 'flex';
    document.getElementById('couponInput').value = '';
  });

  renderCart();
  document.addEventListener('cartUpdated', renderCart);
}

// ======================== CHECKOUT PAGE ========================
function initCheckoutPage() {
  if (!document.getElementById('stepShipping')) return;
  ensureDefaultCart();
  const items = getCartProducts();

  // Render sidebar items
  const chkItems = document.getElementById('checkoutItems');
  if (chkItems) {
    chkItems.innerHTML = items.map(item => `
      <div class="checkout-item">
        <div class="checkout-item-img"><img src="${item.img}" alt="${item.name}"></div>
        <div class="checkout-item-info"><p class="checkout-item-name">${item.name}</p><p class="checkout-item-meta">Qty: ${item.qty} · ${item.metal}</p></div>
        <span class="checkout-item-price">₹${(item.price * item.qty).toLocaleString()}</span>
      </div>`).join('');
  }
  const subtotal = items.reduce((s, i) => (i.originalPrice || i.price) * i.qty + s, 0);
  const total = items.reduce((s, i) => i.price * i.qty + s, 0);
  const savings = subtotal - total;
  const setEl = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
  setEl('chkSubtotal', `₹${subtotal.toLocaleString()}`);
  setEl('chkSavings', `− ₹${savings.toLocaleString()}`);
  setEl('chkTotal', `₹${total.toLocaleString()}`);
  setEl('reviewTotal', `₹${total.toLocaleString()}`);

  // Step navigation
  function goToStep(n) {
    document.getElementById('stepShipping').style.display = n === 1 ? '' : 'none';
    document.getElementById('stepPayment').style.display = n === 2 ? '' : 'none';
    document.getElementById('stepReview').style.display = n === 3 ? '' : 'none';
    document.querySelectorAll('.checkout-step').forEach(s => {
      const sn = parseInt(s.dataset.step);
      s.classList.remove('active', 'completed');
      if (sn === n) s.classList.add('active');
      if (sn < n) s.classList.add('completed');
    });
    document.querySelectorAll('.step-connector').forEach((c, i) => c.classList.toggle('active', i < n - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  document.getElementById('toPaymentBtn')?.addEventListener('click', () => goToStep(2));
  document.getElementById('backToShipBtn')?.addEventListener('click', () => goToStep(1));
  document.getElementById('toReviewBtn')?.addEventListener('click', () => {
    // populate review
    const pm = document.querySelector('.payment-option.active');
    setEl('reviewPayment', pm?.querySelector('h4')?.textContent || 'Card');
    const cn = document.getElementById('cardNumber')?.value;
    setEl('reviewPaymentDetail', cn ? `Ending in •••• ${cn.slice(-4)}` : 'Selected');
    const ri = document.getElementById('reviewItems');
    if (ri) ri.innerHTML = items.map(item => `
      <div class="checkout-item">
        <div class="checkout-item-img"><img src="${item.img}" alt="${item.name}"></div>
        <div class="checkout-item-info"><p class="checkout-item-name">${item.name}</p><p class="checkout-item-meta">Qty: ${item.qty} · Size: ${item.size} · ${item.metal}</p></div>
        <span class="checkout-item-price">₹${(item.price * item.qty).toLocaleString()}</span>
      </div>`).join('');
    goToStep(3);
  });
  document.getElementById('backToPayBtn')?.addEventListener('click', () => goToStep(2));

  // Place order
  document.getElementById('placeOrderBtn')?.addEventListener('click', () => {
    const btn = document.getElementById('placeOrderBtn');
    btn.disabled = true; btn.innerHTML = '<span class="spinner"></span> Processing...';
    setTimeout(() => {
      const orderId = 'LM-2026-' + Math.random().toString(36).substring(2, 7).toUpperCase();
      setEl('orderId', orderId);
      document.getElementById('orderSuccessOverlay')?.classList.add('active');
      localStorage.removeItem('lumiere_cart');
      updateCartCounts();
    }, 2000);
  });

  // Saved address toggle
  document.querySelectorAll('.saved-address').forEach(a => a.addEventListener('click', () => {
    document.querySelectorAll('.saved-address').forEach(x => x.classList.remove('active'));
    a.classList.add('active');
  }));
  document.getElementById('addNewAddrBtn')?.addEventListener('click', () => {
    const f = document.getElementById('newAddrForm');
    f.style.display = f.style.display === 'none' ? '' : 'none';
  });

  // Payment selection
  document.querySelectorAll('.payment-option').forEach(o => o.addEventListener('click', () => {
    document.querySelectorAll('.payment-option').forEach(x => x.classList.remove('active'));
    o.classList.add('active');
    const cf = document.getElementById('cardForm');
    if (cf) cf.style.display = o.dataset.method === 'card' ? '' : 'none';
  }));

  // Card number formatting
  document.getElementById('cardNumber')?.addEventListener('input', function () {
    this.value = this.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
  });
  document.getElementById('cardExpiry')?.addEventListener('input', function () {
    this.value = this.value.replace(/\D/g, '').replace(/^(\d{2})(\d)/, '$1 / $2');
  });
}

// ======================== ACCOUNT TRIGGER ========================
function initAccountTriggers() {
  document.querySelectorAll('.account-trigger, .nav-icon[aria-label="Account"]').forEach(btn => {
    btn.addEventListener('click', e => { e.preventDefault(); openAccountModal(); });
  });
}

// ======================== INIT ========================
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileNav();
  updateCartCounts();
  injectAccountModal();
  initAccountTriggers();
  initTrendingGrid();
  initCategoryPage();
  initProductPage();
  initCartPage();
  initCheckoutPage();
  setTimeout(() => initScrollAnimations(), 100);
});
