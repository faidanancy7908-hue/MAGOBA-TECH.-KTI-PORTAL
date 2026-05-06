const navButtons = document.querySelectorAll(".nav-btn");
const contentPanels = document.querySelectorAll("main .panel");
const topNav = document.querySelector(".top-nav");
const roleSelect = document.getElementById("roleSelect");
const goBtn = document.getElementById("goBtn");
const registerBtn = document.getElementById("registerBtn");
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

function openPanel(panelId) {
  if (securedRoles.includes(panelId) && panelId !== activeRole) {
    statusText.textContent = "Access denied. Please login with your assigned role.";
    return;
  }

  contentPanels.forEach((panel) => {
    if (panel.id === "quick-tools") {
      panel.classList.toggle("active", !activeRole);
      return;
    }
    panel.classList.toggle("active", panel.id === panelId);
  });

  navButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.target === panelId);
  });

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
    logoutBtn.style.display = "none";
    openPanel("home");
    return;
  }

  topNav.classList.remove("locked");
  sessionText.textContent = `Logged in as: ${capitalize(activeRole)}`;
  logoutBtn.style.display = "inline-block";
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

goBtn.addEventListener("click", async () => {
  await loginUser();
});

registerBtn.addEventListener("click", async () => {
  await registerUser();
});

logoutBtn.addEventListener("click", async () => {
  await logoutUser();
});

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
restoreSession();
