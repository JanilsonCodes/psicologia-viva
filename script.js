
// THEME
function toggleTheme() {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    document.getElementById('themeBtn').textContent = isDark ? '🌙' : '☀️';
}

// MOBILE MENU
function toggleMenu() {
    const m = document.getElementById('mobileMenu');
    m.classList.toggle('open');
}
function closeMenu() {
    document.getElementById('mobileMenu').classList.remove('open');
}

// SCROLL REVEAL
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible') }
    })
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el => observer.observe(el));

// COUNTER ANIMATION
function animateCount(el, target, suffix = '') {
    const start = Date.now();
    const duration = 2000;
    const frame = () => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const val = Math.round(ease * target);
        el.textContent = val + (suffix || '');
        if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
}

const statObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            const count = parseInt(e.target.getAttribute('data-count'));
            const suffix = e.target.textContent.includes('+') ? '+' : '%';
            const isSuffix = e.target.textContent.includes('+') || e.target.textContent.includes('%');
            animateCount(e.target, count, isSuffix ? e.target.textContent.slice(-1) : '');
            statObs.unobserve(e.target);
        }
    })
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => statObs.observe(el));

// FAQ
function toggleFAQ(item) {
    const answer = item.querySelector('.faq-answer');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-answer').style.maxHeight = '0';
        i.querySelector('.faq-answer').style.padding = '0 1.5rem 0';
    });
    if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
    }
}

// BOOKING FORM
let appointments = [];
function submitForm() {
    const nome = document.getElementById('f-nome').value;
    const tel = document.getElementById('f-tel').value;
    const email = document.getElementById('f-email').value;
    const data = document.getElementById('f-data').value;
    const hora = document.getElementById('f-hora').value;
    if (!nome || !tel || !email) {
        alert('Por favor, preencha os campos obrigatórios (Nome, Telefone e Email).');
        return;
    }
    const apt = {
        nome,
        morada: document.getElementById('f-morada').value,
        idade: document.getElementById('f-idade').value,
        tel, email,
        motivo: document.getElementById('f-motivo').value,
        data: data || 'A confirmar',
        hora: hora || 'A confirmar',
        estado: 'Pendente'
    };
    appointments.push(apt);
    updateAdminTable();
    document.getElementById('bookingForm').style.display = 'none';
    document.getElementById('successMsg').style.display = 'block';
    showNotification();
}

function updateAdminTable() {
    const tbody = document.getElementById('adminTableBody');
    if (appointments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:2rem;color:var(--text3)">Nenhuma consulta agendada ainda.</td></tr>';
        return;
    }
    tbody.innerHTML = appointments.map((a, i) => `
    <tr>
      <td><strong>${a.nome}</strong></td>
      <td>${a.tel}</td>
      <td>${a.email}</td>
      <td>${a.motivo || '—'}</td>
      <td>${a.data}</td>
      <td>${a.hora}</td>
      <td><span class="admin-badge ${a.estado === 'Confirmado' ? 'confirmed' : 'pending'}" onclick="confirmApt(${i})" style="cursor:pointer">${a.estado}</span></td>
    </tr>
  `).join('');
}

function confirmApt(i) {
    appointments[i].estado = 'Confirmado';
    updateAdminTable();
}

function showNotification() {
    const notif = document.getElementById('notification');
    notif.classList.add('show');
    setTimeout(() => notif.classList.remove('show'), 4000);
}

// ADMIN PANEL
function toggleAdmin() {
    document.getElementById('adminPanel').classList.toggle('open');
}
document.getElementById('adminPanel').addEventListener('click', function (e) {
    if (e.target === this) this.classList.remove('open');
});

// CHAT
const chatReplies = [
    'Olá! Para agendar uma consulta, pode preencher o formulário no site ou contactar-nos pelo WhatsApp. 😊',
    'Oferecemos atendimento presencial e online. Qual prefere?',
    'As nossas sessões têm a duração de 50-60 minutos e são totalmente confidenciais.',
    'Trabalhamos com Terapia Cognitivo-Comportamental, Escuta Ativa e outras técnicas modernas.',
    'Estamos disponíveis de Segunda a Sexta (8h-18h) e Sábados (9h-13h).',
    'Pode contactar-nos pelo telefone +238 261 00 00 ou pelo WhatsApp. 😊',
];
let replyIdx = 0;

function toggleChat() {
    const w = document.getElementById('chatWindow');
    w.classList.toggle('open');
}

function sendChat() {
    const input = document.getElementById('chatInput');
    const msg = input.value.trim();
    if (!msg) return;
    const body = document.getElementById('chatBody');
    body.innerHTML += `<div class="chat-msg user">${msg}</div>`;
    input.value = '';
    body.scrollTop = body.scrollHeight;
    setTimeout(() => {
        const reply = chatReplies[replyIdx % chatReplies.length];
        replyIdx++;
        body.innerHTML += `<div class="chat-msg bot">${reply}</div>`;
        body.scrollTop = body.scrollHeight;
    }, 1000);
}

// NAV scroll effect
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 50) { nav.style.boxShadow = '0 4px 30px rgba(91,141,239,0.12)' }
    else { nav.style.boxShadow = 'none' }
});

// Smooth counter for hero stats (init)
setTimeout(() => {
    document.querySelectorAll('.hero-stat-num[data-count]').forEach(el => {
        const count = parseInt(el.getAttribute('data-count'));
        animateCount(el, count, '');
    });
}, 500);