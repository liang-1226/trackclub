/* 精准田径俱乐部 - 核心逻辑 */
const STORAGE_KEY = 'trackclub_data_v6';
let students = [], payments = [], culturePayments = [], leaves = [];
let editingStudentId = null, editingPaymentId = null, editingCultureId = null;
let studentFilter = 'all', studentPage = 1, STUDENTS_PER_PAGE = 15;
let paymentPage = 1, PAYMENTS_PER_PAGE = 15;
let cultureFilter = 'all', culturePage = 1, CULTURE_PER_PAGE = 15;
let leaveFilter = 'all', leavePage = 1, LEAVES_PER_PAGE = 15;

// ── 数据存储 ──
function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) { const d = JSON.parse(raw); students = d.students || []; payments = d.payments || []; culturePayments = d.culturePayments || []; leaves = d.leaves || [];
      // 迁移：给没有 active 字段的学员补上
      students.forEach(function(s) { if (s.active === undefined) s.active = true; });
      return; }
  } catch(e) {}
  // 从旧版迁移数据
  var migrated = false;
  try {
    var oldRaw = localStorage.getItem('trackclub_data_v5');
    if (oldRaw) {
      var oldD = JSON.parse(oldRaw);
      students = oldD.students || [];
      payments = oldD.payments || [];
      culturePayments = oldD.culturePayments || [];
      leaves = [];
      students.forEach(function(s) { if (s.active === undefined) s.active = true; });
      migrated = true;
    }
  } catch(e2) {}
  if (!migrated) {
    // 清除旧版本数据
    localStorage.removeItem('trackclub_data_v5');
    localStorage.removeItem('trackclub_data_v4');
    localStorage.removeItem('trackclub_data_v3');
    localStorage.removeItem('trackclub_data_v2');
    initDemoData();
  }
}

function initDemoData() {
  students = [
    {id:'stu_1',name:'王宏博',phone:'',event:'田径训练',note:'',active:true,createdAt:'2026-06-05'},
    {id:'stu_2',name:'王宏杰',phone:'',event:'田径训练',note:'',active:true,createdAt:'2026-06-09'},
    {id:'stu_3',name:'张圆晟',phone:'',event:'田径训练',note:'',active:true,createdAt:'2026-05-20'},
    {id:'stu_4',name:'白云升',phone:'',event:'田径训练',note:'',active:true,createdAt:'2026-06-01'},
    {id:'stu_5',name:'王浦瀚',phone:'',event:'田径训练',note:'',active:true,createdAt:'2026-04-22'},
    {id:'stu_6',name:'李佳泽',phone:'',event:'田径训练',note:'',active:true,createdAt:'2026-06-16'},
    {id:'stu_7',name:'范承昊',phone:'',event:'田径训练',note:'',active:true,createdAt:'2026-06-12'},
    {id:'stu_8',name:'于笑唯',phone:'',event:'田径训练',note:'',active:true,createdAt:'2026-05-20'},
    {id:'stu_9',name:'赵森',phone:'',event:'田径训练',note:'',active:true,createdAt:'2026-05-27'},
    {id:'stu_10',name:'马煜博',phone:'',event:'田径训练',note:'',active:true,createdAt:'2026-06-01'},
    {id:'stu_11',name:'胡曦元',phone:'',event:'田径训练',note:'',active:true,createdAt:'2026-06-01'},
    {id:'stu_12',name:'孙嘉诚',phone:'',event:'田径训练',note:'',active:true,createdAt:'2026-06-15'},
    {id:'stu_13',name:'赵则语',phone:'',event:'田径训练',note:'',active:true,createdAt:'2026-06-09'},
    {id:'stu_14',name:'彭帅凯',phone:'',event:'田径训练',note:'',active:true,createdAt:'2026-06-02'},
    {id:'stu_15',name:'邸薪宇',phone:'',event:'田径训练',note:'',active:true,createdAt:'2026-06-07'},
    {id:'stu_16',name:'闫硕',phone:'',event:'田径训练',note:'',active:true,createdAt:'2026-06-17'},
    {id:'stu_17',name:'肖培宇',phone:'',event:'田径训练',note:'',active:true,createdAt:'2026-06-02'},
    {id:'stu_18',name:'成坤',phone:'',event:'田径训练',note:'',active:true,createdAt:'2026-05-28'},
    {id:'stu_19',name:'张智博',phone:'',event:'田径训练',note:'',active:true,createdAt:'2026-06-14'},
    {id:'stu_20',name:'梁弘杰',phone:'',event:'田径训练',note:'',active:true,createdAt:'2026-06-06'},
    {id:'stu_21',name:'郑允祺',phone:'',event:'田径训练',note:'',active:true,createdAt:'2026-06-14'},
    {id:'stu_22',name:'周瑾',phone:'',event:'田径训练',note:'',active:true,createdAt:'2026-06-07'},
    {id:'stu_23',name:'李昊森',phone:'',event:'田径训练',note:'',active:true,createdAt:'2026-06-18'},
    {id:'stu_24',name:'孙浩博',phone:'',event:'田径训练',note:'',active:true,createdAt:'2026-06-17'},
    {id:'stu_25',name:'范金宇',phone:'',event:'田径训练',note:'',active:true,createdAt:'2026-05-21'},
    {id:'stu_26',name:'万子钦',phone:'',event:'田径训练',note:'',active:true,createdAt:'2026-06-20'},
    {id:'stu_27',name:'王境凯',phone:'',event:'田径训练',note:'',active:true,createdAt:'2026-06-11'},
    {id:'stu_28',name:'刘毅扬',phone:'',event:'田径训练',note:'',active:true,createdAt:'2026-06-03'}
  ];
  payments = [
    {id:'pay_1',studentId:'stu_1',amount:4200,date:'2026-06-05',days:30,leaveDays:0,expiry:'2026-07-05',note:''},
    {id:'pay_2',studentId:'stu_2',amount:3000,date:'2026-06-09',days:30,leaveDays:0,expiry:'2026-07-09',note:''},
    {id:'pay_3',studentId:'stu_3',amount:3000,date:'2026-05-20',days:31,leaveDays:0,expiry:'2026-06-20',note:''},
    {id:'pay_4',studentId:'stu_4',amount:4500,date:'2026-06-01',days:30,leaveDays:0,expiry:'2026-07-01',note:''},
    {id:'pay_5',studentId:'stu_5',amount:4500,date:'2026-04-22',days:30,leaveDays:0,expiry:'2026-05-22',note:''},
    {id:'pay_6',studentId:'stu_6',amount:3000,date:'2026-06-16',days:30,leaveDays:0,expiry:'2026-07-16',note:''},
    {id:'pay_7',studentId:'stu_7',amount:4500,date:'2026-06-12',days:30,leaveDays:0,expiry:'2026-07-12',note:''},
    {id:'pay_8',studentId:'stu_8',amount:4500,date:'2026-05-20',days:31,leaveDays:0,expiry:'2026-06-20',note:''},
    {id:'pay_9',studentId:'stu_9',amount:6500,date:'2026-05-27',days:45,leaveDays:0,expiry:'2026-07-11',note:''},
    {id:'pay_10',studentId:'stu_10',amount:13500,date:'2026-06-01',days:92,leaveDays:0,expiry:'2026-09-01',note:''},
    {id:'pay_11',studentId:'stu_11',amount:4000,date:'2026-06-01',days:30,leaveDays:0,expiry:'2026-07-01',note:''},
    {id:'pay_12',studentId:'stu_12',amount:5500,date:'2026-06-15',days:30,leaveDays:0,expiry:'2026-07-15',note:''},
    {id:'pay_13',studentId:'stu_13',amount:5500,date:'2026-06-09',days:30,leaveDays:0,expiry:'2026-07-09',note:''},
    {id:'pay_14',studentId:'stu_14',amount:5500,date:'2026-06-02',days:30,leaveDays:0,expiry:'2026-07-02',note:''},
    {id:'pay_15',studentId:'stu_15',amount:5000,date:'2026-06-07',days:30,leaveDays:0,expiry:'2026-07-07',note:''},
    {id:'pay_16',studentId:'stu_16',amount:3000,date:'2026-06-17',days:30,leaveDays:0,expiry:'2026-07-17',note:''},
    {id:'pay_17',studentId:'stu_17',amount:3000,date:'2026-06-02',days:30,leaveDays:0,expiry:'2026-07-02',note:''},
    {id:'pay_18',studentId:'stu_18',amount:5500,date:'2026-05-28',days:31,leaveDays:0,expiry:'2026-06-28',note:''},
    {id:'pay_19',studentId:'stu_19',amount:5500,date:'2026-06-14',days:30,leaveDays:0,expiry:'2026-07-14',note:''},
    {id:'pay_20',studentId:'stu_20',amount:5500,date:'2026-06-06',days:30,leaveDays:0,expiry:'2026-07-06',note:''},
    {id:'pay_21',studentId:'stu_21',amount:10000,date:'2026-06-14',days:30,leaveDays:0,expiry:'2026-07-14',note:''},
    {id:'pay_22',studentId:'stu_22',amount:3300,date:'2026-06-07',days:14,leaveDays:0,expiry:'2026-06-21',note:''},
    {id:'pay_23',studentId:'stu_23',amount:5000,date:'2026-06-18',days:30,leaveDays:0,expiry:'2026-07-18',note:''},
    {id:'pay_24',studentId:'stu_24',amount:2500,date:'2026-06-17',days:35,leaveDays:0,expiry:'2026-07-22',note:''},
    {id:'pay_25',studentId:'stu_25',amount:2500,date:'2026-05-21',days:31,leaveDays:0,expiry:'2026-06-21',note:''},
    {id:'pay_26',studentId:'stu_26',amount:2000,date:'2026-06-20',days:30,leaveDays:0,expiry:'2026-07-20',note:''},
    {id:'pay_27',studentId:'stu_27',amount:2000,date:'2026-06-11',days:30,leaveDays:0,expiry:'2026-07-11',note:''},
    {id:'pay_28',studentId:'stu_28',amount:2500,date:'2026-06-03',days:30,leaveDays:0,expiry:'2026-07-03',note:''}
  ];
  saveData();
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({students, payments, culturePayments, leaves}));
}

function today() {
  return new Date().toISOString().split('T')[0];
}

function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function daysBetween(d1, d2) {
  return Math.ceil((new Date(d2) - new Date(d1)) / 86400000);
}

function getActualExpiry(payment) {
  if (!payment.expiry) return null;
  const leave = payment.leaveDays || 0;
  if (leave <= 0) return payment.expiry;
  return addDays(payment.expiry, leave);
}

function getStudentStatus(studentId) {
  const sp = payments.filter(p => p.studentId === studentId);
  if (sp.length === 0) return {status:'none', actualExpiry:null, days:999};
  let latest = null;
  sp.forEach(p => {
    const ae = getActualExpiry(p);
    if (ae && (!latest || ae > latest)) latest = ae;
  });
  if (!latest) return {status:'none', actualExpiry:null, days:999};
  const diff = daysBetween(today(), latest);
  if (diff < 0) return {status:'expired', actualExpiry:latest, days:diff};
  if (diff <= 7) return {status:'expiring', actualExpiry:latest, days:diff};
  return {status:'active', actualExpiry:latest, days:diff};
}

// ── 工具函数 ──
function esc(s) {
  if (!s) return '';
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

function showToast(msg, type) {
  type = type || 'success';
  const c = document.getElementById('toastContainer');
  if (!c) return;
  const t = document.createElement('div');
  t.className = 'toast toast-' + type;
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(function() {
    t.style.opacity = '0';
    t.style.transition = 'opacity 0.3s';
    setTimeout(function(){ t.remove(); }, 300);
  }, 2500);
}

function renderPagination(containerId, totalPages, currentPage, onClick) {
  var c = document.getElementById(containerId);
  if (!c) return;
  if (totalPages <= 1) { c.innerHTML = ''; return; }
  var html = '';
  var disabled = currentPage <= 1 ? 'disabled' : '';
  html += '<button class="btn btn-sm btn-secondary" ' + disabled + ' onclick="(' + onClick.toString() + ')(' + (currentPage-1) + ')">‹</button>';
  for (var i = 1; i <= totalPages; i++) {
    if (totalPages > 7 && Math.abs(i - currentPage) > 2 && i !== 1 && i !== totalPages) {
      if (Math.abs(i - currentPage) === 3) html += '<span style="color:var(--text-muted);padding:0 4px;">…</span>';
      continue;
    }
    var cls = i === currentPage ? 'btn btn-sm btn-primary' : 'btn btn-sm btn-secondary';
    html += '<button class="' + cls + '" onclick="(' + onClick.toString() + ')(' + i + ')">' + i + '</button>';
  }
  disabled = currentPage >= totalPages ? 'disabled' : '';
  html += '<button class="btn btn-sm btn-secondary" ' + disabled + ' onclick="(' + onClick.toString() + ')(' + (currentPage+1) + ')">›</button>';
  c.innerHTML = html;
}

// ── 导航 ──
function switchPage(page) {
  document.querySelectorAll('.page').forEach(function(p) { p.style.display = 'none'; });
  var el = document.getElementById('page-' + page);
  if (el) el.style.display = '';
  document.querySelectorAll('.nav-item').forEach(function(n) {
    n.classList.toggle('active', n.dataset.page === page);
  });
  if (page === 'dashboard') renderDashboard();
  if (page === 'students') renderStudents();
  if (page === 'payments') renderPayments();
  if (page === 'culture') renderCulture();
  if (page === 'remind') renderRemind('expiring', document.querySelector('#page-remind .tab-btn'));
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebarOverlay').classList.toggle('open');
}

// ── 弹窗 ──
function openModal(id) {
  var el = document.getElementById(id);
  if (el) el.classList.add('open');
}
function closeModal(id) {
  var el = document.getElementById(id);
  if (el) el.classList.remove('open');
}

// ── Dashboard ──
function renderDashboard() {
  var total = students.length;
  var activeCount = 0, expiring = 0, expired = 0, inactiveCount = 0;
  var thisMonth = today().substring(0, 7);
  var monthIncome = 0;
  students.forEach(function(s) {
    if (s.active === false) { inactiveCount++; return; }
    var st = getStudentStatus(s.id);
    if (st.status === 'active') activeCount++;
    else if (st.status === 'expiring') expiring++;
    else if (st.status === 'expired') expired++;
  });
  payments.forEach(function(p) {
    if (p.date && p.date.startsWith(thisMonth)) monthIncome += p.amount || 0;
  });
  var cultureMonthIncome = 0;
  culturePayments.forEach(function(p) {
    if (p.date && p.date.startsWith(thisMonth)) cultureMonthIncome += p.amount || 0;
  });
  var totalLeave = 0;
  payments.forEach(function(p) { totalLeave += (p.leaveDays || 0); });
  var cultureTotalLeave = 0;
  culturePayments.forEach(function(p) { cultureTotalLeave += (p.leaveDays || 0); });
  var cultureActive = 0, cultureExpiring = 0, cultureExpired = 0;
  culturePayments.forEach(function(cp) {
    var ae = getCultureActualExpiry(cp);
    if (!ae) return;
    var diff = daysBetween(today(), ae);
    if (diff < 0) cultureExpired++;
    else if (diff <= 7) cultureExpiring++;
    else cultureActive++;
  });
  // 离营统计
  var currentAway = leaves.filter(function(l) { return !l.returnDate; }).length;
  var leaveEffectiveTotal = leaves.reduce(function(sum, l) { return sum + (l.effectiveDays || 0); }, 0);

  var grid = document.getElementById('statsGrid');
  if (grid) grid.innerHTML =
    '<div class="stat-card orange"><div class="stat-label">学员总数</div><div class="stat-value orange">' + total + '</div><div class="stat-sub">训练有效 ' + activeCount + ' · 待提醒 ' + expiring + '</div></div>' +
    '<div class="stat-card green"><div class="stat-label">训练有效会员</div><div class="stat-value green">' + activeCount + '</div><div class="stat-sub">占比 ' + (total ? Math.round(activeCount/total*100) : 0) + '%</div></div>' +
    '<div class="stat-card red"><div class="stat-label">待提醒</div><div class="stat-value red">' + (expiring + expired) + '</div><div class="stat-sub">即将到期 ' + expiring + ' · 已过期 ' + expired + '</div></div>' +
    '<div class="stat-card" style="border-color:var(--text-muted);"><div class="stat-label">已离队</div><div class="stat-value" style="color:var(--text-muted);">' + inactiveCount + '</div><div class="stat-sub">已停止到期提醒</div></div>' +
    '<div class="stat-card blue"><div class="stat-label">本月训练收入</div><div class="stat-value blue">¥' + monthIncome.toLocaleString() + '</div><div class="stat-sub">' + payments.filter(function(p){return p.date&&p.date.startsWith(thisMonth)}).length + ' 笔缴费</div></div>' +
    '<div class="stat-card purple"><div class="stat-label">训练请假天数</div><div class="stat-value purple">' + totalLeave + '</div><div class="stat-sub">所有学员请假合计</div></div>' +
    '<div class="stat-card yellow"><div class="stat-label">文化课本月收入</div><div class="stat-value yellow">¥' + cultureMonthIncome.toLocaleString() + '</div><div class="stat-sub">有效 ' + cultureActive + ' · 待续费 ' + cultureExpiring + '</div></div>' +
    '<div class="stat-card orange"><div class="stat-label">文化课请假天数</div><div class="stat-value orange">' + cultureTotalLeave + '</div><div class="stat-sub">文化课请假合计</div></div>' +
    '<div class="stat-card yellow"><div class="stat-label">当前离营人数</div><div class="stat-value yellow">' + currentAway + '</div><div class="stat-sub">有效请假天数累计 ' + leaveEffectiveTotal + '</div></div>';

  renderDonut(activeCount, expiring, expired, total - activeCount - expiring - expired - inactiveCount);
  renderBarChart();
  var badge = document.getElementById('remindBadge');
  if (badge) badge.textContent = (expiring + expired) > 0 ? (expiring + expired) : '';
  // 离营动态
  var leaveInfoDiv = document.getElementById('leaveDashboardInfo');
  if (leaveInfoDiv) {
    var html = '';
    var awayList = leaves.filter(function(l) { return !l.returnDate; });
    if (awayList.length > 0) {
      html += '<div style="margin-bottom:10px;"><b style="color:var(--accent-yellow);">🏕️ 当前离营（' + awayList.length + '人）</b></div>';
      awayList.forEach(function(l) {
        var s = students.find(function(x) { return x.id === l.studentId; });
        var days = l.leaveDate <= today() ? daysBetween(l.leaveDate, today()) + 1 : 0;
        html += '<div style="display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:1px solid var(--border);font-size:0.85rem;">' +
          '<span>' + esc(s ? s.name : '（已删）') + '</span>' +
          '<span style="color:var(--text-muted);">' + l.leaveDate + ' 起 · ' + (days > 0 ? days + '天' : '未开始') + '</span>' +
          '</div>';
      });
    }
    var returnedList = leaves.filter(function(l) { return l.returnDate; }).sort(function(a,b) { return b.returnDate.localeCompare(a.returnDate); }).slice(0, 5);
    if (returnedList.length > 0) {
      html += '<div style="margin-top:14px;margin-bottom:8px;"><b style="color:var(--accent-green);">✅ 最近回营</b></div>';
      returnedList.forEach(function(l) {
        var s = students.find(function(x) { return x.id === l.studentId; });
        html += '<div style="display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:1px solid var(--border);font-size:0.85rem;">' +
          '<span>' + esc(s ? s.name : '（已删）') + '</span>' +
          '<span style="color:var(--text-muted);">' + l.leaveDate + ' ~ ' + l.returnDate + ' · 请假' + (l.effectiveDays||0) + '天</span>' +
          '</div>';
      });
    }
    if (html === '') html = '<span style="color:var(--text-muted);">暂无离营记录</span>';
    leaveInfoDiv.innerHTML = html;
  }
}

function renderDonut(a, e, x, n) {
  var canvas = document.getElementById('donutCanvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var cx = 80, cy = 80, r = 60;
  ctx.clearRect(0, 0, 160, 160);
  var total = a + e + x + n;
  if (total === 0) {
    ctx.fillStyle = '#2e3348';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#5c6080';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('暂无数据', cx, cy + 5);
  } else {
    var slices = [{v:a,color:'#22c55e'},{v:e,color:'#eab308'},{v:x,color:'#ef4444'},{v:n,color:'#5c6080'}];
    var start = -Math.PI / 2;
    slices.forEach(function(s) {
      if (s.v === 0) return;
      var end = start + (s.v / total) * Math.PI * 2;
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, end);
      ctx.closePath();
      ctx.fill();
      start = end;
    });
    ctx.fillStyle = '#1a1d27';
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.55, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#eef0f6';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(total, cx, cy + 6);
  }
  var legend = document.getElementById('donutLegend');
  if (legend) legend.innerHTML =
    '<div style="display:flex;flex-direction:column;gap:8px;font-size:0.85rem;">' +
    '<div style="display:flex;align-items:center;gap:8px;"><div style="width:10px;height:10px;border-radius:3px;background:#22c55e;"></div>有效 ' + a + '</div>' +
    '<div style="display:flex;align-items:center;gap:8px;"><div style="width:10px;height:10px;border-radius:3px;background:#eab308;"></div>即将到期 ' + e + '</div>' +
    '<div style="display:flex;align-items:center;gap:8px;"><div style="width:10px;height:10px;border-radius:3px;background:#ef4444;"></div>已过期 ' + x + '</div>' +
    '<div style="display:flex;align-items:center;gap:8px;"><div style="width:10px;height:10px;border-radius:3px;background:#5c6080;"></div>未缴费 ' + n + '</div></div>';
}

function renderBarChart() {
  var months = [];
  for (var i = 5; i >= 0; i--) {
    var d = new Date();
    d.setMonth(d.getMonth() - i);
    months.push(d.toISOString().substring(0, 7));
  }
  var totals = months.map(function(m) {
    return payments.filter(function(p) { return p.date && p.date.startsWith(m); }).reduce(function(s, p) { return s + (p.amount || 0); }, 0);
  });
  var max = Math.max.apply(null, totals.concat([1]));
  var container = document.getElementById('barChart');
  if (!container) return;
  container.innerHTML = '';
  months.forEach(function(m, idx) {
    var h = Math.max(4, (totals[idx] / max) * 140);
    var col = document.createElement('div');
    col.style.cssText = 'flex:1;display:flex;flex-direction:column;align-items:center;height:100%;justify-content:flex-end;';
    col.innerHTML =
      '<div style="font-size:0.7rem;color:var(--text-muted);margin-bottom:4px;">' + (totals[idx] ? totals[idx].toLocaleString() : '') + '</div>' +
      '<div style="width:100%;max-width:40px;height:' + h + 'px;border-radius:4px 4px 0 0;background:linear-gradient(0deg,var(--accent-orange),rgba(249,115,22,0.3));"></div>' +
      '<div style="font-size:0.7rem;color:var(--text-muted);margin-top:6px;">' + m.substring(5) + '月</div>';
    container.appendChild(col);
  });
}

// ── 学员管理 ──
function renderStudents() {
  var q = (document.getElementById('studentSearch') || {value:''}).value || '';
  q = q.trim().toLowerCase();
  var list = students.filter(function(s) {
    if (q && s.name.toLowerCase().indexOf(q) === -1 && (s.phone || '').indexOf(q) === -1) return false;
    if (studentFilter === 'left') {
      // 只显示离队学员
      if (s.active !== false) return false;
    } else if (studentFilter !== 'all') {
      // 训练状态筛选：只筛活跃学员
      if (s.active === false) return false;
      var st = getStudentStatus(s.id);
      if (studentFilter === 'active' && st.status !== 'active') return false;
      if (studentFilter === 'expiring' && st.status !== 'expiring') return false;
      if (studentFilter === 'expired' && st.status !== 'expired') return false;
    }
    return true;
  });
  // 排序：活跃学员在前，离队学员在后
  list.sort(function(a, b) {
    if (a.active === false && b.active !== false) return 1;
    if (a.active !== false && b.active === false) return -1;
    return 0;
  });
  var totalPages = Math.max(1, Math.ceil(list.length / STUDENTS_PER_PAGE));
  if (studentPage > totalPages) studentPage = totalPages;
  var pageList = list.slice((studentPage - 1) * STUDENTS_PER_PAGE, studentPage * STUDENTS_PER_PAGE);

  var tbody = document.getElementById('studentsBody');
  if (!tbody) return;
  tbody.innerHTML = pageList.map(function(s) {
    var isLeft = s.active === false;
    var st = getStudentStatus(s.id);
    var leaveTotal = payments.filter(function(p) { return p.studentId === s.id; }).reduce(function(sum, p) { return sum + (p.leaveDays || 0); }, 0);
    var stClass = isLeft ? 'status-none' : 'status-' + st.status;
    var stText = isLeft ? '🚫 已离队' : ({active:'有效',expiring:'即将到期',expired:'已过期',none:'未缴费'})[st.status] || '';
    var stColor = isLeft ? 'var(--text-muted)' : (st.status==='active'?'var(--accent-green)':st.status==='expiring'?'var(--accent-yellow)':'var(--accent-red)');
    var expiryStr = isLeft ? '-' : (st.actualExpiry ? st.actualExpiry + ' (' + (st.days < 0 ? '已过期' + Math.abs(st.days) + '天' : '剩' + st.days + '天') + ')' : '-');
    var rowStyle = isLeft ? 'opacity:0.5;' : '';
    var toggleBtn = isLeft ?
      '<button class="btn btn-sm btn-green" onclick="toggleStudentActive(\'' + s.id + '\')">复课</button>' :
      '<button class="btn btn-sm btn-orange-outline" onclick="toggleStudentActive(\'' + s.id + '\')">离队</button>';

    // 离营状态
    var activeLeave = leaves.find(function(l) { return l.studentId === s.id && !l.returnDate; });
    var leaveHtml = '';
    if (activeLeave) {
      var todayDate = today();
      var leaveDays = activeLeave.leaveDate <= todayDate ? daysBetween(activeLeave.leaveDate, todayDate) + 1 : 0;
      var effectiveDays = getLeaveEffectiveDays(leaveDays);
      leaveHtml = '<div style="min-width:120px;">' +
        '<div style="color:var(--accent-yellow);font-weight:600;font-size:0.85rem;">🏕️ 离营中</div>' +
        '<div style="font-size:0.75rem;color:var(--text-muted);margin:2px 0;">' + esc(activeLeave.leaveDate) + ' 起</div>' +
        (effectiveDays > 0 ? '<div style="font-size:0.75rem;color:var(--accent-purple);">请假' + effectiveDays + '天</div>' : '<div style="font-size:0.75rem;color:var(--text-muted);">未满2天</div>') +
        '<button class="btn btn-sm btn-green" style="margin-top:4px;" onclick="openReturnLeaveModal(\'' + activeLeave.id + '\')">✅ 回营</button>' +
        '</div>';
    } else {
      var lastLeave = leaves.filter(function(l) { return l.studentId === s.id && l.returnDate; }).sort(function(a,b) { return b.returnDate.localeCompare(a.returnDate); })[0];
      leaveHtml = '<div style="min-width:120px;">' +
        '<div style="color:var(--text-muted);font-size:0.85rem;">—</div>';
      if (lastLeave) {
        leaveHtml += '<div style="font-size:0.72rem;color:var(--text-muted);margin:2px 0;">上次：' + lastLeave.leaveDate + ' ~ ' + lastLeave.returnDate + '</div>' +
          '<div style="font-size:0.72rem;color:var(--accent-purple);">请假' + (lastLeave.effectiveDays||0) + '天</div>';
      }
      leaveHtml += '<button class="btn btn-sm btn-orange-outline" style="margin-top:4px;" onclick="openStartLeaveModal(\'' + s.id + '\')">🏕️ 离营</button>' +
        '</div>';
    }

    return '<tr style="' + rowStyle + '">' +
      '<td><b>' + esc(s.name) + '</b></td>' +
      '<td>' + esc(s.phone || '-') + '</td>' +
      '<td>' + esc(s.event || '-') + '</td>' +
      '<td><span class="' + stClass + '"><span class="status-dot" style="background:' + stColor + '"></span>' + stText + '</span></td>' +
      '<td>' + expiryStr + '</td>' +
      '<td>' + (isLeft ? '-' : (leaveTotal > 0 ? '<span class="leave-badge">📅 请假' + leaveTotal + '天</span>' : '-')) + '</td>' +
      '<td>' + leaveHtml + '</td>' +
      '<td><div class="action-btns">' +
        '<button class="btn btn-sm btn-secondary" onclick="openStudentModal(\'' + s.id + '\')">编辑</button>' +
        '<button class="btn btn-sm btn-blue" onclick="openPaymentModal(null,\'' + s.id + '\')">缴费</button>' +
        toggleBtn +
        '<button class="btn btn-sm btn-danger" onclick="deleteStudent(\'' + s.id + '\')">删除</button>' +
      '</div></td>' +
    '</tr>';
  }).join('');

  renderPagination('studentsPagination', totalPages, studentPage, function(n) { studentPage = n; renderStudents(); });
}

function filterStudents(f, btn) {
  studentFilter = f;
  studentPage = 1;
  document.querySelectorAll('#page-students .filter-btn').forEach(function(b) { b.classList.remove('active'); });
  btn.classList.add('active');
  renderStudents();
}

function toggleStudentActive(id) {
  var s = students.find(function(x) { return x.id === id; });
  if (!s) return;
  if (s.active === false) {
    s.active = true;
    showToast(s.name + ' 已复课，将恢复到期提醒');
  } else {
    s.active = false;
    showToast(s.name + ' 已标记离队，到期提醒已停止');
  }
  saveData();
  renderStudents();
  renderDashboard();
  renderRemind('expiring', document.querySelector('#page-remind .tab-btn.active') || document.querySelector('#page-remind .tab-btn'));
}

function openStudentModal(id) {
  editingStudentId = id || null;
  var title = document.getElementById('studentModalTitle');
  if (title) title.textContent = id ? '编辑学员' : '新增学员';
  if (id) {
    var s = students.find(function(x) { return x.id === id; });
    if (s) {
      document.getElementById('sName').value = s.name;
      document.getElementById('sPhone').value = s.phone || '';
      document.getElementById('sEvent').value = s.event || '';
      document.getElementById('sNote').value = s.note || '';
    }
  } else {
    ['sName','sPhone','sNote'].forEach(function(id) { document.getElementById(id).value = ''; });
    document.getElementById('sEvent').value = '';
  }
  openModal('studentModal');
}

function saveStudent() {
  var name = (document.getElementById('sName').value || '').trim();
  if (!name) { showToast('请输入学员姓名', 'error'); return; }
  if (editingStudentId) {
    var s = students.find(function(x) { return x.id === editingStudentId; });
    s.name = name;
    s.phone = (document.getElementById('sPhone').value || '').trim();
    s.event = document.getElementById('sEvent').value;
    s.note = (document.getElementById('sNote').value || '').trim();
  } else {
    students.push({
      id: 's' + Date.now(),
      name: name,
      phone: (document.getElementById('sPhone').value || '').trim(),
      event: document.getElementById('sEvent').value,
      note: (document.getElementById('sNote').value || '').trim(),
      active: true,
      createdAt: today()
    });
  }
  saveData();
  closeModal('studentModal');
  renderStudents();
  renderDashboard();
  showToast(editingStudentId ? '学员已更新' : '学员已添加');
}

function deleteStudent(id) {
  if (!confirm('确定删除该学员？相关缴费记录也会删除！')) return;
  students = students.filter(function(s) { return s.id !== id; });
  payments = payments.filter(function(p) { return p.studentId !== id; });
  culturePayments = culturePayments.filter(function(p) { return p.studentId !== id; });
  leaves = leaves.filter(function(l) { return l.studentId !== id; });
  saveData();
  renderStudents();
  renderDashboard();
  showToast('学员已删除');
}

// ── 缴费记录 ──
function renderPayments() {
  var q = (document.getElementById('paymentSearch') || {value:''}).value || '';
  q = q.trim().toLowerCase();
  var list = payments.filter(function(p) {
    var s = students.find(function(x) { return x.id === p.studentId; });
    return !q || (s && s.name.toLowerCase().indexOf(q) >= 0);
  }).sort(function(a, b) { return (b.date || '').localeCompare(a.date || ''); });

  var totalPages = Math.max(1, Math.ceil(list.length / PAYMENTS_PER_PAGE));
  if (paymentPage > totalPages) paymentPage = totalPages;
  var pageList = list.slice((paymentPage - 1) * PAYMENTS_PER_PAGE, paymentPage * PAYMENTS_PER_PAGE);

  var tbody = document.getElementById('paymentsBody');
  if (!tbody) return;
  tbody.innerHTML = pageList.map(function(p) {
    var s = students.find(function(x) { return x.id === p.studentId; });
    var actualExpiry = getActualExpiry(p);
    var daily = p.days > 0 ? (p.amount / p.days).toFixed(1) : '-';
    var leaveInfo = (p.leaveDays || 0) > 0 ? '<span class="leave-badge">请假' + p.leaveDays + '天</span>' : '-';
    return '<tr>' +
      '<td><b>' + esc(s ? s.name : '（已删）') + '</b></td>' +
      '<td style="color:var(--accent-orange);font-weight:700;">¥' + (p.amount || 0).toLocaleString() + '</td>' +
      '<td>' + esc(p.date || '-') + '</td>' +
      '<td>' + (p.days || '-') + '天</td>' +
      '<td>' + leaveInfo + '</td>' +
      '<td><b>' + esc(actualExpiry || '-') + '</b>' + (p.leaveDays > 0 ? '<br><span style="font-size:0.75rem;color:var(--text-muted);">原：' + esc(p.expiry || '-') + '</span>' : '') + '</td>' +
      '<td>' + (daily !== '-' ? '¥' + daily : '-') + '</td>' +
      '<td>' + esc(p.note || '-') + '</td>' +
      '<td><div class="action-btns">' +
        '<button class="btn btn-sm btn-secondary" onclick="openPaymentModal(\'' + p.id + '\')">编辑</button>' +
        '<button class="btn btn-sm btn-danger" onclick="deletePayment(\'' + p.id + '\')">删除</button>' +
      '</div></td>' +
    '</tr>';
  }).join('');

  renderPagination('paymentsPagination', totalPages, paymentPage, function(n) { paymentPage = n; renderPayments(); });
}

function openPaymentModal(id, sid) {
  editingPaymentId = id || null;
  var title = document.getElementById('paymentModalTitle');
  if (title) title.textContent = id ? '编辑缴费' : '新增缴费';
  var sel = document.getElementById('pStudentId');
  if (sel) {
    sel.innerHTML = students.map(function(s) { return '<option value="' + s.id + '">' + esc(s.name) + '</option>'; }).join('');
  }
  if (sid && sel) sel.value = sid;
  if (id) {
    var p = payments.find(function(x) { return x.id === id; });
    if (p) {
      if (sel) sel.value = p.studentId;
      document.getElementById('pAmount').value = p.amount;
      document.getElementById('pDate').value = p.date;
      document.getElementById('pDays').value = p.days || '';
      document.getElementById('pLeaveDays').value = p.leaveDays || 0;
      document.getElementById('pNote').value = p.note || '';
      document.getElementById('pMonths').value = '';
    }
  } else {
    document.getElementById('pAmount').value = '';
    document.getElementById('pDate').value = today();
    document.getElementById('pDays').value = '';
    document.getElementById('pLeaveDays').value = 0;
    document.getElementById('pNote').value = '';
    document.getElementById('pMonths').value = '';
  }
  updateDailyCalc();
  updateExpiryPreview();
  openModal('paymentModal');
}

function switchDurationMode(mode, btn) {
  document.getElementById('durationDayPanel').style.display = mode === 'day' ? '' : 'none';
  document.getElementById('durationMonthPanel').style.display = mode === 'month' ? '' : 'none';
  document.getElementById('durationDayBtn').classList.toggle('active', mode === 'day');
  document.getElementById('durationMonthBtn').classList.toggle('active', mode === 'month');
}

function setDays(n, btn) {
  document.getElementById('pDays').value = n;
  var btns = document.querySelectorAll('#durationDayPanel .filter-btn');
  btns.forEach(function(b) { b.classList.remove('active'); });
  if (btn) btn.classList.add('active');
  updateDailyCalc();
  updateExpiryPreview();
}

function monthsToDays() {
  var m = parseInt(document.getElementById('pMonths').value) || 0;
  document.getElementById('pDays').value = m * 30;
  updateDailyCalc();
  updateExpiryPreview();
}

function updateDailyCalc() {
  var amt = parseFloat(document.getElementById('pAmount').value) || 0;
  var days = parseInt(document.getElementById('pDays').value) || 0;
  var el = document.getElementById('dailyCost');
  if (el) el.textContent = days > 0 ? ('¥' + (amt / days).toFixed(1) + ' / 天') : '¥0 / 天';
}

function updateExpiryPreview() {
  var date = document.getElementById('pDate').value;
  var days = parseInt(document.getElementById('pDays').value) || 0;
  var leave = parseInt(document.getElementById('pLeaveDays').value) || 0;
  var preview = document.getElementById('expiryPreview');
  if (!date || days <= 0) { preview.style.display = 'none'; return; }
  var original = addDays(date, days);
  var actual = leave > 0 ? addDays(original, leave) : original;
  document.getElementById('epOriginal').textContent = original;
  document.getElementById('epLeave').textContent = leave;
  document.getElementById('epActual').textContent = actual;
  preview.style.display = '';
}

function savePayment() {
  var studentId = document.getElementById('pStudentId').value;
  var amount = parseFloat(document.getElementById('pAmount').value) || 0;
  var date = document.getElementById('pDate').value;
  var days = parseInt(document.getElementById('pDays').value) || 0;
  var leaveDays = parseInt(document.getElementById('pLeaveDays').value) || 0;
  if (!studentId || !amount || !date || !days) { showToast('请填写完整缴费信息', 'error'); return; }
  var expiry = addDays(date, days);
  if (editingPaymentId) {
    var p = payments.find(function(x) { return x.id === editingPaymentId; });
    p.studentId = studentId;
    p.amount = amount;
    p.date = date;
    p.days = days;
    p.leaveDays = leaveDays;
    p.expiry = expiry;
    p.note = (document.getElementById('pNote').value || '').trim();
  } else {
    payments.push({
      id: 'p' + Date.now(),
      studentId: studentId,
      amount: amount,
      date: date,
      days: days,
      leaveDays: leaveDays,
      expiry: expiry,
      note: (document.getElementById('pNote').value || '').trim()
    });
  }
  saveData();
  closeModal('paymentModal');
  renderPayments();
  renderDashboard();
  renderStudents();
  showToast(editingPaymentId ? '缴费记录已更新' : '缴费记录已添加');
}

function deletePayment(id) {
  if (!confirm('确定删除该缴费记录？')) return;
  payments = payments.filter(function(p) { return p.id !== id; });
  saveData();
  renderPayments();
  renderDashboard();
  renderStudents();
  showToast('缴费记录已删除');
}

// ── 到期提醒 ──
function renderRemind(tab, btn) {
  if (!btn) btn = document.querySelector('#page-remind .tab-btn');
  document.querySelectorAll('#page-remind .tab-btn').forEach(function(b) { b.classList.remove('active'); });
  if (btn) btn.classList.add('active');
  var list = [];
  students.forEach(function(s) {
    // 离队学员不参与到期提醒
    if (s.active === false) return;
    var st = getStudentStatus(s.id);
    if (tab === 'expiring' && st.status === 'expiring') list.push({s:s, st:st});
    if (tab === 'expired' && st.status === 'expired') list.push({s:s, st:st});
  });
  list.sort(function(a, b) { return a.st.days - b.st.days; });

  var container = document.getElementById('remindContent');
  if (!container) return;
  if (list.length === 0) {
    container.innerHTML = '<div style="text-align:center;padding:60px;color:var(--text-muted);">暂无' + (tab === 'expiring' ? '即将到期' : '已过期') + '的学员</div>';
    return;
  }
  container.innerHTML = '<div class="table-wrap"><table><thead><tr><th>姓名</th><th>项目</th><th>实际到期日</th><th>剩余/过期天数</th><th>请假</th><th>操作</th></tr></thead><tbody>' +
    list.map(function(item) {
      var s = item.s, st = item.st;
      var leaveTotal = payments.filter(function(p) { return p.studentId === s.id; }).reduce(function(sum, p) { return sum + (p.leaveDays || 0); }, 0);
      return '<tr>' +
        '<td><b>' + esc(s.name) + '</b></td>' +
        '<td>' + esc(s.event || '-') + '</td>' +
        '<td><b>' + esc(st.actualExpiry) + '</b></td>' +
        '<td><span class="status-' + st.status + '">' + (st.days < 0 ? '已过期' + Math.abs(st.days) + '天' : '剩' + st.days + '天') + '</span></td>' +
        '<td>' + (leaveTotal > 0 ? '<span class="leave-badge">' + leaveTotal + '天</span>' : '-') + '</td>' +
        '<td><button class="btn btn-sm btn-orange-outline" onclick="openPaymentModal(null,\'' + s.id + '\')">续费</button></td>' +
      '</tr>';
    }).join('') + '</tbody></table></div>';
}

// ── 文化课缴费 ──
function getCultureActualExpiry(cp) {
  if (!cp.expiry) return null;
  var leave = cp.leaveDays || 0;
  if (leave <= 0) return cp.expiry;
  return addDays(cp.expiry, leave);
}

function getCultureStatus(cp) {
  var ae = getCultureActualExpiry(cp);
  if (!ae) return {status:'none', actualExpiry:null, days:999};
  var diff = daysBetween(today(), ae);
  if (diff < 0) return {status:'expired', actualExpiry:ae, days:diff};
  if (diff <= 7) return {status:'expiring', actualExpiry:ae, days:diff};
  return {status:'active', actualExpiry:ae, days:diff};
}

function renderSubjectTags(subjectStr) {
  if (!subjectStr) return '<span style="color:var(--text-muted);">-</span>';
  var parts = subjectStr.split('、');
  return parts.map(function(sub) {
    var isScience = ['数学','物理','化学','生物'].indexOf(sub) >= 0;
    var isLiberal = ['语文','英语','政治','历史','地理'].indexOf(sub) >= 0;
    var color = isScience ? 'var(--accent-blue)' : isLiberal ? 'var(--accent-yellow)' : 'var(--accent-green)';
    var bg = isScience ? 'var(--accent-blue-dim)' : isLiberal ? 'var(--accent-yellow-dim)' : 'var(--accent-green-dim)';
    return '<span style="display:inline-block;padding:2px 8px;border-radius:4px;font-size:0.78rem;font-weight:600;color:' + color + ';background:' + bg + ';margin:2px 0 2px 0;">' + esc(sub) + '</span>';
  }).join(' ');
}

function renderCulture() {
  // 统计卡片
  var totalCP = culturePayments.length;
  var cActive = 0, cExpiring = 0, cExpired = 0;
  var cThisMonth = today().substring(0, 7);
  var cMonthIncome = 0;
  culturePayments.forEach(function(cp) {
    var st = getCultureStatus(cp);
    if (st.status === 'active') cActive++;
    else if (st.status === 'expiring') cExpiring++;
    else if (st.status === 'expired') cExpired++;
    if (cp.date && cp.date.startsWith(cThisMonth)) cMonthIncome += cp.amount || 0;
  });
  var cTotalLeave = culturePayments.reduce(function(sum, cp) { return sum + (cp.leaveDays || 0); }, 0);
  var cTotalIncome = culturePayments.reduce(function(sum, cp) { return sum + (cp.amount || 0); }, 0);

  var sgrid = document.getElementById('cultureStatsGrid');
  if (sgrid) sgrid.innerHTML =
    '<div class="stat-card orange"><div class="stat-label">缴费总条数</div><div class="stat-value orange">' + totalCP + '</div><div class="stat-sub">有效 ' + cActive + ' · 待续费 ' + cExpiring + '</div></div>' +
    '<div class="stat-card green"><div class="stat-label">有效课程</div><div class="stat-value green">' + cActive + '</div><div class="stat-sub">占比 ' + (totalCP ? Math.round(cActive/totalCP*100) : 0) + '%</div></div>' +
    '<div class="stat-card blue"><div class="stat-label">本月收入</div><div class="stat-value blue">¥' + cMonthIncome.toLocaleString() + '</div><div class="stat-sub">累计 ¥' + cTotalIncome.toLocaleString() + '</div></div>' +
    '<div class="stat-card purple"><div class="stat-label">请假总课时</div><div class="stat-value purple">' + cTotalLeave + '</div><div class="stat-sub">所有文化课请假合计</div></div>';

  // 表格
  var q = (document.getElementById('cultureSearch') || {value:''}).value || '';
  q = q.trim().toLowerCase();
  var list = culturePayments.filter(function(cp) {
    var s = students.find(function(x) { return x.id === cp.studentId; });
    if (q && !(s && s.name.toLowerCase().indexOf(q) >= 0)) return false;
    if (cultureFilter !== 'all') {
      var st = getCultureStatus(cp);
      if (cultureFilter === 'active' && st.status !== 'active') return false;
      if (cultureFilter === 'expiring' && st.status !== 'expiring') return false;
      if (cultureFilter === 'expired' && st.status !== 'expired') return false;
    }
    return true;
  }).sort(function(a, b) { return (b.date || '').localeCompare(a.date || ''); });

  var totalPages = Math.max(1, Math.ceil(list.length / CULTURE_PER_PAGE));
  if (culturePage > totalPages) culturePage = totalPages;
  var pageList = list.slice((culturePage - 1) * CULTURE_PER_PAGE, culturePage * CULTURE_PER_PAGE);

  var tbody = document.getElementById('cultureBody');
  if (!tbody) return;
  tbody.innerHTML = pageList.map(function(cp) {
    var s = students.find(function(x) { return x.id === cp.studentId; });
    var ae = getCultureActualExpiry(cp);
    var daily = cp.days > 0 ? (cp.amount / cp.days).toFixed(1) : '-';
    var st = getCultureStatus(cp);
    var stClass = 'status-' + st.status;
    var stText = ({active:'有效',expiring:'即将到期',expired:'已过期',none:'未缴费'})[st.status] || '';
    var leaveInfo = (cp.leaveDays || 0) > 0 ? '<span class="leave-badge">请假' + cp.leaveDays + '天</span>' : '-';
    return '<tr>' +
      '<td><b>' + esc(s ? s.name : '（已删）') + '</b></td>' +
      '<td>' + renderSubjectTags(cp.subject) + '</td>' +
      '<td style="color:var(--accent-orange);font-weight:700;">¥' + (cp.amount || 0).toLocaleString() + '</td>' +
      '<td>' + esc(cp.date || '-') + '</td>' +
      '<td>' + (cp.days || '-') + '天</td>' +
      '<td>' + leaveInfo + '</td>' +
      '<td><b>' + esc(ae || '-') + '</b>' + (cp.leaveDays > 0 ? '<br><span style="font-size:0.75rem;color:var(--text-muted);">原：' + esc(cp.expiry || '-') + '</span>' : '') + '</td>' +
      '<td>' + (daily !== '-' ? '¥' + daily : '-') + '</td>' +
      '<td><span class="' + stClass + '"><span class="status-dot" style="background:' + (st.status==='active'?'var(--accent-green)':st.status==='expiring'?'var(--accent-yellow)':'var(--accent-red)') + '"></span>' + stText + '</span></td>' +
      '<td><div class="action-btns">' +
        '<button class="btn btn-sm btn-secondary" onclick="openCultureModal(\'' + cp.id + '\')">编辑</button>' +
        '<button class="btn btn-sm btn-danger" onclick="deleteCulture(\'' + cp.id + '\')">删除</button>' +
      '</div></td>' +
    '</tr>';
  }).join('');

  renderPagination('culturePagination', totalPages, culturePage, function(n) { culturePage = n; renderCulture(); });
}

function filterCulture(f, btn) {
  cultureFilter = f;
  culturePage = 1;
  document.querySelectorAll('#page-culture .filter-btn').forEach(function(b) { b.classList.remove('active'); });
  btn.classList.add('active');
  renderCulture();
}

function getSubjectValue() {
  var checks = document.querySelectorAll('.cSubjectCheck');
  var selected = [];
  checks.forEach(function(c) { if (c.checked) selected.push(c.value); });
  return selected.join('、');
}

function setSubjectValues(subjectStr) {
  // Alias for setSubjectChecks
  setSubjectChecks(subjectStr);
}

function setSubjectChecks(subjectStr) {
  var checks = document.querySelectorAll('.cSubjectCheck');
  checks.forEach(function(c) { c.checked = false; });
  if (!subjectStr) { onSubjectCheck(); return; }
  var parts = subjectStr.split('、');
  checks.forEach(function(c) {
    if (parts.indexOf(c.value) >= 0) c.checked = true;
  });
  onSubjectCheck();
}

function onSubjectCheck() {
  var checks = document.querySelectorAll('.cSubjectCheck');
  var preview = document.getElementById('cSubjectPreview');
  var selected = [];
  checks.forEach(function(c) { if (c.checked) selected.push(c.value); });
  if (preview) {
    if (selected.length === 0) {
      preview.textContent = '未选择科目';
      preview.style.color = 'var(--text-muted)';
    } else {
      preview.textContent = '已选：' + selected.join(' + ');
      preview.style.color = 'var(--accent-yellow)';
    }
  }
}

function openCultureModal(id) {
  editingCultureId = id || null;
  var title = document.getElementById('cultureModalTitle');
  if (title) title.textContent = id ? '编辑文化课缴费' : '新增文化课缴费';
  var sel = document.getElementById('cStudentId');
  if (sel) sel.innerHTML = students.map(function(s) { return '<option value="' + s.id + '">' + esc(s.name) + '</option>'; }).join('');
  if (id) {
    var cp = culturePayments.find(function(x) { return x.id === id; });
    if (cp) {
      if (sel) sel.value = cp.studentId;
      setSubjectChecks(cp.subject || '');
      document.getElementById('cAmount').value = cp.amount;
      document.getElementById('cDate').value = cp.date;
      document.getElementById('cDays').value = cp.days || '';
      document.getElementById('cLeaveDays').value = cp.leaveDays || 0;
      document.getElementById('cNote').value = cp.note || '';
      document.getElementById('cMonths').value = '';
    }
  } else {
    setSubjectChecks('');
    document.getElementById('cAmount').value = '';
    document.getElementById('cDate').value = today();
    document.getElementById('cDays').value = '';
    document.getElementById('cLeaveDays').value = 0;
    document.getElementById('cNote').value = '';
    document.getElementById('cMonths').value = '';
  }
  updateCultureCalc();
  updateCultureExpiry();
  openModal('cultureModal');
}

function switchCultureDuration(mode, btn) {
  document.getElementById('cDurationDayPanel').style.display = mode === 'day' ? '' : 'none';
  document.getElementById('cDurationMonthPanel').style.display = mode === 'month' ? '' : 'none';
  document.getElementById('cDurationDayBtn').classList.toggle('active', mode === 'day');
  document.getElementById('cDurationMonthBtn').classList.toggle('active', mode === 'month');
}

function setCultureDays(n, btn) {
  document.getElementById('cDays').value = n;
  var btns = document.querySelectorAll('#cDurationDayPanel .filter-btn');
  btns.forEach(function(b) { b.classList.remove('active'); });
  if (btn) btn.classList.add('active');
  updateCultureCalc();
  updateCultureExpiry();
}

function cultureMonthsToDays() {
  var m = parseInt(document.getElementById('cMonths').value) || 0;
  document.getElementById('cDays').value = m * 30;
  updateCultureCalc();
  updateCultureExpiry();
}

function updateCultureCalc() {
  var amt = parseFloat(document.getElementById('cAmount').value) || 0;
  var days = parseInt(document.getElementById('cDays').value) || 0;
  var el = document.getElementById('cDailyCost');
  if (el) el.textContent = days > 0 ? ('¥' + (amt / days).toFixed(1) + ' / 天') : '¥0 / 天';
}

function updateCultureExpiry() {
  var date = document.getElementById('cDate').value;
  var days = parseInt(document.getElementById('cDays').value) || 0;
  var leave = parseInt(document.getElementById('cLeaveDays').value) || 0;
  var preview = document.getElementById('cExpiryPreview');
  if (!date || days <= 0) { preview.style.display = 'none'; return; }
  var original = addDays(date, days);
  var actual = leave > 0 ? addDays(original, leave) : original;
  document.getElementById('cepOriginal').textContent = original;
  document.getElementById('cepLeave').textContent = leave;
  document.getElementById('cepActual').textContent = actual;
  preview.style.display = '';
}

function saveCulture() {
  var studentId = document.getElementById('cStudentId').value;
  var subject = getSubjectValue();
  var amount = parseFloat(document.getElementById('cAmount').value) || 0;
  var date = document.getElementById('cDate').value;
  var days = parseInt(document.getElementById('cDays').value) || 0;
  var leaveDays = parseInt(document.getElementById('cLeaveDays').value) || 0;
  var note = (document.getElementById('cNote').value || '').trim();
  if (!studentId || !subject || !amount || !date || !days) { showToast('请填写完整信息（学员、科目、金额、日期、天数）', 'error'); return; }
  var expiry = addDays(date, days);
  if (editingCultureId) {
    var cp = culturePayments.find(function(x) { return x.id === editingCultureId; });
    cp.studentId = studentId;
    cp.subject = subject;
    cp.amount = amount;
    cp.date = date;
    cp.days = days;
    cp.leaveDays = leaveDays;
    cp.expiry = expiry;
    cp.note = note;
  } else {
    culturePayments.push({
      id: 'cp' + Date.now(),
      studentId: studentId,
      subject: subject,
      amount: amount,
      date: date,
      days: days,
      leaveDays: leaveDays,
      expiry: expiry,
      note: note
    });
  }
  saveData();
  closeModal('cultureModal');
  renderCulture();
  renderDashboard();
  showToast(editingCultureId ? '文化课缴费已更新' : '文化课缴费已添加');
}

function deleteCulture(id) {
  if (!confirm('确定删除该文化课缴费记录？')) return;
  culturePayments = culturePayments.filter(function(cp) { return cp.id !== id; });
  saveData();
  renderCulture();
  renderDashboard();
  showToast('文化课缴费已删除');
}

function exportCultureExcel() {
  var data = culturePayments.map(function(cp) {
    var s = students.find(function(x) { return x.id === cp.studentId; });
    var ae = getCultureActualExpiry(cp);
    var st = getCultureStatus(cp);
    return {'学员姓名':s?s.name:'','科目':cp.subject,'缴费金额':cp.amount,'缴费日期':cp.date,'课程天数':cp.days,'请假天数':cp.leaveDays || 0,'原到期日':cp.expiry,'实际到期日':ae || '','状态':({active:'有效',expiring:'即将到期',expired:'已过期',none:'未缴费'})[st.status],'备注':cp.note};
  });
  downloadExcel(data, '文化课缴费记录_' + today());
}

// ── 离营请假 ──
function getLeaveEffectiveDays(totalDays) {
  // 前2天不计，第3天起计入（含第3天）
  // 例如：请假2天 → 0天；请假3天 → 1天；请假5天 → 3天
  if (totalDays < 3) return 0;
  return totalDays - 2;
}

function renderLeaves() {
  // 统计
  var awayList = leaves.filter(function(l) { return !l.returnDate; });
  var returnedList = leaves.filter(function(l) { return l.returnDate; });
  var awayCount = awayList.length;
  var totalEffective = 0;
  leaves.forEach(function(l) {
    if (l.effectiveDays) totalEffective += l.effectiveDays;
  });
  var thisMonthAway = 0;
  var thisMonthStr = today().substring(0, 7);
  awayList.forEach(function(l) {
    if (l.leaveDate && l.leaveDate.substring(0, 7) === thisMonthStr) thisMonthAway++;
  });

  var sgrid = document.getElementById('leaveStatsGrid');
  if (sgrid) sgrid.innerHTML =
    '<div class="stat-card orange"><div class="stat-label">当前离营人数</div><div class="stat-value orange">' + awayCount + '</div><div class="stat-sub">正在请假中</div></div>' +
    '<div class="stat-card purple"><div class="stat-label">累计有效请假天数</div><div class="stat-value purple">' + totalEffective + '</div><div class="stat-sub">已扣除2天宽限期</div></div>' +
    '<div class="stat-card green"><div class="stat-label">已回营记录</div><div class="stat-value green">' + returnedList.length + '</div><div class="stat-sub">历史请假人次</div></div>' +
    '<div class="stat-card blue"><div class="stat-label">本月离营人次</div><div class="stat-value blue">' + thisMonthAway + '</div><div class="stat-sub">' + thisMonthStr + '</div></div>';

  // 更新侧边栏徽章
  var badge = document.getElementById('leaveBadge');
  if (badge) badge.textContent = awayCount > 0 ? awayCount : '';

  // 列表
  var q = (document.getElementById('leaveSearch') || {value:''}).value || '';
  q = q.trim().toLowerCase();
  var list = leaves.filter(function(l) {
    var s = students.find(function(x) { return x.id === l.studentId; });
    if (q && !(s && s.name.toLowerCase().indexOf(q) >= 0)) return false;
    if (leaveFilter === 'away' && l.returnDate) return false;
    if (leaveFilter === 'returned' && !l.returnDate) return false;
    return true;
  }).sort(function(a, b) {
    // 离营中排前面，按离营日期倒序
    if (!a.returnDate && b.returnDate) return -1;
    if (a.returnDate && !b.returnDate) return 1;
    return (b.leaveDate || '').localeCompare(a.leaveDate || '');
  });

  var totalPages = Math.max(1, Math.ceil(list.length / LEAVES_PER_PAGE));
  if (leavePage > totalPages) leavePage = totalPages;
  var pageList = list.slice((leavePage - 1) * LEAVES_PER_PAGE, leavePage * LEAVES_PER_PAGE);

  var tbody = document.getElementById('leavesBody');
  if (!tbody) return;
  tbody.innerHTML = pageList.map(function(l) {
    var s = students.find(function(x) { return x.id === l.studentId; });
    var isAway = !l.returnDate;
    var totalDays = l.totalDays;
    var effectiveDays = l.effectiveDays;
    if (isAway) {
      // 还在离营中，实时计算
      var todayDate = today();
      if (l.leaveDate <= todayDate) {
        totalDays = daysBetween(l.leaveDate, todayDate) + 1;
        effectiveDays = getLeaveEffectiveDays(totalDays);
      } else {
        totalDays = 0;
        effectiveDays = 0;
      }
    }
    var statusStyle = isAway ? 'color:var(--accent-yellow);font-weight:600;' : 'color:var(--accent-green);font-weight:600;';
    var statusText = isAway ? '🏕️ 离营中' : '✅ 已回营 (' + esc(l.returnDate) + ')';
    var effectiveText = effectiveDays > 0 ? '<b style="color:var(--accent-purple);">' + effectiveDays + ' 天</b>' : '<span style="color:var(--text-muted);">0 天</span>';
    var actionBtns = '';
    if (isAway) {
      actionBtns = '<button class="btn btn-sm btn-green" onclick="returnLeave(\'' + l.id + '\')">✅ 已回营</button>' +
        '<button class="btn btn-sm btn-danger" onclick="deleteLeave(\'' + l.id + '\')">删除</button>';
    } else {
      actionBtns = '<button class="btn btn-sm btn-danger" onclick="deleteLeave(\'' + l.id + '\')">删除</button>';
    }
    var rowStyle = isAway ? 'background:rgba(234,179,8,0.05);' : '';
    var totalDaysText = totalDays > 0 ? totalDays + ' 天' : '-';
    if (isAway && totalDays >= 1) totalDaysText = '<b style="color:var(--accent-yellow);">' + totalDays + ' 天</b>';
    return '<tr style="' + rowStyle + '">' +
      '<td><b>' + esc(s ? s.name : '（已删）') + '</b></td>' +
      '<td>' + esc(l.leaveDate || '-') + '</td>' +
      '<td>' + (isAway ? '<span style="color:var(--text-muted);">—</span>' : esc(l.returnDate)) + '</td>' +
      '<td>' + totalDaysText + '</td>' +
      '<td>' + effectiveText + '</td>' +
      '<td><span style="' + statusStyle + '">' + statusText + '</span></td>' +
      '<td><div class="action-btns">' + actionBtns + '</div></td>' +
    '</tr>';
  }).join('');

  if (list.length === 0 && pageList.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--text-muted);">暂无离营请假记录</td></tr>';
  }

  renderPagination('leavesPagination', totalPages, leavePage, function(n) { leavePage = n; renderLeaves(); });
}

function filterLeaves(f, btn) {
  leaveFilter = f;
  leavePage = 1;
  document.querySelectorAll('#page-leaves .filter-btn').forEach(function(b) { b.classList.remove('active'); });
  btn.classList.add('active');
  renderLeaves();
}

function openLeaveModal() {
  // 只列出活跃学员
  var sel = document.getElementById('lStudentId');
  if (sel) {
    var activeStudents = students.filter(function(s) { return s.active !== false; });
    sel.innerHTML = activeStudents.map(function(s) { return '<option value="' + s.id + '">' + esc(s.name) + '</option>'; }).join('');
  }
  document.getElementById('lLeaveDate').value = today();
  openModal('leaveModal');
}

function startLeave() {
  var studentId = document.getElementById('lStudentId').value;
  var leaveDate = document.getElementById('lLeaveDate').value;
  if (!studentId) { showToast('请选择学员', 'error'); return; }
  if (!leaveDate) { showToast('请选择离营日期', 'error'); return; }
  // 检查该学员是否已经在离营中
  var existing = leaves.find(function(l) { return l.studentId === studentId && !l.returnDate; });
  if (existing) { showToast('该学员当前已在离营中，请先标记回营', 'error'); return; }
  var s = students.find(function(x) { return x.id === studentId; });
  leaves.push({
    id: 'leave_' + Date.now(),
    studentId: studentId,
    leaveDate: leaveDate,
    returnDate: null,
    totalDays: 0,
    effectiveDays: 0
  });
  saveData();
  closeModal('leaveModal');
  renderLeaves();
  renderDashboard();
  showToast(s ? s.name + ' 已标记离营（' + leaveDate + '）' : '已标记离营');
}

function returnLeave(id) {
  var l = leaves.find(function(x) { return x.id === id; });
  if (!l) return;
  var todayDate = today();
  var totalDays = daysBetween(l.leaveDate, todayDate) + 1;
  if (totalDays < 1) totalDays = 1;
  var effectiveDays = getLeaveEffectiveDays(totalDays);
  l.returnDate = todayDate;
  l.totalDays = totalDays;
  l.effectiveDays = effectiveDays;
  saveData();
  renderStudents();
  renderDashboard();
  var s = students.find(function(x) { return x.id === l.studentId; });
  var msg = '已标记回营，离营共 ' + totalDays + ' 天';
  if (effectiveDays > 0) {
    msg += '，计入请假 ' + effectiveDays + ' 天（已扣2天宽限）';
  } else {
    msg += '，未超过2天不计入请假';
  }
  showToast(msg);
}

function deleteLeave(id) {
  if (!confirm('确定删除该离营记录？')) return;
  leaves = leaves.filter(function(l) { return l.id !== id; });
  saveData();
  renderStudents();
  renderDashboard();
  showToast('离营记录已删除');
}


// ── 离营管理（学员页面集成）──
function openStartLeaveModal(studentId) {
  var s = students.find(function(x) { return x.id === studentId; });
  if (!s) { showToast('学员不存在', 'error'); return; }
  // 检查是否已在离营中
  var existing = leaves.find(function(l) { return l.studentId === studentId && !l.returnDate; });
  if (existing) { showToast('该学员当前已在离营中', 'error'); return; }
  document.getElementById('startLeaveTitle').textContent = '标记离营 — ' + s.name;
  document.getElementById('startLeaveStudentName').textContent = s.name;
  document.getElementById('startLeaveDate').value = today();
  // 存当前操作的学员ID
  window._leaveStudentId = studentId;
  openModal('startLeaveModal');
}

function confirmStartLeave() {
  var studentId = window._leaveStudentId;
  var leaveDate = document.getElementById('startLeaveDate').value;
  if (!leaveDate) { showToast('请选择离营日期', 'error'); return; }
  var s = students.find(function(x) { return x.id === studentId; });
  leaves.push({
    id: 'leave_' + Date.now(),
    studentId: studentId,
    leaveDate: leaveDate,
    returnDate: null,
    totalDays: 0,
    effectiveDays: 0
  });
  saveData();
  closeModal('startLeaveModal');
  renderStudents();
  renderDashboard();
  showToast((s ? s.name : '学员') + ' 已标记离营（' + leaveDate + '）');
}

function openReturnLeaveModal(leaveId) {
  var l = leaves.find(function(x) { return x.id === leaveId; });
  if (!l) { showToast('记录不存在', 'error'); return; }
  var s = students.find(function(x) { return x.id === l.studentId; });
  document.getElementById('returnLeaveStudentName').textContent = s ? s.name : '';
  document.getElementById('returnLeaveStartDate').textContent = l.leaveDate;
  document.getElementById('returnLeaveDate').value = today();
  // 存当前操作的离营记录ID
  window._returnLeaveId = leaveId;
  updateReturnLeaveCalc();
  openModal('returnLeaveModal');
}

function updateReturnLeaveCalc() {
  var leaveId = window._returnLeaveId;
  var returnDate = document.getElementById('returnLeaveDate').value;
  if (!leaveId || !returnDate) { document.getElementById('returnLeaveCalc').style.display = 'none'; return; }
  var l = leaves.find(function(x) { return x.id === leaveId; });
  if (!l) return;
  var totalDays = daysBetween(l.leaveDate, returnDate) + 1;
  if (totalDays < 1) totalDays = 1;
  var effectiveDays = getLeaveEffectiveDays(totalDays);
  document.getElementById('rlTotalDays').textContent = totalDays + ' 天';
  document.getElementById('rlEffectiveDays').textContent = effectiveDays + ' 天';
  document.getElementById('returnLeaveCalc').style.display = 'block';
}

function confirmReturnLeave() {
  var leaveId = window._returnLeaveId;
  var returnDate = document.getElementById('returnLeaveDate').value;
  if (!returnDate) { showToast('请选择回营日期', 'error'); return; }
  var l = leaves.find(function(x) { return x.id === leaveId; });
  if (!l) return;
  var totalDays = daysBetween(l.leaveDate, returnDate) + 1;
  if (totalDays < 1) totalDays = 1;
  var effectiveDays = getLeaveEffectiveDays(totalDays);
  l.returnDate = returnDate;
  l.totalDays = totalDays;
  l.effectiveDays = effectiveDays;
  saveData();
  closeModal('returnLeaveModal');
  renderStudents();
  renderDashboard();
  var s = students.find(function(x) { return x.id === l.studentId; });
  var msg = '已标记回营，离营共 ' + totalDays + ' 天';
  if (effectiveDays > 0) {
    msg += '，计入请假 ' + effectiveDays + ' 天（已扣2天宽限）';
  } else {
    msg += '，未超过2天不计入请假';
  }
  showToast(msg);
}


function exportLeavesExcel() {
  var data = leaves.map(function(l) {
    var s = students.find(function(x) { return x.id === l.studentId; });
    var totalDays = l.totalDays;
    var effectiveDays = l.effectiveDays;
    if (!l.returnDate) {
      var todayDate = today();
      if (l.leaveDate <= todayDate) {
        totalDays = daysBetween(l.leaveDate, todayDate) + 1;
        effectiveDays = getLeaveEffectiveDays(totalDays);
      } else {
        totalDays = 0;
        effectiveDays = 0;
      }
    }
    return {
      '学员姓名': s ? s.name : '',
      '训练项目': s ? s.event : '',
      '离营日期': l.leaveDate,
      '回营日期': l.returnDate || '离营中',
      '离营总天数': totalDays,
      '计入请假天数': effectiveDays,
      '状态': l.returnDate ? '已回营' : '离营中'
    };
  });
  downloadExcel(data, '离营请假记录_' + today());
}
function handleExcelImport(event) {
  var file = event.target.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    try {
      var wb = XLSX.read(e.target.result, {type:'array'});
      var ws = wb.Sheets[wb.SheetNames[0]];
      var data = XLSX.utils.sheet_to_json(ws, {defval:''});
      if (data.length === 0) { showToast('Excel 文件没有数据', 'error'); return; }
      importExcelData(data);
    } catch(err) { showToast('文件解析失败：' + err.message, 'error'); }
  };
  reader.readAsArrayBuffer(file);
  event.target.value = '';
}

function importExcelData(rows) {
  var colMap = {};
  var sample = rows[0];
  Object.keys(sample).forEach(function(k) {
    var low = k.replace(/\s/g, '').toLowerCase();
    if (['姓名','名字','学员姓名','学生姓名'].indexOf(k) >= 0) colMap.name = k;
    else if (['手机','手机号','联系电话','电话'].indexOf(k) >= 0) colMap.phone = k;
    else if (['金额','缴费金额','交费金额','费用'].indexOf(k) >= 0) colMap.amount = k;
    else if (['开始日期','缴费日期','交费日期','日期'].indexOf(k) >= 0) colMap.startDate = k;
    else if (['结束日期','到期日期','有效期至','截止日期'].indexOf(k) >= 0) colMap.endDate = k;
    else if (['训练天数','天数','时长'].indexOf(k) >= 0) colMap.days = k;
    else if (low.indexOf('请假') >= 0) colMap.leaveDays = k;
    else if (['项目','训练项目','运动项目'].indexOf(k) >= 0) colMap.event = k;
    else if (['备注','说明'].indexOf(k) >= 0) colMap.note = k;
  });

  var added = 0, payCount = 0;
  rows.forEach(function(row) {
    var name = (row[colMap.name] || '').toString().trim();
    if (!name) return;
    var student = students.find(function(s) { return s.name === name; });
    if (!student) {
      student = {
        id: 's' + Date.now() + Math.random().toString(36).substr(2, 4),
        name: name,
        phone: (row[colMap.phone] || '').toString(),
        event: (row[colMap.event] || '').toString(),
        note: (row[colMap.note] || '').toString(),
        active: true,
        createdAt: today()
      };
      students.push(student);
      added++;
    }
    var startDate = parseDate(row[colMap.startDate]);
    var endDate = parseDate(row[colMap.endDate]);
    var amount = parseFloat(row[colMap.amount]) || 0;
    var days = parseInt(row[colMap.days]) || 0;
    var leaveDays = parseInt(row[colMap.leaveDays]) || 0;
    if (!days && startDate && endDate) {
      days = Math.max(1, daysBetween(startDate, endDate));
    }
    if (startDate && amount > 0) {
      var expiry = days > 0 ? addDays(startDate, days) : (endDate || '');
      payments.push({
        id: 'p' + Date.now() + Math.random().toString(36).substr(2, 4),
        studentId: student.id,
        amount: amount,
        date: startDate,
        days: days,
        leaveDays: leaveDays,
        expiry: expiry,
        note: (row[colMap.note] || '').toString()
      });
      payCount++;
    }
  });
  saveData();
  renderDashboard();
  renderStudents();
  renderPayments();
  showToast('导入完成！新增学员 ' + added + ' 人，新增缴费 ' + payCount + ' 条');
}

function parseDate(val) {
  if (!val) return '';
  if (val instanceof Date) return val.toISOString().split('T')[0];
  var s = val.toString().trim();
  var m = s.match(/(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/);
  if (m) return m[1] + '-' + m[2].padStart(2, '0') + '-' + m[3].padStart(2, '0');
  return s;
}

function exportStudentsExcel() {
  var data = students.map(function(s) {
    var st = getStudentStatus(s.id);
    var leaveTotal = payments.filter(function(p) { return p.studentId === s.id; }).reduce(function(sum, p) { return sum + (p.leaveDays || 0); }, 0);
    return {'姓名':s.name,'手机号':s.phone,'训练项目':s.event,'状态':({active:'有效',expiring:'即将到期',expired:'已过期',none:'未缴费'})[st.status],'实际到期日':st.actualExpiry || '','请假总天数':leaveTotal,'备注':s.note};
  });
  downloadExcel(data, '学员列表_' + today());
}

function exportPaymentsExcel() {
  var data = payments.map(function(p) {
    var s = students.find(function(x) { return x.id === p.studentId; });
    return {'学员姓名':s?s.name:'','缴费金额':p.amount,'缴费日期':p.date,'训练天数':p.days,'请假天数':p.leaveDays || 0,'原到期日':p.expiry,'实际到期日':getActualExpiry(p),'备注':p.note};
  });
  downloadExcel(data, '缴费记录_' + today());
}

function exportFullExcel() {
  var wb = XLSX.utils.book_new();
  var sData = students.map(function(s) {
    var st = getStudentStatus(s.id);
    var leaveTotal = payments.filter(function(p) { return p.studentId === s.id; }).reduce(function(sum, p) { return sum + (p.leaveDays || 0); }, 0);
    return {'姓名':s.name,'手机号':s.phone,'训练项目':s.event,'状态':({active:'有效',expiring:'即将到期',expired:'已过期',none:'未缴费'})[st.status],'实际到期日':st.actualExpiry || '','请假总天数':leaveTotal,'备注':s.note};
  });
  var pData = payments.map(function(p) {
    var s = students.find(function(x) { return x.id === p.studentId; });
    return {'学员姓名':s?s.name:'','缴费金额':p.amount,'缴费日期':p.date,'训练天数':p.days,'请假天数':p.leaveDays || 0,'原到期日':p.expiry,'实际到期日':getActualExpiry(p),'备注':p.note};
  });
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sData), '学员列表');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(pData), '训练缴费');
  var cData = culturePayments.map(function(cp) {
    var s = students.find(function(x) { return x.id === cp.studentId; });
    return {'学员姓名':s?s.name:'','科目':cp.subject,'缴费金额':cp.amount,'缴费日期':cp.date,'课程天数':cp.days,'请假天数':cp.leaveDays || 0,'原到期日':cp.expiry,'实际到期日':getCultureActualExpiry(cp),'备注':cp.note};
  });
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(cData), '文化课缴费');
  var lData = leaves.map(function(l) {
    var s = students.find(function(x) { return x.id === l.studentId; });
    var td = l.totalDays, ed = l.effectiveDays;
    if (!l.returnDate && l.leaveDate <= today()) {
      td = daysBetween(l.leaveDate, today()) + 1;
      ed = getLeaveEffectiveDays(td);
    }
    return {'学员姓名':s?s.name:'','训练项目':s?s.event:'','离营日期':l.leaveDate,'回营日期':l.returnDate || '离营中','离营总天数':td,'计入请假天数':ed,'状态':l.returnDate ? '已回营' : '离营中'};
  });
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(lData), '离营请假');
  XLSX.writeFile(wb, '精准田径俱乐部_完整数据_' + today() + '.xlsx');
}

function downloadExcel(data, filename) {
  var ws = XLSX.utils.json_to_sheet(data);
  var wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, filename + '.xlsx');
}

function backupJSON() {
  var blob = new Blob([JSON.stringify({students:students, payments:payments, culturePayments:culturePayments, leaves:leaves}, null, 2)], {type:'application/json'});
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'trackclub_backup_' + today() + '.json';
  a.click();
  showToast('JSON 备份已下载');
}

// ── 发布给学生 ──
function generateStudentPage() {
  var pubData = {
    club: '精准田径俱乐部',
    updateTime: today(),
    students: students.map(function(s) {
      var leaveTotal = payments.filter(function(p) { return p.studentId === s.id; }).reduce(function(sum, p) { return sum + (p.leaveDays || 0); }, 0);
      var st = getStudentStatus(s.id);
      var payList = payments.filter(function(p) { return p.studentId === s.id; }).map(function(p) {
        return {
          amount: p.amount,
          date: p.date,
          days: p.days,
          leaveDays: p.leaveDays || 0,
          originalExpiry: p.expiry,
          actualExpiry: getActualExpiry(p),
          note: p.note
        };
      });
      var cultureLeaveTotal = culturePayments.filter(function(cp) { return cp.studentId === s.id; }).reduce(function(sum, cp) { return sum + (cp.leaveDays || 0); }, 0);
      var culturePayList = culturePayments.filter(function(cp) { return cp.studentId === s.id; }).map(function(cp) {
        var cst = getCultureStatus(cp);
        return {
          subject: cp.subject,
          amount: cp.amount,
          date: cp.date,
          days: cp.days,
          leaveDays: cp.leaveDays || 0,
          originalExpiry: cp.expiry,
          actualExpiry: getCultureActualExpiry(cp),
          status: cst.status,
          note: cp.note
        };
      });
      return { name: s.name, event: s.event, active: s.active !== false, status: st.status, actualExpiry: st.actualExpiry, daysLeft: st.days, leaveTotal: leaveTotal, payments: payList, cultureLeaveTotal: cultureLeaveTotal, culturePayments: culturePayList };
    })
  };
  var htmlContent = getStudentPageHTML(pubData);
  var blob = new Blob([htmlContent], {type:'text/html'});
  var url = URL.createObjectURL(blob);
  var link = document.getElementById('downloadLink');
  if (link) {
    link.href = url;
    link.download = 'query.html';
    link.textContent = '点击下载 query.html';
    link.style.color = 'var(--accent-orange)';
    link.style.fontSize = '0.85rem';
  }
  var area = document.getElementById('downloadArea');
  if (area) area.style.display = '';
  showToast('查询页面已生成，点击下载');
}

function getStudentPageHTML(pubDataObj) {
  // Embed the HTML template as base64 to avoid quote escaping issues
  var json = JSON.stringify(pubDataObj).replace(/<\//g, '<\\/');
  var b64 =
        "PCFET0NUWVBFIGh0bWw+CjxodG1sIGxhbmc9InpoLUNOIj4KPGhlYWQ+CjxtZXRhIGNoYXJzZXQ9IlVURi04Ij4KPG1ldGEgbmFt" +
        "ZT0idmlld3BvcnQiIGNvbnRlbnQ9IndpZHRoPWRldmljZS13aWR0aCxpbml0aWFsLXNjYWxlPTEuMCxtYXhpbXVtLXNjYWxlPTEu" +
        "MCx1c2VyLXNjYWxhYmxlPW5vIj4KPHRpdGxlPueyvuWHhueUsOW+hOS/seS5kOmDqCDCtyDlrablkZjmn6Xor6I8L3RpdGxlPgo8" +
        "c3R5bGU+CiosKjo6YmVmb3JlLCo6OmFmdGVye2JveC1zaXppbmc6Ym9yZGVyLWJveDttYXJnaW46MDtwYWRkaW5nOjA7fQo6cm9v" +
        "dHstLWJnLXByaW1hcnk6IzBmMTExNzstLWJnLWNhcmQ6IzIyMjYzOTstLWJnLWlucHV0OiMxOTFjMjg7LS1ib3JkZXI6IzJlMzM0" +
        "ODstLXRleHQtcHJpbWFyeTojZWVmMGY2Oy0tdGV4dC1zZWNvbmRhcnk6IzhiOTBhNTstLXRleHQtbXV0ZWQ6IzVjNjA4MDstLWFj" +
        "Y2VudC1vcmFuZ2U6I2Y5NzMxNjstLWFjY2VudC1vcmFuZ2UtZGltOnJnYmEoMjQ5LDExNSwyMiwwLjE1KTstLWFjY2VudC1ibHVl" +
        "OiMzYjgyZjY7LS1hY2NlbnQtZ3JlZW46IzIyYzU1ZTstLWFjY2VudC1yZWQ6I2VmNDQ0NDstLWFjY2VudC15ZWxsb3c6I2VhYjMw" +
        "ODstLWFjY2VudC1wdXJwbGU6I2E4NTVmNzstLXJhZGl1czoxNHB4Oy0tcmFkaXVzLXNtOjlweDt9Cmh0bWx7Zm9udC1zaXplOjE2" +
        "cHg7LXdlYmtpdC10ZXh0LXNpemUtYWRqdXN0OjEwMCU7fQpib2R5e2ZvbnQtZmFtaWx5Oi1hcHBsZS1zeXN0ZW0sQmxpbmtNYWNT" +
        "eXN0ZW1Gb250LCJTZWdvZSBVSSIsIlBpbmdGYW5nIFNDIiwiSGlyYWdpbm8gU2FucyBHQiIsIk1pY3Jvc29mdCBZYUhlaSIsc2Fu" +
        "cy1zZXJpZjtiYWNrZ3JvdW5kOnZhcigtLWJnLXByaW1hcnkpO2NvbG9yOnZhcigtLXRleHQtcHJpbWFyeSk7bWluLWhlaWdodDox" +
        "MDB2aDt9Ci5oZWFkZXJ7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTYwZGVnLCMxYTFkMjcgMCUsIzIyMjYzOSAxMDAlKTti" +
        "b3JkZXItYm90dG9tOjFweCBzb2xpZCB2YXIoLS1ib3JkZXIpO3BhZGRpbmc6MzZweCAyMHB4IDQ4cHg7dGV4dC1hbGlnbjpjZW50" +
        "ZXI7cG9zaXRpb246cmVsYXRpdmU7b3ZlcmZsb3c6aGlkZGVuO30KLmhlYWRlcjo6YmVmb3Jle2NvbnRlbnQ6Jyc7cG9zaXRpb246" +
        "YWJzb2x1dGU7dG9wOjA7bGVmdDowO3JpZ2h0OjA7Ym90dG9tOjA7YmFja2dyb3VuZDpyYWRpYWwtZ3JhZGllbnQoZWxsaXBzZSBh" +
        "dCA1MCUgMCUscmdiYSgyNDksMTE1LDIyLDAuMTIpIDAlLHRyYW5zcGFyZW50IDcwJSk7fQouaGVhZGVyLWNvbnRlbnR7cG9zaXRp" +
        "b246cmVsYXRpdmU7ei1pbmRleDoxO30KLmhlYWRlci1pY29ue2ZvbnQtc2l6ZTozcmVtO21hcmdpbi1ib3R0b206MTBweDt9Ci5o" +
        "ZWFkZXItY2x1Yntmb250LXNpemU6MS4zNXJlbTtmb250LXdlaWdodDo4MDA7Y29sb3I6dmFyKC0tYWNjZW50LW9yYW5nZSk7bGV0" +
        "dGVyLXNwYWNpbmc6MXB4O30KLmhlYWRlci1zdWJ7Zm9udC1zaXplOjAuODJyZW07Y29sb3I6dmFyKC0tdGV4dC1tdXRlZCk7bWFy" +
        "Z2luLXRvcDo1cHg7bGV0dGVyLXNwYWNpbmc6MnB4O30KLnNlYXJjaC13cmFwe21heC13aWR0aDo0ODBweDttYXJnaW46LTI4cHgg" +
        "YXV0byAwO3BhZGRpbmc6MCAxNnB4O3Bvc2l0aW9uOnJlbGF0aXZlO3otaW5kZXg6MTA7fQouc2VhcmNoLWNhcmR7YmFja2dyb3Vu" +
        "ZDp2YXIoLS1iZy1jYXJkKTtib3JkZXI6MXB4IHNvbGlkIHZhcigtLWJvcmRlcik7Ym9yZGVyLXJhZGl1czp2YXIoLS1yYWRpdXMp" +
        "O3BhZGRpbmc6MjJweCAyMHB4O2JveC1zaGFkb3c6MCA4cHggMzJweCByZ2JhKDAsMCwwLDAuNSk7fQouc2VhcmNoLWNhcmQgbGFi" +
        "ZWx7ZGlzcGxheTpibG9jaztmb250LXNpemU6MC44MnJlbTtmb250LXdlaWdodDo2MDA7Y29sb3I6dmFyKC0tdGV4dC1zZWNvbmRh" +
        "cnkpO21hcmdpbi1ib3R0b206MTBweDt9Ci5zZWFyY2gtcm93e2Rpc3BsYXk6ZmxleDtnYXA6OHB4O30KLnNlYXJjaC1pbnB1dHtm" +
        "bGV4OjE7cGFkZGluZzoxM3B4IDE2cHg7YmFja2dyb3VuZDp2YXIoLS1iZy1pbnB1dCk7Ym9yZGVyOjFweCBzb2xpZCB2YXIoLS1i" +
        "b3JkZXIpO2JvcmRlci1yYWRpdXM6dmFyKC0tcmFkaXVzLXNtKTtjb2xvcjp2YXIoLS10ZXh0LXByaW1hcnkpO2ZvbnQtc2l6ZTox" +
        "cmVtO291dGxpbmU6bm9uZTt0cmFuc2l0aW9uOmJvcmRlci1jb2xvciAwLjJzOy13ZWJraXQtYXBwZWFyYW5jZTpub25lO30KLnNl" +
        "YXJjaC1pbnB1dDpmb2N1c3tib3JkZXItY29sb3I6dmFyKC0tYWNjZW50LW9yYW5nZSk7fQouc2VhcmNoLWlucHV0OjpwbGFjZWhv" +
        "bGRlcntjb2xvcjp2YXIoLS10ZXh0LW11dGVkKTt9Ci5zZWFyY2gtYnRue3BhZGRpbmc6MTNweCAyMnB4O2JhY2tncm91bmQ6dmFy" +
        "KC0tYWNjZW50LW9yYW5nZSk7Y29sb3I6I2ZmZjtib3JkZXI6bm9uZTtib3JkZXItcmFkaXVzOnZhcigtLXJhZGl1cy1zbSk7Zm9u" +
        "dC1zaXplOjFyZW07Zm9udC13ZWlnaHQ6NzAwO2N1cnNvcjpwb2ludGVyO3RyYW5zaXRpb246YmFja2dyb3VuZCAwLjJzO3doaXRl" +
        "LXNwYWNlOm5vd3JhcDstd2Via2l0LXRhcC1oaWdobGlnaHQtY29sb3I6dHJhbnNwYXJlbnQ7fQouc2VhcmNoLWJ0bjphY3RpdmV7" +
        "YmFja2dyb3VuZDojZGM2NDA5O30KLnNlYXJjaC1oaW50e2ZvbnQtc2l6ZTowLjc0cmVtO2NvbG9yOnZhcigtLXRleHQtbXV0ZWQp" +
        "O21hcmdpbi10b3A6MTBweDt0ZXh0LWFsaWduOmNlbnRlcjt9Ci5yZXN1bHRze21heC13aWR0aDo0ODBweDttYXJnaW46MjRweCBh" +
        "dXRvIDYwcHg7cGFkZGluZzowIDE2cHg7fQoucmVzdWx0LWNhcmR7YmFja2dyb3VuZDp2YXIoLS1iZy1jYXJkKTtib3JkZXI6MXB4" +
        "IHNvbGlkIHZhcigtLWJvcmRlcik7Ym9yZGVyLXJhZGl1czp2YXIoLS1yYWRpdXMpO3BhZGRpbmc6MjBweDttYXJnaW4tYm90dG9t" +
        "OjE2cHg7YW5pbWF0aW9uOmZhZGVVcCAwLjNzIGVhc2U7fQpAa2V5ZnJhbWVzIGZhZGVVcHtmcm9te29wYWNpdHk6MDt0cmFuc2Zv" +
        "cm06dHJhbnNsYXRlWSgxNHB4KTt9dG97b3BhY2l0eToxO3RyYW5zZm9ybTp0cmFuc2xhdGVZKDApO319Ci5jYXJkLWhlYWRlcntk" +
        "aXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDoxNHB4O21hcmdpbi1ib3R0b206MThweDt9Ci5jYXJkLWF2YXRhcnt3" +
        "aWR0aDo1MnB4O2hlaWdodDo1MnB4O2JvcmRlci1yYWRpdXM6NTAlO2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7anVz" +
        "dGlmeS1jb250ZW50OmNlbnRlcjtmb250LXdlaWdodDo4MDA7Zm9udC1zaXplOjEuM3JlbTtmbGV4LXNocmluazowO2JhY2tncm91" +
        "bmQ6dmFyKC0tYWNjZW50LW9yYW5nZS1kaW0pO2NvbG9yOnZhcigtLWFjY2VudC1vcmFuZ2UpO30KLmNhcmQtbmFtZXtmb250LXNp" +
        "emU6MS4ycmVtO2ZvbnQtd2VpZ2h0OjcwMDt9Ci5jYXJkLWV2ZW50e2ZvbnQtc2l6ZTowLjhyZW07Y29sb3I6dmFyKC0tdGV4dC1t" +
        "dXRlZCk7bWFyZ2luLXRvcDozcHg7fQouc3RhdHVzLWJhZGdle21hcmdpbi1sZWZ0OmF1dG87cGFkZGluZzo1cHggMTRweDtib3Jk" +
        "ZXItcmFkaXVzOjIwcHg7Zm9udC1zaXplOjAuODJyZW07Zm9udC13ZWlnaHQ6NjAwO2ZsZXgtc2hyaW5rOjA7ZGlzcGxheTpmbGV4" +
        "O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6NnB4O30KLmRvdHt3aWR0aDo3cHg7aGVpZ2h0OjdweDtib3JkZXItcmFkaXVzOjUwJTt9" +
        "Ci5zdGF0dXMtYWN0aXZle2JhY2tncm91bmQ6cmdiYSgzNCwxOTcsOTQsMC4xMik7Y29sb3I6IzIyYzU1ZTt9LnN0YXR1cy1hY3Rp" +
        "dmUgLmRvdHtiYWNrZ3JvdW5kOiMyMmM1NWU7fQouc3RhdHVzLWV4cGlyaW5ne2JhY2tncm91bmQ6cmdiYSgyMzQsMTc5LDgsMC4x" +
        "Mik7Y29sb3I6I2VhYjMwODt9LnN0YXR1cy1leHBpcmluZyAuZG90e2JhY2tncm91bmQ6I2VhYjMwODt9Ci5zdGF0dXMtZXhwaXJl" +
        "ZHtiYWNrZ3JvdW5kOnJnYmEoMjM5LDY4LDY4LDAuMTIpO2NvbG9yOiNlZjQ0NDQ7fS5zdGF0dXMtZXhwaXJlZCAuZG90e2JhY2tn" +
        "cm91bmQ6I2VmNDQ0NDt9Ci5pbmZvLWdyaWR7ZGlzcGxheTpncmlkO2dyaWQtdGVtcGxhdGUtY29sdW1uczoxZnIgMWZyO2dhcDox" +
        "MHB4O21hcmdpbi1ib3R0b206MThweDt9Ci5pbmZvLWl0ZW17YmFja2dyb3VuZDp2YXIoLS1iZy1pbnB1dCk7Ym9yZGVyLXJhZGl1" +
        "czp2YXIoLS1yYWRpdXMtc20pO3BhZGRpbmc6MTNweDt9Ci5pbmZvLWxhYmVse2ZvbnQtc2l6ZTowLjcycmVtO2NvbG9yOnZhcigt" +
        "LXRleHQtbXV0ZWQpO2ZvbnQtd2VpZ2h0OjUwMDt9Ci5pbmZvLXZhbHVle2ZvbnQtc2l6ZToxLjA1cmVtO2ZvbnQtd2VpZ2h0Ojcw" +
        "MDttYXJnaW4tdG9wOjVweDt9Ci5pbmZvLXZhbHVlLmMtb3Jhbmdle2NvbG9yOnZhcigtLWFjY2VudC1vcmFuZ2UpO30uaW5mby12" +
        "YWx1ZS5jLWJsdWV7Y29sb3I6dmFyKC0tYWNjZW50LWJsdWUpO30uaW5mby12YWx1ZS5jLWdyZWVue2NvbG9yOnZhcigtLWFjY2Vu" +
        "dC1ncmVlbik7fS5pbmZvLXZhbHVlLmMtcmVke2NvbG9yOnZhcigtLWFjY2VudC1yZWQpO30uaW5mby12YWx1ZS5jLXllbGxvd3tj" +
        "b2xvcjp2YXIoLS1hY2NlbnQteWVsbG93KTt9LmluZm8tdmFsdWUuYy1wdXJwbGV7Y29sb3I6dmFyKC0tYWNjZW50LXB1cnBsZSk7" +
        "fQouc2VjdGlvbi10aXRsZXtmb250LXNpemU6MC44cmVtO2ZvbnQtd2VpZ2h0OjYwMDtjb2xvcjp2YXIoLS10ZXh0LXNlY29uZGFy" +
        "eSk7bWFyZ2luLWJvdHRvbToxMHB4O2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjZweDt9Ci5zZWN0aW9uLXRp" +
        "dGxlOjpiZWZvcmV7Y29udGVudDonJztkaXNwbGF5OmJsb2NrO3dpZHRoOjNweDtoZWlnaHQ6MTRweDtiYWNrZ3JvdW5kOnZhcigt" +
        "LWFjY2VudC1vcmFuZ2UpO2JvcmRlci1yYWRpdXM6MnB4O30KLnBheS1pdGVte2Rpc3BsYXk6ZmxleDtqdXN0aWZ5LWNvbnRlbnQ6" +
        "c3BhY2UtYmV0d2VlbjthbGlnbi1pdGVtczpjZW50ZXI7cGFkZGluZzoxMnB4IDE0cHg7YmFja2dyb3VuZDp2YXIoLS1iZy1pbnB1" +
        "dCk7Ym9yZGVyLXJhZGl1czp2YXIoLS1yYWRpdXMtc20pO21hcmdpbi1ib3R0b206OHB4O30KLnBheS1sZWZ0e30ucGF5LWFtb3Vu" +
        "dHtmb250LXNpemU6MS4wNXJlbTtmb250LXdlaWdodDo3MDA7Y29sb3I6dmFyKC0tYWNjZW50LW9yYW5nZSk7fS5wYXktbWV0YXtm" +
        "b250LXNpemU6MC43NHJlbTtjb2xvcjp2YXIoLS10ZXh0LW11dGVkKTttYXJnaW4tdG9wOjNweDt9Ci5wYXktcmlnaHR7dGV4dC1h" +
        "bGlnbjpyaWdodDt9LnBheS1kYXlze2ZvbnQtd2VpZ2h0OjYwMDtjb2xvcjp2YXIoLS1hY2NlbnQtYmx1ZSk7Zm9udC1zaXplOjAu" +
        "ODVyZW07fS5wYXktZGFpbHl7Zm9udC1zaXplOjAuNzJyZW07Y29sb3I6dmFyKC0tdGV4dC1tdXRlZCk7fQoubGVhdmUtaW5mb3ti" +
        "YWNrZ3JvdW5kOnJnYmEoMTY4LDg1LDI0NywwLjA4KTtib3JkZXI6MXB4IHNvbGlkIHJnYmEoMTY4LDg1LDI0NywwLjIpO2JvcmRl" +
        "ci1yYWRpdXM6dmFyKC0tcmFkaXVzLXNtKTtwYWRkaW5nOjEwcHggMTRweDttYXJnaW4tYm90dG9tOjEycHg7Zm9udC1zaXplOjAu" +
        "ODVyZW07Y29sb3I6dmFyKC0tYWNjZW50LXB1cnBsZSk7fQouZW1wdHktcmVzdWx0e3RleHQtYWxpZ246Y2VudGVyO3BhZGRpbmc6" +
        "NDhweCAyMHB4O2NvbG9yOnZhcigtLXRleHQtbXV0ZWQpO30uZW1wdHktcmVzdWx0IC5pY29ue2ZvbnQtc2l6ZTozcmVtO21hcmdp" +
        "bi1ib3R0b206MTJweDtvcGFjaXR5OjAuNTt9LmVtcHR5LXJlc3VsdCBwe2ZvbnQtc2l6ZTowLjkycmVtO30uZW1wdHktcmVzdWx0" +
        "IC5oaW50e2ZvbnQtc2l6ZTowLjhyZW07bWFyZ2luLXRvcDo4cHg7fQouZm9vdGVye3RleHQtYWxpZ246Y2VudGVyO3BhZGRpbmc6" +
        "MjBweDtmb250LXNpemU6MC43NXJlbTtjb2xvcjp2YXIoLS10ZXh0LW11dGVkKTtib3JkZXItdG9wOjFweCBzb2xpZCB2YXIoLS1i" +
        "b3JkZXIpO21hcmdpbi10b3A6MjBweDt9Ci51cGRhdGUtdGltZXt0ZXh0LWFsaWduOmNlbnRlcjtmb250LXNpemU6MC43MnJlbTtj" +
        "b2xvcjp2YXIoLS10ZXh0LW11dGVkKTttYXJnaW46OHB4IGF1dG8gMDtwYWRkaW5nOjAgMTZweDt9Cjwvc3R5bGU+CjwvaGVhZD4K" +
        "PGJvZHk+Cgo8ZGl2IGNsYXNzPSJoZWFkZXIiPgogIDxkaXYgY2xhc3M9ImhlYWRlci1jb250ZW50Ij4KICAgIDxkaXYgY2xhc3M9" +
        "ImhlYWRlci1pY29uIj7wn4+DPC9kaXY+CiAgICA8ZGl2IGNsYXNzPSJoZWFkZXItY2x1YiI+57K+5YeG55Sw5b6E5L+x5LmQ6YOo" +
        "PC9kaXY+CiAgICA8ZGl2IGNsYXNzPSJoZWFkZXItc3ViIj7lrablkZjnvLTotLnmn6Xor6I8L2Rpdj4KICA8L2Rpdj4KPC9kaXY+" +
        "Cgo8ZGl2IGNsYXNzPSJzZWFyY2gtd3JhcCI+CiAgPGRpdiBjbGFzcz0ic2VhcmNoLWNhcmQiPgogICAgPGxhYmVsPui+k+WFpeS9" +
        "oOeahOWnk+WQjeafpeivoue8tOi0ueS/oeaBrzwvbGFiZWw+CiAgICA8ZGl2IGNsYXNzPSJzZWFyY2gtcm93Ij4KICAgICAgPGlu" +
        "cHV0IHR5cGU9InRleHQiIGNsYXNzPSJzZWFyY2gtaW5wdXQiIGlkPSJuYW1lSW5wdXQiIHBsYWNlaG9sZGVyPSLor7fovpPlhaXl" +
        "p5PlkI0uLi4iIGF1dG9jb21wbGV0ZT0ib2ZmIj4KICAgICAgPGJ1dHRvbiBjbGFzcz0ic2VhcmNoLWJ0biIgb25jbGljaz0iZG9T" +
        "ZWFyY2goKSI+5p+l6K+iPC9idXR0b24+CiAgICA8L2Rpdj4KICAgIDxkaXYgY2xhc3M9InNlYXJjaC1oaW50Ij7mn6Xor6LkvaDn" +
        "moTorq3nu4PmnInmlYjmnJ/jgIHor7flgYforrDlvZXlkoznvLTotLnor6bmg4U8L2Rpdj4KICA8L2Rpdj4KPC9kaXY+Cgo8ZGl2" +
        "IGNsYXNzPSJyZXN1bHRzIiBpZD0icmVzdWx0cyI+PC9kaXY+Cgo8ZGl2IGNsYXNzPSJmb290ZXIiPueyvuWHhueUsOW+hOS/seS5" +
        "kOmDqCDCtyDlrablkZjnvLTotLnmn6Xor6Lns7vnu588L2Rpdj4KCjxzY3JpcHQ+CnZhciBQVUJfREFUQSA9ICREQVRBJDsKCgpm" +
        "dW5jdGlvbiBkYXlzQmV0d2VlbihkMSwgZDIpIHsKICByZXR1cm4gTWF0aC5jZWlsKChuZXcgRGF0ZShkMikgLSBuZXcgRGF0ZShk" +
        "MSkpIC8gODY0MDAwMDApOwp9CmZ1bmN0aW9uIHRvZGF5KCkgeyByZXR1cm4gbmV3IERhdGUoKS50b0lTT1N0cmluZygpLnNwbGl0" +
        "KCdUJylbMF07IH0KZnVuY3Rpb24gZXNjKHMpIHsKICBpZiAoIXMpIHJldHVybiAnJzsKICB2YXIgZCA9IGRvY3VtZW50LmNyZWF0" +
        "ZUVsZW1lbnQoJ2RpdicpOwogIGQudGV4dENvbnRlbnQgPSBzOwogIHJldHVybiBkLmlubmVySFRNTDsKfQoKZnVuY3Rpb24gZG9T" +
        "ZWFyY2goKSB7CiAgdmFyIHEgPSAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25hbWVJbnB1dCcpLnZhbHVlIHx8ICcnKS50cmlt" +
        "KCk7CiAgaWYgKCFxKSB7CiAgICBzaG93RW1wdHkoJ+ivt+i+k+WFpeWnk+WQjScpOwogICAgcmV0dXJuOwogIH0KICBpZiAoIVBV" +
        "Ql9EQVRBKSB7CiAgICBzaG93RW1wdHkoJ+aVsOaNruacquWKoOi9ve+8jOivt+iuqeaVmee7g+mHjeaWsOWIhuS6q+acgOaWsOmT" +
        "vuaOpScpOwogICAgcmV0dXJuOwogIH0KCiAgLy8gRnV6enkgbWF0Y2gKICB2YXIgbWF0Y2hlcyA9IFBVQl9EQVRBLnN0dWRlbnRz" +
        "LmZpbHRlcihmdW5jdGlvbihzKSB7CiAgICByZXR1cm4gcy5uYW1lID09PSBxIHx8IHMubmFtZS5pbmRleE9mKHEpID49IDAgfHwg" +
        "cS5pbmRleE9mKHMubmFtZSkgPj0gMDsKICB9KTsKCiAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdy" +
        "ZXN1bHRzJyk7CiAgaWYgKG1hdGNoZXMubGVuZ3RoID09PSAwKSB7CiAgICBjb250YWluZXIuaW5uZXJIVE1MID0gJzxkaXYgY2xh" +
        "c3M9ImVtcHR5LXJlc3VsdCI+PGRpdiBjbGFzcz0iaWNvbiI+8J+UjTwvZGl2PjxwPuacquaJvuWIsOivpeWtpuWRmDwvcD48ZGl2" +
        "IGNsYXNzPSJoaW50Ij7or7fmo4Dmn6Xlp5PlkI3mmK/lkKbovpPlhaXmraPnoa7vvIzmiJbogZTns7vmlZnnu4Pnoa7orqTmmK/l" +
        "kKblt7LlvZXlhaU8L2Rpdj48L2Rpdj4nOwogICAgcmV0dXJuOwogIH0KCiAgY29udGFpbmVyLmlubmVySFRNTCA9IG1hdGNoZXMu" +
        "bWFwKGZ1bmN0aW9uKHMpIHsKICAgIHZhciBzdENsYXNzID0gJ3N0YXR1cy0nICsgcy5zdGF0dXM7CiAgICB2YXIgc3RUZXh0ID0g" +
        "e2FjdGl2ZTon5pyJ5pWIJywgZXhwaXJpbmc6J+WNs+WwhuWIsOacnycsIGV4cGlyZWQ6J+W3sui/h+acnycsIG5vbmU6J+acque8" +
        "tOi0uSd9W3Muc3RhdHVzXSB8fCAn5pyq55+lJzsKICAgIHZhciBkYXlzVGV4dCA9IHMuZGF5c0xlZnQgPCAwID8gJ+W3sui/h+ac" +
        "nycgKyBNYXRoLmFicyhzLmRheXNMZWZ0KSArICflpKknIDogKHMuZGF5c0xlZnQgPD0gNyA/ICfliaknICsgcy5kYXlzTGVmdCAr" +
        "ICflpKknIDogcy5kYXlzTGVmdCArICflpKknKTsKICAgIHZhciBhdmF0YXJMZXR0ZXIgPSBzLm5hbWUuY2hhckF0KHMubmFtZS5s" +
        "ZW5ndGggLSAxKTsKICAgIHZhciBsZWF2ZUhUTUwgPSBzLmxlYXZlVG90YWwgPiAwID8gJzxkaXYgY2xhc3M9ImxlYXZlLWluZm8i" +
        "PvCfk4Ug57Sv6K6h6K+35YGHIDxiPicgKyBzLmxlYXZlVG90YWwgKyAnPC9iPiDlpKnvvIzliLDmnJ/ml6Xlt7Lnm7jlupTpobrl" +
        "u7Y8L2Rpdj4nIDogJyc7CgogICAgdmFyIHBheUhUTUwgPSAocy5wYXltZW50cyB8fCBbXSkubWFwKGZ1bmN0aW9uKHApIHsKICAg" +
        "ICAgdmFyIGxlYXZlSW5mbyA9IHAubGVhdmVEYXlzID4gMCA/ICc8ZGl2IHN0eWxlPSJmb250LXNpemU6MC43MnJlbTtjb2xvcjp2" +
        "YXIoLS1hY2NlbnQtcHVycGxlKTttYXJnaW4tdG9wOjJweDsiPuivt+WBhycgKyBwLmxlYXZlRGF5cyArICflpKkg4oaSIOWunumZ" +
        "heWIsOacn++8micgKyBlc2MocC5hY3R1YWxFeHBpcnkgfHwgJycpICsgJzwvZGl2PicgOiAnJzsKICAgICAgcmV0dXJuICc8ZGl2" +
        "IGNsYXNzPSJwYXktaXRlbSI+PGRpdiBjbGFzcz0icGF5LWxlZnQiPjxkaXYgY2xhc3M9InBheS1hbW91bnQiPsKlJyArIChwLmFt" +
        "b3VudCB8fCAwKS50b0xvY2FsZVN0cmluZygpICsgJzwvZGl2PjxkaXYgY2xhc3M9InBheS1tZXRhIj4nICsgZXNjKHAuZGF0ZSB8" +
        "fCAnJykgKyAnIMK3IOiuree7gycgKyBwLmRheXMgKyAn5aSpPC9kaXY+JyArIGxlYXZlSW5mbyArICc8L2Rpdj48ZGl2IGNsYXNz" +
        "PSJwYXktcmlnaHQiPjxkaXYgY2xhc3M9InBheS1kYXlzIj4nICsgZXNjKHAubm90ZSB8fCAnJykgKyAnPC9kaXY+PC9kaXY+PC9k" +
        "aXY+JzsKICAgIH0pLmpvaW4oJycpOwoKICAgIHJldHVybiAnPGRpdiBjbGFzcz0icmVzdWx0LWNhcmQiPjxkaXYgY2xhc3M9ImNh" +
        "cmQtaGVhZGVyIj48ZGl2IGNsYXNzPSJjYXJkLWF2YXRhciI+JyArIGVzYyhhdmF0YXJMZXR0ZXIpICsgJzwvZGl2PjxkaXY+PGRp" +
        "diBjbGFzcz0iY2FyZC1uYW1lIj4nICsgZXNjKHMubmFtZSkgKyAnPC9kaXY+PGRpdiBjbGFzcz0iY2FyZC1ldmVudCI+JyArIChz" +
        "LmV2ZW50IHx8ICcnKSArICc8L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPSJzdGF0dXMtYmFkZ2UgJyArIHN0Q2xhc3MgKyAnIj48c3Bh" +
        "biBjbGFzcz0iZG90Ij48L3NwYW4+JyArIHN0VGV4dCArICc8L2Rpdj48L2Rpdj4nICsgbGVhdmVIVE1MICsgJzxkaXYgY2xhc3M9" +
        "ImluZm8tZ3JpZCI+PGRpdiBjbGFzcz0iaW5mby1pdGVtIj48ZGl2IGNsYXNzPSJpbmZvLWxhYmVsIj7lrp7pmYXliLDmnJ/ml6U8" +
        "L2Rpdj48ZGl2IGNsYXNzPSJpbmZvLXZhbHVlICcgKyAocy5zdGF0dXM9PT0nZXhwaXJlZCc/J2MtcmVkJzpzLnN0YXR1cz09PSdl" +
        "eHBpcmluZyc/J2MteWVsbG93JzonYy1ncmVlbicpICsgJyI+JyArIGVzYyhzLmFjdHVhbEV4cGlyeSB8fCAnLScpICsgJzwvZGl2" +
        "PjwvZGl2PjxkaXYgY2xhc3M9ImluZm8taXRlbSI+PGRpdiBjbGFzcz0iaW5mby1sYWJlbCI+5Ymp5L2ZL+i/h+acn+WkqeaVsDwv" +
        "ZGl2PjxkaXYgY2xhc3M9ImluZm8tdmFsdWUgJyArIChzLnN0YXR1cz09PSdleHBpcmVkJz8nYy1yZWQnOnMuc3RhdHVzPT09J2V4" +
        "cGlyaW5nJz8nYy15ZWxsb3cnOidjLWJsdWUnKSArICciPicgKyBkYXlzVGV4dCArICc8L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPSJp" +
        "bmZvLWl0ZW0iPjxkaXYgY2xhc3M9ImluZm8tbGFiZWwiPuivt+WBh+aAu+WkqeaVsDwvZGl2PjxkaXYgY2xhc3M9ImluZm8tdmFs" +
        "dWUgYy1wdXJwbGUiPicgKyAocy5sZWF2ZVRvdGFsIHx8IDApICsgJyDlpKk8L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPSJpbmZvLWl0" +
        "ZW0iPjxkaXYgY2xhc3M9ImluZm8tbGFiZWwiPuaVsOaNruabtOaWsOaXtumXtDwvZGl2PjxkaXYgY2xhc3M9ImluZm8tdmFsdWUi" +
        "IHN0eWxlPSJmb250LXNpemU6MC44NXJlbTtjb2xvcjp2YXIoLS10ZXh0LW11dGVkKTsiPicgKyAoUFVCX0RBVEEudXBkYXRlVGlt" +
        "ZSB8fCAnLScpICsgJzwvZGl2PjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9InNlY3Rpb24tdGl0bGUiPue8tOi0ueiusOW9lTwvZGl2" +
        "PjxkaXYgY2xhc3M9InBheW1lbnQtaGlzdG9yeSI+JyArIHBheUhUTUwgKyAnPC9kaXY+PC9kaXY+JzsKICB9KS5qb2luKCcnKTsK" +
        "fQoKZnVuY3Rpb24gc2hvd0VtcHR5KG1zZykgewogIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN1bHRzJykuaW5uZXJIVE1M" +
        "ID0gJzxkaXYgY2xhc3M9ImVtcHR5LXJlc3VsdCI+PGRpdiBjbGFzcz0iaWNvbiI+8J+TizwvZGl2PjxwPicgKyBlc2MobXNnKSAr" +
        "ICc8L3A+PC9kaXY+JzsKfQoKLy8gQWxsb3cgRW50ZXIga2V5IHRvIHNlYXJjaAoKICAvLyBTaG93IHVwZGF0ZSB0aW1lCiAgaWYg" +
        "KFBVQl9EQVRBICYmIFBVQl9EQVRBLnVwZGF0ZVRpbWUpIHsKICAgIHZhciBkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2" +
        "Jyk7CiAgICBkLmNsYXNzTmFtZSA9ICd1cGRhdGUtdGltZSc7CiAgICBkLnRleHRDb250ZW50ID0gJ+aVsOaNruabtOaWsOaXtumX" +
        "tO+8micgKyBQVUJfREFUQS51cGRhdGVUaW1lOwogICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZvb3RlcicpLmJlZm9yZShk" +
        "KTsKICB9Cn0pOwoKICAvLyBTaG93IHVwZGF0ZSB0aW1lCiAgaWYgKFBVQl9EQVRBICYmIFBVQl9EQVRBLnVwZGF0ZVRpbWUpIHsK" +
        "ICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd1cGRhdGVUaW1lJykudGV4dENvbnRlbnQgPSAn5pWw5o2u5pu05paw5pe26Ze0" +
        "77yaJyArIFBVQl9EQVRBLnVwZGF0ZVRpbWU7CiAgfQo8L3NjcmlwdD4KPC9ib2R5Pgo8L2h0bWw+Cg==";
  // Decode UTF-8 base64 (browser-compatible)
  var tpl = decodeURIComponent(escape(atob(b64)));
  return tpl.replace('$DATA$', json);
}



// ── 初始化 ──
loadData();
renderDashboard();
