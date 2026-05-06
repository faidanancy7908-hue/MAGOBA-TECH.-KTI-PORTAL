const navButtons = document.querySelectorAll(".nav-btn");
const mobileNavButtons = document.querySelectorAll(".nav-btn-mobile");
const sideNavButtons = document.querySelectorAll(".side-nav-btn");
const contentPanels = document.querySelectorAll("main .panel");
const topNav = document.querySelector(".top-nav");
const roleSelect = document.getElementById("roleSelect");
const goBtn = document.getElementById("goBtn");
const registerBtn = document.getElementById("registerBtn");
const themeToggle = document.getElementById("themeToggle");
const brainRefreshBtn = document.getElementById("brainRefreshBtn");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const twoFactorBox = document.getElementById("twoFactorBox");
const twoFactorCode = document.getElementById("twoFactorCode");
const verifyCodeBtn = document.getElementById("verifyCodeBtn");
const resendCodeBtn = document.getElementById("resendCodeBtn");
const twoFactorTimer = document.getElementById("twoFactorTimer");
const statusText = document.getElementById("statusText");
const brainStatus = document.getElementById("brainStatus");
const year = document.getElementById("year");
const sessionText = document.getElementById("sessionText");
const logoutBtn = document.getElementById("logoutBtn");
const exportButtons = document.querySelectorAll(".export-btn");
const dataButtons = document.querySelectorAll(".data-btn");
const securedRoles = ["students", "finance", "administration", "lecturers", "alumni"];
const textAreaByRole = {
  students: document.getElementById("studentsData"),
  finance: document.getElementById("financeData"),
  administration: document.getElementById("administrationData"),
  lecturers: document.getElementById("lecturersData"),
  alumni: document.getElementById("alumniData")
};
const photoPreviewByRole = {
  students: document.getElementById("studentsPhotoPreview"),
  finance: document.getElementById("financePhotoPreview"),
  administration: document.getElementById("administrationPhotoPreview"),
  lecturers: document.getElementById("lecturersPhotoPreview"),
  alumni: document.getElementById("alumniPhotoPreview")
};
const photoInputByRole = {
  students: document.getElementById("studentsPhotoInput"),
  finance: document.getElementById("financePhotoInput"),
  administration: document.getElementById("administrationPhotoInput"),
  lecturers: document.getElementById("lecturersPhotoInput"),
  alumni: document.getElementById("alumniPhotoInput")
};
const photoClearByRole = {
  students: document.getElementById("studentsPhotoClear"),
  finance: document.getElementById("financePhotoClear"),
  administration: document.getElementById("administrationPhotoClear"),
  lecturers: document.getElementById("lecturersPhotoClear"),
  alumni: document.getElementById("alumniPhotoClear")
};
let activeRole = null;
let supabaseClient = null;
let roleChart = null;
let departmentRealtimeChannel = null;
let brainReloadInFlight = false;
let brainAutoSyncTimer = null;
let contextBroadcast = null;
let twoFactorExpiresAt = 0;
let twoFactorInterval = null;
let pendingTwoFactorRole = null;
let pendingTwoFactorEmail = null;
const GLOBAL_CONTEXT_KEY = "kti-global-context-v1";
const appContext = {
  session: { activeRole: null, status: "No active session", twoFactorVerified: false },
  theme: "dark",
  departmentData: {
    students: "",
    finance: "",
    administration: "",
    lecturers: "",
    alumni: ""
  },
  profilePhotos: {
    students: "",
    finance: "",
    administration: "",
    lecturers: "",
    alumni: ""
  },
  syncMeta: {
    departmentUpdatedAt: {
      students: 0,
      finance: 0,
      administration: 0,
      lecturers: 0,
      alumni: 0
    }
  }
};

function saveContext() {
  localStorage.setItem(GLOBAL_CONTEXT_KEY, JSON.stringify(appContext));
}

function hydrateContext() {
  const raw = localStorage.getItem(GLOBAL_CONTEXT_KEY);
  if (!raw) {
    return;
  }

  try {
    const parsed = JSON.parse(raw);
    if (parsed?.departmentData) {
      appContext.departmentData = { ...appContext.departmentData, ...parsed.departmentData };
    }
    if (parsed?.session) {
      appContext.session = { ...appContext.session, ...parsed.session };
    }
    if (parsed?.profilePhotos) {
      appContext.profilePhotos = { ...appContext.profilePhotos, ...parsed.profilePhotos };
    }
    if (typeof parsed?.theme === "string") {
      appContext.theme = parsed.theme;
    }
    if (parsed?.syncMeta?.departmentUpdatedAt) {
      appContext.syncMeta.departmentUpdatedAt = {
        ...appContext.syncMeta.departmentUpdatedAt,
        ...parsed.syncMeta.departmentUpdatedAt
      };
    }
  } catch (error) {
    // Ignore invalid stored context and continue with defaults.
  }
}

function renderDepartmentDataFromContext() {
  Object.entries(textAreaByRole).forEach(([role, textarea]) => {
    if (textarea) {
      textarea.value = appContext.departmentData[role] || "";
    }
  });
}

function updateDepartmentData(role, value, options = {}) {
  const incomingUpdatedAt = options.updatedAt || Date.now();
  const currentUpdatedAt = appContext.syncMeta.departmentUpdatedAt[role] || 0;
  if (incomingUpdatedAt < currentUpdatedAt) {
    return;
  }

  appContext.departmentData[role] = value;
  appContext.syncMeta.departmentUpdatedAt[role] = incomingUpdatedAt;
  saveContext();

  if (options.broadcast !== false && contextBroadcast) {
    contextBroadcast.postMessage({
      type: "department-sync",
      role,
      value,
      updatedAt: incomingUpdatedAt
    });
  }
}

function renderProfilePhotosFromContext() {
  Object.entries(photoPreviewByRole).forEach(([role, img]) => {
    if (!img) {
      return;
    }
    const src = appContext.profilePhotos[role];
    img.src = src || "https://placehold.co/96x96/0f172a/67e8f9?text=Photo";
  });
}

function updateProfilePhoto(role, imageDataUrl) {
  appContext.profilePhotos[role] = imageDataUrl || "";
  saveContext();
  renderProfilePhotosFromContext();
}

function setupContextBroadcast() {
  if (typeof BroadcastChannel === "undefined") {
    return;
  }
  contextBroadcast = new BroadcastChannel("kti-portal-sync");
  contextBroadcast.onmessage = (event) => {
    const payload = event.data;
    if (!payload || payload.type !== "department-sync") {
      return;
    }
    updateDepartmentData(payload.role, payload.value, {
      updatedAt: payload.updatedAt,
      broadcast: false
    });
    const textarea = textAreaByRole[payload.role];
    if (textarea) {
      textarea.value = payload.value;
    }
  };
}

function setBrainStatus(message, tone = "ok") {
  if (!brainStatus) {
    return;
  }
  brainStatus.textContent = `Brain: ${message}`;
  if (tone === "warn") {
    brainStatus.className = "mt-1 text-[11px] text-amber-300";
  } else if (tone === "error") {
    brainStatus.className = "mt-1 text-[11px] text-rose-300";
  } else {
    brainStatus.className = "mt-1 text-[11px] text-emerald-300";
  }
}

function stopDepartmentRealtimeSync() {
  if (!supabaseClient || !departmentRealtimeChannel) {
    return;
  }
  supabaseClient.removeChannel(departmentRealtimeChannel);
  departmentRealtimeChannel = null;
}

function startDepartmentRealtimeSync(role) {
  if (!supabaseClient || !role) {
    return;
  }

  stopDepartmentRealtimeSync();
  departmentRealtimeChannel = supabaseClient
    .channel(`department-data-${role}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "department_data",
        filter: `department_role=eq.${role}`
      },
      (payload) => {
        const latestContent = payload.new?.content;
        const latestUpdatedAt = payload.new?.updated_at ? new Date(payload.new.updated_at).getTime() : Date.now();
        if (typeof latestContent === "string") {
          updateDepartmentData(role, latestContent, { updatedAt: latestUpdatedAt });
          const textarea = textAreaByRole[role];
          if (textarea) {
            textarea.value = latestContent;
          }
          statusText.textContent = `${capitalize(role)} data synchronized in real-time.`;
        }
      }
    )
    .subscribe();
}

function initializeSupabase() {
  const hasSupabaseLib = typeof window.supabase !== "undefined";
  const hasConfig = typeof window.SUPABASE_URL === "string" && typeof window.SUPABASE_ANON_KEY === "string";

  if (!hasSupabaseLib || !hasConfig || !window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) {
    return;
  }

  const { createClient } = window.supabase;
  supabaseClient = createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function setActiveNav(panelId) {
  navButtons.forEach((button) => {
    const isActive = button.dataset.target === panelId;
    if (isActive) {
      button.className = "nav-btn rounded-lg border border-cyan-300/40 bg-cyan-400/20 px-4 py-2 text-sm font-semibold text-cyan-100";
    } else {
      button.className = "nav-btn rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10";
    }
  });

  mobileNavButtons.forEach((button) => {
    const isActive = button.dataset.target === panelId;
    if (isActive) {
      button.className = "nav-btn-mobile rounded-xl bg-cyan-500/20 px-3 py-2 text-xs font-semibold text-cyan-100";
    } else {
      button.className = "nav-btn-mobile rounded-xl px-3 py-2 text-xs font-semibold text-slate-300";
    }
  });

  sideNavButtons.forEach((button) => {
    const isActive = button.dataset.target === panelId;
    if (isActive) {
      button.className = "side-nav-btn w-full rounded-xl border border-cyan-300/40 bg-cyan-400/20 px-3 py-2 text-left text-sm font-semibold text-cyan-100";
    } else {
      button.className = "side-nav-btn w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-left text-sm font-semibold text-slate-200 hover:bg-white/10";
    }
  });
}

function openPanel(panelId) {
  if (securedRoles.includes(panelId) && panelId !== activeRole) {
    statusText.textContent = "Access denied. Please login with your assigned role.";
    return;
  }

  contentPanels.forEach((panel) => {
    if (panel.id === "quick-tools") {
      panel.classList.toggle("hidden", Boolean(activeRole));
      return;
    }
    panel.classList.toggle("hidden", panel.id !== panelId);
  });

  setActiveNav(panelId);

  statusText.textContent = `Now viewing: ${capitalize(panelId)} dashboard`;
}

function applyRoleView() {
  navButtons.forEach((button) => {
    const target = button.dataset.target;
    const allowed = target === "home" || target === activeRole;
    button.style.display = allowed ? "inline-block" : "none";
  });

  if (!activeRole) {
    topNav.classList.add("locked");
    appContext.session.activeRole = null;
    appContext.session.status = "No active session";
    appContext.session.twoFactorVerified = false;
    sessionText.textContent = appContext.session.status;
    logoutBtn.classList.add("hidden");
    stopDepartmentRealtimeSync();
    saveContext();
    openPanel("home");
    return;
  }

  topNav.classList.remove("locked");
  appContext.session.activeRole = activeRole;
  appContext.session.status = `Logged in as: ${capitalize(activeRole)}`;
  appContext.session.twoFactorVerified = true;
  sessionText.textContent = appContext.session.status;
  logoutBtn.classList.remove("hidden");
  saveContext();
  startDepartmentRealtimeSync(activeRole);
  openPanel(activeRole);
}

async function fetchCurrentRole() {
  const { data, error } = await supabaseClient
    .from("user_roles")
    .select("role")
    .single();

  if (error || !data?.role) {
    throw new Error(error?.message || "Role not found for this account.");
  }

  return data.role;
}

function getAuthInput() {
  return {
    email: emailInput.value.trim(),
    password: passwordInput.value
  };
}

async function registerUser() {
  if (!supabaseClient) {
    statusText.textContent = "Supabase is not configured. Update supabase-config.js first.";
    return;
  }

  const { email, password } = getAuthInput();
  const selectedRole = roleSelect.value;

  if (!email || !password) {
    statusText.textContent = "Enter email and password to register.";
    return;
  }

  const { data, error } = await supabaseClient.auth.signUp({ email, password });
  if (error) {
    statusText.textContent = `Registration failed. ${error.message}`;
    return;
  }

  const userId = data.user?.id;
  if (!userId) {
    statusText.textContent = "Registration created. Verify your email then login.";
    return;
  }

  const { error: roleError } = await supabaseClient
    .from("user_roles")
    .upsert({ user_id: userId, role: selectedRole }, { onConflict: "user_id" });

  if (roleError) {
    statusText.textContent = `Account created but role save failed. ${roleError.message}`;
    return;
  }

  statusText.textContent = `Registration successful. You can now login as ${selectedRole}.`;
}

async function loginUser() {
  if (!supabaseClient) {
    statusText.textContent = "Supabase is not configured. Update supabase-config.js first.";
    return;
  }

  const { email, password } = getAuthInput();
  if (!email || !password) {
    statusText.textContent = "Enter email and password to login.";
    return;
  }

  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) {
    statusText.textContent = `Login failed. ${error.message}`;
    return;
  }

  const role = await fetchCurrentRole();
  if (!securedRoles.includes(role)) {
    statusText.textContent = "Your account role is invalid. Contact administration.";
    return;
  }

  pendingTwoFactorRole = role;
  pendingTwoFactorEmail = email;
  await sendTwoFactorCode(email);
  statusText.textContent = "Password accepted. Verification code sent to your email.";
}

async function logoutUser() {
  if (supabaseClient) {
    await supabaseClient.auth.signOut();
  }
  activeRole = null;
  statusText.textContent = "Session ended. Login again to continue.";
  applyRoleView();
}

async function restoreSession() {
  if (!supabaseClient) {
    applyRoleView();
    return;
  }

  const { data } = await supabaseClient.auth.getSession();
  if (!data.session) {
    applyRoleView();
    return;
  }

  try {
    const role = await fetchCurrentRole();
    if (securedRoles.includes(role) && appContext.session.twoFactorVerified) {
      activeRole = role;
      statusText.textContent = `Session restored for ${role}.`;
    } else if (securedRoles.includes(role)) {
      statusText.textContent = "Session found. Complete two-factor verification to continue.";
    }
  } catch (error) {
    statusText.textContent = "Session found but role lookup failed.";
  }

  applyRoleView();
}

function showTwoFactorBox(show) {
  if (!twoFactorBox) {
    return;
  }
  twoFactorBox.classList.toggle("hidden", !show);
}

function startTwoFactorTimer() {
  if (twoFactorInterval) {
    clearInterval(twoFactorInterval);
  }
  twoFactorInterval = setInterval(() => {
    const remaining = Math.max(0, Math.ceil((twoFactorExpiresAt - Date.now()) / 1000));
    if (twoFactorTimer) {
      twoFactorTimer.textContent = String(remaining);
    }
    if (remaining <= 0) {
      clearInterval(twoFactorInterval);
      statusText.textContent = "Verification code expired. Click Resend.";
    }
  }, 1000);
}

async function sendTwoFactorCode(email) {
  const { error } = await supabaseClient.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: false }
  });
  if (error) {
    statusText.textContent = `Failed to send verification code. ${error.message}`;
    return;
  }

  twoFactorExpiresAt = Date.now() + 60000;
  showTwoFactorBox(true);
  if (twoFactorCode) {
    twoFactorCode.value = "";
  }
  startTwoFactorTimer();
}

async function verifyTwoFactorCode() {
  if (!pendingTwoFactorEmail || !pendingTwoFactorRole) {
    statusText.textContent = "Please login with email and password first.";
    return;
  }
  if (!twoFactorCode.value.trim()) {
    statusText.textContent = "Enter the verification code.";
    return;
  }
  if (Date.now() > twoFactorExpiresAt) {
    statusText.textContent = "Verification code expired. Click Resend.";
    return;
  }

  const { error } = await supabaseClient.auth.verifyOtp({
    email: pendingTwoFactorEmail,
    token: twoFactorCode.value.trim(),
    type: "email"
  });
  if (error) {
    statusText.textContent = `Invalid verification code. ${error.message}`;
    return;
  }

  activeRole = pendingTwoFactorRole;
  showTwoFactorBox(false);
  if (twoFactorInterval) {
    clearInterval(twoFactorInterval);
  }
  statusText.textContent = `Two-factor verified. Welcome ${activeRole}.`;
  applyRoleView();
}

async function instantBrainReload() {
  if (brainReloadInFlight) {
    return;
  }
  brainReloadInFlight = true;
  setBrainStatus("Syncing...", "warn");
  hydrateContext();
  renderDepartmentDataFromContext();
  applyTheme(appContext.theme || "dark");
  renderRoleChart();

  if (!supabaseClient) {
    applyRoleView();
    statusText.textContent = "Instant sync complete (local context).";
    setBrainStatus("Synced (local)");
    brainReloadInFlight = false;
    return;
  }

  const { data } = await supabaseClient.auth.getSession();
  if (!data.session) {
    activeRole = null;
    applyRoleView();
    statusText.textContent = "Instant sync complete (guest mode).";
    setBrainStatus("Synced (guest)");
    brainReloadInFlight = false;
    return;
  }

  try {
    const role = await fetchCurrentRole();
    if (securedRoles.includes(role)) {
      activeRole = role;
      await loadDepartmentData(role);
    }
    applyRoleView();
    statusText.textContent = "Instant sync complete. Application brain reloaded.";
    setBrainStatus("Synced");
  } catch (error) {
    applyRoleView();
    statusText.textContent = "Instant sync completed with partial role refresh.";
    setBrainStatus("Partial sync", "warn");
  }
  brainReloadInFlight = false;
}

async function exportSectionAsPng(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section || typeof html2canvas === "undefined") {
    statusText.textContent = "PNG export is unavailable right now.";
    return;
  }

  const canvas = await html2canvas(section, { scale: 2, backgroundColor: "#ffffff" });
  const imageUrl = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = imageUrl;
  link.download = `kti-${sectionId}-dashboard.png`;
  link.click();
}

async function exportSectionAsPdf(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section || typeof html2canvas === "undefined" || typeof window.jspdf === "undefined") {
    statusText.textContent = "PDF export is unavailable right now.";
    return;
  }

  const canvas = await html2canvas(section, { scale: 2, backgroundColor: "#ffffff" });
  const imgData = canvas.toDataURL("image/png");
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pageWidth - 12;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  const yOffset = Math.max(6, (pageHeight - imgHeight) / 2);

  pdf.addImage(imgData, "PNG", 6, yOffset, imgWidth, imgHeight);
  pdf.save(`kti-${sectionId}-dashboard.pdf`);
}

async function saveDepartmentData(role) {
  if (!supabaseClient) {
    statusText.textContent = "Supabase is not configured. Update supabase-config.js first.";
    return;
  }

  const textarea = textAreaByRole[role];
  const payload = (appContext.departmentData[role] || "").trim();
  if (!payload) {
    statusText.textContent = "Nothing to save. Enter data before saving.";
    return;
  }

  const { error } = await supabaseClient
    .from("department_data")
    .upsert(
      {
        department_role: role,
        content: payload,
        updated_at: new Date(appContext.syncMeta.departmentUpdatedAt[role] || Date.now()).toISOString()
      },
      { onConflict: "department_role" }
    );

  if (error) {
    statusText.textContent = `Save failed for ${role}. ${error.message}`;
    return;
  }

  statusText.textContent = `Saved ${role} data to Supabase successfully.`;
}

async function loadDepartmentData(role) {
  if (!supabaseClient) {
    statusText.textContent = "Supabase is not configured. Update supabase-config.js first.";
    return;
  }

  const { data, error } = await supabaseClient
    .from("department_data")
    .select("content, updated_at")
    .eq("department_role", role)
    .maybeSingle();

  if (error) {
    statusText.textContent = `Load failed for ${role}. ${error.message}`;
    return;
  }

  const textarea = textAreaByRole[role];
  if (textarea) {
    textarea.value = data?.content || "";
  }
  const remoteUpdatedAt = data?.updated_at ? new Date(data.updated_at).getTime() : Date.now();
  updateDepartmentData(role, data?.content || "", { updatedAt: remoteUpdatedAt });
  statusText.textContent = `Loaded ${role} data from Supabase.`;
}

navButtons.forEach((button) => {
  button.addEventListener("click", () => openPanel(button.dataset.target));
});

mobileNavButtons.forEach((button) => {
  button.addEventListener("click", () => openPanel(button.dataset.target));
});

sideNavButtons.forEach((button) => {
  button.addEventListener("click", () => openPanel(button.dataset.target));
});

goBtn.addEventListener("click", async () => {
  await loginUser();
});

registerBtn.addEventListener("click", async () => {
  await registerUser();
});

verifyCodeBtn.addEventListener("click", async () => {
  await verifyTwoFactorCode();
});

resendCodeBtn.addEventListener("click", async () => {
  if (!pendingTwoFactorEmail) {
    statusText.textContent = "No pending verification. Login first.";
    return;
  }
  await sendTwoFactorCode(pendingTwoFactorEmail);
  statusText.textContent = "New verification code sent.";
});

logoutBtn.addEventListener("click", async () => {
  await logoutUser();
});

brainRefreshBtn.addEventListener("click", async () => {
  await instantBrainReload();
});

function applyTheme(mode) {
  if (mode === "light") {
    document.body.classList.remove("bg-slate-950", "text-slate-100");
    document.body.classList.add("bg-slate-100", "text-slate-900");
  } else {
    document.body.classList.remove("bg-slate-100", "text-slate-900");
    document.body.classList.add("bg-slate-950", "text-slate-100");
  }
}

themeToggle.addEventListener("click", () => {
  const current = appContext.theme || "dark";
  const next = current === "dark" ? "light" : "dark";
  appContext.theme = next;
  saveContext();
  applyTheme(next);
});

function renderRoleChart() {
  const chartCanvas = document.getElementById("roleChart");
  if (!chartCanvas || typeof Chart === "undefined") {
    return;
  }
  if (roleChart) {
    roleChart.destroy();
  }

  roleChart = new Chart(chartCanvas, {
    type: "bar",
    data: {
      labels: ["Students", "Finance", "Administration", "Lecturers", "Alumni"],
      datasets: [
        {
          label: "Activity Index",
          data: [82, 68, 74, 79, 63],
          backgroundColor: ["#22d3ee", "#34d399", "#f59e0b", "#a78bfa", "#f472b6"],
          borderRadius: 8
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true, max: 100, ticks: { color: "#94a3b8" }, grid: { color: "rgba(148,163,184,0.2)" } },
        x: { ticks: { color: "#cbd5e1" }, grid: { display: false } }
      }
    }
  });
}

exportButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const sectionId = button.dataset.section;
    const format = button.dataset.format;

    if (sectionId !== activeRole) {
      statusText.textContent = "Export denied. You can only export data for your logged-in role.";
      return;
    }

    statusText.textContent = `Preparing ${format.toUpperCase()} export for ${sectionId}...`;

    try {
      if (format === "png") {
        await exportSectionAsPng(sectionId);
      } else {
        await exportSectionAsPdf(sectionId);
      }
      statusText.textContent = `${format.toUpperCase()} export completed for ${sectionId}.`;
    } catch (error) {
      statusText.textContent = `Export failed for ${sectionId}. Please try again.`;
    }
  });
});

dataButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const role = button.dataset.role;
    const action = button.dataset.action;

    if (role !== activeRole) {
      statusText.textContent = "Data action denied. You can only access data for your logged-in role.";
      return;
    }

    statusText.textContent = `${action === "save" ? "Saving" : "Loading"} ${role} data...`;

    try {
      if (action === "save") {
        await saveDepartmentData(role);
      } else {
        await loadDepartmentData(role);
      }
    } catch (error) {
      statusText.textContent = `Data action failed for ${role}. Please verify Supabase setup.`;
    }
  });
});

Object.entries(textAreaByRole).forEach(([role, textarea]) => {
  if (!textarea) {
    return;
  }
  textarea.addEventListener("input", () => {
    updateDepartmentData(role, textarea.value, { updatedAt: Date.now() });
  });
});

window.addEventListener("storage", (event) => {
  if (event.key !== GLOBAL_CONTEXT_KEY || !event.newValue) {
    return;
  }
  hydrateContext();
  renderDepartmentDataFromContext();
  renderProfilePhotosFromContext();
  if (!activeRole && appContext.session.status) {
    sessionText.textContent = appContext.session.status;
  }
});

window.addEventListener("keydown", async (event) => {
  if (event.altKey && (event.key === "r" || event.key === "R")) {
    event.preventDefault();
    await instantBrainReload();
  }
});

function startBrainAutoSync() {
  if (brainAutoSyncTimer) {
    clearInterval(brainAutoSyncTimer);
  }
  brainAutoSyncTimer = setInterval(async () => {
    if (document.hidden) {
      return;
    }
    await instantBrainReload();
  }, 90000);
}

year.textContent = new Date().getFullYear();
initializeSupabase();
setupContextBroadcast();
hydrateContext();
renderDepartmentDataFromContext();
renderProfilePhotosFromContext();
applyTheme(appContext.theme || "dark");
renderRoleChart();
restoreSession();
startBrainAutoSync();

Object.entries(photoInputByRole).forEach(([role, input]) => {
  if (!input) {
    return;
  }
  input.addEventListener("change", () => {
    const file = input.files && input.files[0];
    if (!file) {
      return;
    }
    if (!file.type.startsWith("image/")) {
      statusText.textContent = "Please select a valid image file.";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      updateProfilePhoto(role, reader.result);
      statusText.textContent = `${capitalize(role)} profile photo updated.`;
    };
    reader.readAsDataURL(file);
  });
});

Object.entries(photoClearByRole).forEach(([role, button]) => {
  if (!button) {
    return;
  }
  button.addEventListener("click", () => {
    updateProfilePhoto(role, "");
    const input = photoInputByRole[role];
    if (input) {
      input.value = "";
    }
    statusText.textContent = `${capitalize(role)} profile photo cleared.`;
  });
});
