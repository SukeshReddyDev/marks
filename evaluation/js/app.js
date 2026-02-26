/* ============================================
   IEEE Ignite Project Expo – Application JS
   ============================================ */

// ──────────────── Global Data ────────────────
let TEAMS = [];
let LEADERBOARD_DATA = [];
let SCORES_DATA = [];

// ──────────────── Login ────────────────
async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const role = document.getElementById('role').value;

  if (!email || !password) {
    showToast('Please fill in all fields', 'error');
    return;
  }

  if (!role) {
    showToast('Please select a role', 'error');
    return;
  }

  // Validate credentials against hardcoded user database
  const result = await loginUser(email, password, role);

  if (!result.success) {
    showToast(result.message, 'error');
    return;
  }

  // Login successful, redirect to appropriate dashboard
  if (role === 'judge') {
    window.location.href = 'judge.html';
  } else {
    window.location.href = 'admin.html';
  }
}

// ──────────────── Toast ────────────────
function showToast(message, type = 'success') {
  // Remove existing
  const old = document.querySelector('.toast');
  if (old) old.remove();

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div style="display:flex;align-items:center;gap:0.5rem;">
      <span>${type === 'success' ? '✓' : '✕'}</span>
      <span>${message}</span>
    </div>`;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

// ──────────────── Judge Dashboard ────────────────
let currentRound = 1;
let attendanceState = {};

async function initJudgeDashboard() {
  await populateTeamDropdown();
  selectRound(1);
}

async function populateTeamDropdown() {
  const select = document.getElementById('teamSelect');
  if (!select) return;
  
  TEAMS = await getAllTeams();
  select.innerHTML = '<option value="">— Select a Team —</option>';
  TEAMS.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t.id;
    opt.textContent = `${t.code || t.id} — ${t.name}`;
    select.appendChild(opt);
  });
}

function selectRound(round) {
  currentRound = round;
  document.querySelectorAll('.round-btn').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.round) === round);
  });
  // Reset evaluation panel
  const teamSelect = document.getElementById('teamSelect');
  if (teamSelect) teamSelect.value = '';
  hideEvaluation();
}

function loadTeam() {
  const select = document.getElementById('teamSelect');
  const teamId = parseInt(select.value);
  const panel = document.getElementById('evaluationPanel');

  if (!teamId) {
    hideEvaluation();
    return;
  }

  const team = TEAMS.find(t => t.id === teamId);
  if (!team) return;

  // Fill team details
  document.getElementById('detailTeamName').textContent = team.name;
  const idEl = document.getElementById('detailTeamId');
  if (idEl) idEl.textContent = `ID: ${team.code || team.id}`;
  document.getElementById('detailCollege').textContent = team.college;
  document.getElementById('detailProject').textContent = team.project;

  // Attendance - default each member to Present (toggle ON)
  attendanceState = {};
  const container = document.getElementById('attendanceList');
  container.innerHTML = '';
  team.members.forEach((member, i) => {
    attendanceState[i] = true; // default = present
    container.innerHTML += buildAttendanceRow(member, i);
  });

  // Reset scores
  for (let i = 1; i <= 5; i++) {
    const inp = document.getElementById('c' + i);
    if (inp) inp.value = '';
  }
  updateTotal();

  // Reset remarks
  const remarks = document.getElementById('remarks');
  if (remarks) remarks.value = '';
  updateCharCount();

  // Show panel
  panel.classList.remove('hidden');
  panel.style.animation = 'fadeInUp 0.4s ease forwards';
}

function hideEvaluation() {
  const panel = document.getElementById('evaluationPanel');
  if (panel) panel.classList.add('hidden');
}

function buildAttendanceRow(name, index) {
  return `
    <div class="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
      <span class="font-semibold text-gray-800 flex-1">${String(name).trim()}</span>
      <div class="flex items-center gap-4">
        <span id="status-label-${index}" class="text-sm font-semibold text-green-600 w-16 text-right">Present</span>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" id="toggle-${index}" class="sr-only peer" onchange="toggleAttendance(${index})" checked>
          <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
        </label>
      </div>
    </div>
  `;
}

function toggleAttendance(index) {
  const toggle = document.getElementById('toggle-' + index);
  const statusLabel = document.getElementById('status-label-' + index);
  
  if (toggle.checked) {
    attendanceState[index] = true;
    statusLabel.textContent = 'Present';
    statusLabel.style.color = '#10B981';
    showToast('Marked as Present', 'success');
  } else {
    attendanceState[index] = false;
    statusLabel.textContent = 'Absent';
    statusLabel.style.color = '#EF4444';
    showToast('Marked as Absent', 'success');
  }
}

function markPresent(index) {
  const toggle = document.getElementById('toggle-' + index);
  if (toggle) {
    toggle.checked = true;
    toggleAttendance(index);
  }
}

function markAbsent(index) {
  const toggle = document.getElementById('toggle-' + index);
  if (toggle) {
    toggle.checked = false;
    toggleAttendance(index);
  }
}

function updateTotal() {
  let total = 0;
  for (let i = 1; i <= 5; i++) {
    const inp = document.getElementById('c' + i);
    if (inp) {
      let val = parseInt(inp.value) || 0;
      if (val > 10) { val = 10; inp.value = 10; }
      if (val < 0)  { val = 0;  inp.value = 0;  }
      total += val;
    }
  }
  const el = document.getElementById('totalScore');
  if (el) el.textContent = total;
}

function updateCharCount() {
  const remarks = document.getElementById('remarks');
  const counter = document.getElementById('charCount');
  if (remarks && counter) {
    const len = remarks.value.length;
    counter.textContent = `${len} / 500`;
    counter.style.color = len > 450 ? '#EF4444' : '#64748B';
  }
}

function submitEvaluation(e) {
  e.preventDefault();
  const teamSelect = document.getElementById('teamSelect');
  if (!teamSelect.value) {
    showToast('Please select a team first', 'error');
    return;
  }

  // Validate scores
  const scores = {};
  let totalScore = 0;
  for (let i = 1; i <= 5; i++) {
    const val = parseInt(document.getElementById('c' + i).value);
    if (isNaN(val) || val < 0 || val > 10) {
      showToast(`Criterion ${i}: enter a score between 0 and 10`, 'error');
      return;
    }
    scores[`c${i}`] = val;
    totalScore += val;
  }

  // Validate remarks
  const remarks = document.getElementById('remarks').value.trim();
  if (!remarks) {
    showToast('Remarks are mandatory', 'error');
    return;
  }

  if (remarks.length > 500) {
    showToast('Remarks must be under 500 characters', 'error');
    return;
  }

  // Save to Supabase
  saveEvaluation(teamSelect.value, scores, remarks, totalScore);
}

async function saveEvaluation(teamId, scores, remarks, totalScore) {
  const judgeId = localStorage.getItem('userId') || 'unknown';
  const judgeName = localStorage.getItem('userEmail') || 'Unknown Judge';

  const result = await addScore(
    parseInt(teamId),
    judgeId,
    judgeName,
    currentRound,
    scores.c1,
    scores.c2,
    scores.c3,
    scores.c4,
    scores.c5,
    remarks
  );

  if (result.success) {
    showToast(`✓ Evaluation saved! Total: ${totalScore}/50`, 'success');
    
    // Get team to get member names
    const team = TEAMS.find(t => t.id === parseInt(teamId));
    if (team && team.members) {
      // Save attendance records for each member
      const attendanceRecords = team.members.map((member, index) => {
        const status = attendanceState[index] === true ? 'present' : (attendanceState[index] === false ? 'absent' : 'not_marked');
        return {
          team_id: parseInt(teamId),
          member_name: member,
          status: status,
          round: currentRound
        };
      });

      console.log('📝 About to save attendance records:', attendanceRecords);
      const attendanceResult = await saveAttendanceRecords(attendanceRecords);
      
      if (!attendanceResult.success) {
        console.error('❌ Attendance save failed:', attendanceResult.message);
        showToast(`Attendance Error: ${attendanceResult.message}`, 'error');
      } else {
        console.log('✅ Attendance saved successfully!');
        showToast(`✓ Attendance saved!`, 'success');
      }
    }
    
    // Reset form AFTER everything is saved
    setTimeout(() => {
      const teamSelect = document.getElementById('teamSelect');
      teamSelect.value = '';
      hideEvaluation();
    }, 500);
  } else {
    showToast('Error submitting evaluation: ' + result.message, 'error');
  }
}

// ──────────────── Admin Dashboard ────────────────
let currentSection = 'addTeam';
let ATTENDANCE_DATA = [];

async function initAdminDashboard() {
  // Load teams first (needed for all sections)
  TEAMS = await getAllTeams();
  console.log('✅ Teams loaded:', TEAMS);
  
  showSection('addTeam');
  await renderLeaderboard();
  await renderScores();
  await renderAttendance();
  await updateDashboardStats();
  await populateAttendanceFilters();
}

async function updateDashboardStats() {
  // Get counts
  const teams = await getAllTeams();
  const scores = await getAllScores();
  const leaderboard = await getLeaderboard();
  
  // Calculate stats
  const totalTeams = teams.length;
  const totalEvaluations = scores.length;
  const highestScore = leaderboard.length > 0 ? leaderboard[0].total : 0;
  
  // Update DOM
  const statsEl = document.getElementById('totalTeamsCount');
  const evals = document.getElementById('totalEvaluationsCount');
  const highest = document.getElementById('highestScoreCount');
  
  if (statsEl) statsEl.textContent = totalTeams;
  if (evals) evals.textContent = totalEvaluations;
  if (highest) highest.textContent = highestScore;
}

function showSection(section) {
  currentSection = section;
  document.querySelectorAll('.admin-section').forEach(el => el.classList.add('hidden'));
  const target = document.getElementById(section);
  if (target) {
    target.classList.remove('hidden');
    target.style.animation = 'fadeInUp 0.35s ease forwards';
  }

  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.classList.toggle('active', link.dataset.section === section);
  });

  // Refresh data when section is shown
  if (section === 'attendance') {
    renderAttendance();
  } else if (section === 'leaderboard') {
    renderLeaderboard();
  } else if (section === 'viewScores') {
    renderScores();
  }
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  sidebar.classList.toggle('open');
  overlay.classList.toggle('hidden');
}

async function submitAddTeam(e) {
  e.preventDefault();
  const name = document.getElementById('teamName').value.trim();
  const college = document.getElementById('collegeName').value.trim();
  const project = document.getElementById('projectTitle').value.trim();
  const teamCode = document.getElementById('teamCode') ? document.getElementById('teamCode').value.trim() : '';

  if (!name || !college || !project) {
    showToast('Please fill in all fields', 'error');
    return;
  }

  // Collect members from individual textboxes
  const memberInputs = document.querySelectorAll('.member-input');
  const members = [];
  memberInputs.forEach(input => {
    const member = input.value.trim();
    if (member.length > 0) {
      members.push(member);
    }
  });

  if (members.length === 0) {
    showToast('Please add at least one team member', 'error');
    return;
  }

  if (!teamCode) {
    showToast('Please provide a Team ID', 'error');
    return;
  }

  // Ensure local uniqueness (best-effort)
  if (TEAMS.some(t => t.code && t.code.toLowerCase() === teamCode.toLowerCase())) {
    showToast('Team ID already exists. Choose a unique ID.', 'error');
    return;
  }

  // Save to Supabase
  const result = await addTeam(name, college, project, members, teamCode);

  if (result.success) {
    showToast(`Team "${name}" added successfully!`, 'success');
    document.getElementById('addTeamForm').reset();
    // Reset member fields to just one
    resetMemberFields();
    // Refresh leaderboard
    await renderLeaderboard();
  } else {
    showToast('Error adding team: ' + result.message, 'error');
  }
}

function addMemberField() {
  const container = document.getElementById('membersContainer');
  const newField = document.createElement('div');
  newField.className = 'member-field flex gap-3 items-center';
  newField.innerHTML = `
    <input type="text" class="form-input member-input flex-1" placeholder="Enter member name" required />
    <button type="button" onclick="removeMemberField(this)" class="btn-error btn-sm px-3 py-2">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  `;
  container.appendChild(newField);
}

function removeMemberField(btn) {
  btn.parentElement.remove();
}

function resetMemberFields() {
  const container = document.getElementById('membersContainer');
  container.innerHTML = `
    <div class="member-field flex gap-3 items-center">
      <input type="text" class="form-input member-input flex-1" placeholder="Enter member name" required />
      <button type="button" onclick="removeMemberField(this)" class="btn-error btn-sm px-3 py-2" style="display: none;">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  `;
}

async function renderLeaderboard() {
  const tbody = document.getElementById('leaderboardBody');
  if (!tbody) return;

  LEADERBOARD_DATA = await getLeaderboard();

  tbody.innerHTML = LEADERBOARD_DATA.map(row => {
    const rankClass = row.rank <= 3 ? `rank-${row.rank}` : '';
    const rankBadge = row.rank <= 3
      ? `<span class="rank-badge ${rankClass}">${row.rank}</span>`
      : `<span class="font-semibold text-gray-600">${row.rank}</span>`;

    return `
      <tr>
        <td class="text-center">${rankBadge}</td>
        <td class="font-semibold">${row.team}</td>
        <td class="text-gray-600">${row.college}</td>
        <td class="text-center font-medium">${row.r1}</td>
        <td class="text-center font-medium">${row.r2}</td>
        <td class="text-center">
          <span class="inline-block px-3 py-1 rounded-full text-sm font-bold ${
            row.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
            row.rank === 2 ? 'bg-gray-100 text-gray-800' :
            row.rank === 3 ? 'bg-orange-100 text-orange-800' :
            'bg-blue-50 text-blue-800'
          }">${row.total}</span>
        </td>
      </tr>`;
  }).join('');
}

async function renderScores() {
  const tbody = document.getElementById('scoresBody');
  if (!tbody) return;

  SCORES_DATA = await getAllScores();

  tbody.innerHTML = SCORES_DATA.map(row => `
    <tr>
      <td class="font-semibold">${row.teams ? row.teams.name : 'Unknown'}</td>
      <td class="text-gray-600">${row.judge_name}</td>
      <td class="text-center">
        <span class="inline-block px-2 py-0.5 rounded-full text-xs font-bold ${
          row.round === 1 ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
        }">R${row.round}</span>
      </td>
      <td class="text-center">${row.criteria_1}</td>
      <td class="text-center">${row.criteria_2}</td>
      <td class="text-center">${row.criteria_3}</td>
      <td class="text-center">${row.criteria_4}</td>
      <td class="text-center">${row.criteria_5}</td>
      <td class="text-center font-bold text-blue-700">${row.total_score}</td>
      <td class="text-gray-600 text-sm max-w-xs truncate" title="${row.remarks}">${row.remarks}</td>
    </tr>`).join('');
}

async function renderAttendance() {
  const tbody = document.getElementById('attendanceBody');
  if (!tbody) return;

  console.log('📊 Loading attendance data...');
  ATTENDANCE_DATA = await getAllAttendance();
  console.log('📊 Attendance data received:', ATTENDANCE_DATA);
  console.log('📊 Available teams:', TEAMS);

  // Apply filters
  const teamFilter = document.getElementById('attendanceTeamFilter')?.value || '';
  const roundFilter = document.getElementById('attendanceRoundFilter')?.value || '';

  let filtered = ATTENDANCE_DATA;
  if (teamFilter) {
    filtered = filtered.filter(row => row.team_id == parseInt(teamFilter));
  }
  if (roundFilter) {
    filtered = filtered.filter(row => row.round == parseInt(roundFilter));
  }

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center text-gray-500 py-8">No attendance records found</td></tr>';
    return;
  }

  tbody.innerHTML = filtered.map(row => {
    // Get team name from TEAMS array
    console.log(`🔍 Looking for team_id ${row.team_id} in TEAMS array`);
    const team = TEAMS.find(t => t.id === row.team_id);
    console.log(`   Found team:`, team);
    const teamCode = team && team.code ? `${team.code} — ` : '';
    const teamName = team ? `${teamCode}${team.name}` : `Unknown Team (ID: ${row.team_id})`;
    
    const statusBadge = row.status === 'present'
      ? '<span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">✓ Present</span>'
      : (row.status === 'absent'
        ? '<span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">✗ Absent</span>'
        : '<span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800">? Not Marked</span>');
    
    const createdDate = row.created_at ? new Date(row.created_at).toLocaleDateString() : '—';
    
    return `
      <tr>
        <td class="font-semibold">${teamName}</td>
        <td class="text-gray-700">${row.member_name}</td>
        <td class="text-center">
          <span class="inline-block px-2 py-0.5 rounded-full text-xs font-bold ${
            row.round === 1 ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
          }">R${row.round}</span>
        </td>
        <td class="text-center">${statusBadge}</td>
        <td class="text-gray-500 text-sm">${createdDate}</td>
      </tr>`;
  }).join('');
}

async function populateAttendanceFilters() {
  const teamSelect = document.getElementById('attendanceTeamFilter');
  if (!teamSelect) return;

  const teams = await getAllTeams();
  teamSelect.innerHTML = '<option value="">— All Teams —</option>';
  teams.forEach(team => {
    const opt = document.createElement('option');
    opt.value = team.id;
    opt.textContent = `${team.id} — ${team.name}`;
    teamSelect.appendChild(opt);
  });
}

function logout() {
  localStorage.removeItem('userRole');
  localStorage.removeItem('userEmail');
  window.location.href = 'index.html';
}
