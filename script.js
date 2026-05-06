const navButtons = document.querySelectorAll(".nav-btn");
const mobileNavButtons = document.querySelectorAll(".nav-btn-mobile");
const sideNavButtons = document.querySelectorAll(".side-nav-btn");
const contentPanels = document.querySelectorAll("main .panel");
const topNav = document.querySelector(".top-nav");
const roleSelect = document.getElementById("roleSelect");
const goBtn = document.getElementById("goBtn");
const registerBtn = document.getElementById("registerBtn");
const themeToggle = document.getElementById("themeToggle");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const statusText = document.getElementById("statusText");
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
let activeRole = null;
let supabaseClient = null;
let roleChart = null;

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
    sessionText.textContent = "No active session";
    logoutBtn.classList.add("hidden");
    openPanel("home");
    return;
  }

  topNav.classList.remove("locked");
  sessionText.textContent = `Logged in as: ${capitalize(activeRole)}`;
  logoutBtn.classList.remove("hidden");
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

  activeRole = role;
  statusText.textContent = `Login successful for ${role}.`;
  applyRoleView();
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
    if (securedRoles.includes(role)) {
      activeRole = role;
      statusText.textContent = `Session restored for ${role}.`;
    }
  } catch (error) {
    statusText.textContent = "Session found but role lookup failed.";
  }

  applyRoleView();
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
  const payload = textarea ? textarea.value.trim() : "";
  if (!payload) {
    statusText.textContent = "Nothing to save. Enter data before saving.";
    return;
  }

  const { error } = await supabaseClient
    .from("department_data")
    .upsert(
      { department_role: role, content: payload, updated_at: new Date().toISOString() },
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
    .select("content")
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

logoutBtn.addEventListener("click", async () => {
  await logoutUser();
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
  const current = localStorage.getItem("kti-theme") || "dark";
  const next = current === "dark" ? "light" : "dark";
  localStorage.setItem("kti-theme", next);
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

year.textContent = new Date().getFullYear();
initializeSupabase();
applyTheme(localStorage.getItem("kti-theme") || "dark");
renderRoleChart();
restoreSession();
