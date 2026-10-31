const SUPABASE_URL = "https://xpoijicicmsmxvemrcur.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_J6EkHYUTdqI-FvPSRqgZAQ_wv40AO64";
const COMPANIES_ENDPOINT = `${SUPABASE_URL}/rest/v1/companies`;
const APPLICATION_KEY = "placementTrackerApplications_v1";

const seedCompanies = [
  {
    id: "sample-1", name: "Tata Consultancy Services", shortName: "TCS",
    role: "Assistant System Engineer", location: "Pan India",
    type: "Full-time", status: "Upcoming", salary: 3.5, cgpa: 6.0, percentage: 60,
    deadline: "", overview: "A large IT services, consulting, and business solutions company.",
    eligibility: "Example entry only. Check the current official placement notice for eligible degrees, branches, academic history, backlogs, and minimum marks.",
    description: "Typical responsibilities may include software development, testing, maintenance, and client-facing technology work. Actual role and package depend on the official hiring notice.",
    url: "https://www.tcs.com/careers"
  },
  {
    id: "sample-2", name: "Infosys", shortName: "IN",
    role: "Systems Engineer", location: "Pan India",
    type: "Full-time", status: "Applications Open", salary: 3.6, cgpa: 6.0, percentage: 60,
    deadline: "", overview: "A global digital services and consulting company.",
    eligibility: "Example entry only. Verify academic requirements, branch restrictions, backlog rules, and deadlines from the official drive notice.",
    description: "Potential work includes software engineering, application development, testing, and technology consulting.",
    url: "https://www.infosys.com/careers/"
  },
  {
    id: "sample-3", name: "Amazon", shortName: "A", 
    role: "Software Development Engineer Intern", location: "Multiple locations",
    type: "Internship", status: "Upcoming", salary: 8, cgpa: 7.0, percentage: 70,
    deadline: "", overview: "A technology company operating in e-commerce, cloud computing, and digital services.",
    eligibility: "Illustrative requirements only. Internship eligibility varies by role, degree, graduation date, location, and hiring cycle.",
    description: "Work with engineers to design, implement, test, and maintain software. Review the specific job posting for required skills and internship dates.",
    url: "https://www.amazon.jobs/"
  },
  {
    id: "sample-4", name: "Microsoft", shortName: "M",
    role: "Software Engineer", location: "Hyderabad / Bengaluru",
    type: "Full-time", status: "Upcoming", salary: 20, cgpa: 7.5, percentage: 75,
    deadline: "", overview: "A global technology company building software, cloud services, and developer tools.",
    eligibility: "Illustrative requirements only. Confirm degree, graduation year, academic criteria, and role-specific conditions in the official posting.",
    description: "Software engineering work may include designing, implementing, testing, and maintaining products and services.",
    url: "https://careers.microsoft.com/"
  },
  {
    id: "sample-5", name: "Accenture", shortName: "AC",
    role: "Associate Software Engineer", location: "Multiple locations",
    type: "Full-time", status: "Registration Closed", salary: 4.5, cgpa: 6.5, percentage: 65,
    deadline: "", overview: "A global professional services company focused on technology and consulting.",
    eligibility: "Example entry only. Criteria differ by role and recruitment drive; use the official notice for confirmation.",
    description: "Potential responsibilities include application development, testing, maintenance, and technology consulting.",
    url: "https://www.accenture.com/in-en/careers"
  },
  {
    id: "sample-6", name: "Zoho", shortName: "Z",
    role: "Software Developer", location: "Chennai / Multiple locations",
    type: "Full-time", status: "Upcoming", salary: 8, cgpa: 7.0, percentage: 70,
    deadline: "", overview: "A software company offering business and productivity applications.",
    eligibility: "Example entry only. Check the current official recruitment notice for academic and technical requirements.",
    description: "Software development roles may involve problem-solving, coding, debugging, and building product features.",
    url: "https://www.zoho.com/careers/"
  },
  {
    id: "sample-7", name: "Wipro", shortName: "W",
    role: "Project Engineer", location: "Pan India",
    type: "Full-time", status: "Completed", salary: 3.5, cgpa: 6.0, percentage: 60,
    deadline: "", overview: "A global information technology, consulting, and business process services company.",
    eligibility: "Example entry only. Eligibility varies by hiring program and batch.",
    description: "Work may include software development, application support, testing, and client projects.",
    url: "https://careers.wipro.com/"
  },
  {
    id: "sample-8", name: "Example Tech", shortName: "ET",
    role: "Software Engineering Intern", location: "Remote / Bengaluru",
    type: "Internship → PPO", status: "Applications Open", salary: 10, cgpa: 7.5, percentage: 75,
    deadline: "", overview: "Demonstration listing showing the internship-to-pre-placement-offer route.",
    eligibility: "Demo data. Replace this listing with verified company information before relying on it.",
    description: "An illustrative internship with a possible full-time conversion based on performance and business requirements.",
    url: ""
  }
];


// Theme preference is stored locally and survives refreshes.
const THEME_KEY = "placementTrackerTheme_v1";
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const dark = theme === "dark";
  const button = document.querySelector("#themeToggle");
  if (button) {
    button.innerHTML = dark ? "☀ <span>Light mode</span>" : "☾ <span>Dark mode</span>";
    button.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  }
}
const savedTheme = localStorage.getItem(THEME_KEY);
applyTheme(savedTheme === "dark" ? "dark" : "light");
document.querySelector("#themeToggle").addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem(THEME_KEY, nextTheme);
  applyTheme(nextTheme);
});

let companies = [];
let applications = loadApplications();
let toastTimer;

const $ = (selector) => document.querySelector(selector);
const grid = $("#companyGrid");

function apiHeaders(extra = {}) {
  return {
    apikey: SUPABASE_PUBLISHABLE_KEY,
    Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
    "Content-Type": "application/json",
    ...extra
  };
}
function fromDatabase(row) {
  return {
    id: String(row.id), name: row.name || "", shortName: row.short_name || initials(row.name || ""),
    role: row.role || "", location: row.location || "", type: row.type || "Full-time",
    status: row.status || "Upcoming", salary: Number(row.salary || 0), cgpa: Number(row.cgpa || 0),
    percentage: Number(row.percentage ?? row.eligibility_percentage ?? 60), deadline: row.application_deadline || "",
    overview: row.overview || "", eligibility: row.eligibility || "", description: row.description || "",
    url: row.website || ""
  };
}
async function loadRemoteCompanies() {
  try {
    const response = await fetch(`${COMPANIES_ENDPOINT}?select=*&order=created_at.desc`, { headers: apiHeaders() });
    if (!response.ok) throw new Error(await response.text());
    companies = (await response.json()).map(fromDatabase);
    render();
  } catch (error) {
    console.error("Could not load companies from Supabase:", error);
    showToast("Could not load shared listings. Check the Supabase table and policies.");
  }
}
function loadApplications() {
  try {
    const saved = JSON.parse(localStorage.getItem(APPLICATION_KEY) || "{}");
    return saved && typeof saved === "object" ? saved : {};
  } catch {
    return {};
  }
}
function saveApplications() {
  localStorage.setItem(APPLICATION_KEY, JSON.stringify(applications));
}
function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));
}
function initials(name) {
  return name.trim().split(/\s+/).slice(0, 2).map(part => part[0] || "").join("").toUpperCase();
}
function formatSalary(value) {
  const number = Number(value);
  return Number.isFinite(number) ? `₹${number.toLocaleString("en-IN", { maximumFractionDigits: 2 })} LPA` : "Not specified";
}
function statusClass(status) {
  if (status === "Applications Open") return "status-open";
  if (status === "Upcoming") return "status-upcoming";
  if (status === "Registration Closed") return "status-closed";
  return "status-completed";
}
function getFilteredCompanies() {
  const search = $("#searchInput").value.trim().toLowerCase();
  const status = $("#statusFilter").value;
  const type = $("#typeFilter").value;
  const cgpa = $("#cgpaFilter").value;
  const percentage = $("#percentageFilter").value;
  const salary = $("#salaryFilter").value;
  const application = $("#applicationFilter").value;

  return companies.filter(company => {
    const searchable = `${company.name} ${company.role} ${company.location} ${company.type}`.toLowerCase();
    const companyApplication = applications[company.id] || "Not Applied";
    return (!search || searchable.includes(search))
      && (!status || company.status === status)
      && (!type || company.type === type)
      && (!cgpa || Number(company.cgpa) <= Number(cgpa))
      && (!percentage || Number(company.percentage || 60) >= Number(percentage))
      && (!salary || Number(company.salary) >= Number(salary))
      && (!application || companyApplication === application);
  });
}
function render() {
  const filtered = getFilteredCompanies();
  $("#totalCount").textContent = companies.length;
  $("#openCount").textContent = companies.filter(c => c.status === "Applications Open").length;
  $("#appliedCount").textContent = Object.values(applications).filter(v => v === "Applied").length;
  $("#eligibleCount").textContent = "—";
  $("#resultsLabel").textContent = `Showing ${filtered.length} of ${companies.length} opportunit${companies.length === 1 ? "y" : "ies"}`;

  grid.innerHTML = filtered.map(company => {
    const applied = (applications[company.id] || "Not Applied") === "Applied";
    const deadline = company.deadline ? `Deadline: ${escapeHTML(company.deadline)}` : "Deadline not listed";
    return `
      <article class="company-card">
        <div class="card-top">
          <div class="company-logo">${escapeHTML(company.shortName || initials(company.name))}</div>
          <div class="company-heading">
            <h3>${escapeHTML(company.name)}</h3>
            <p class="company-role">${escapeHTML(company.role)}</p>
          </div>
          <span class="application-pill ${applied ? "" : "not-applied"}">${applied ? "Applied" : "Not applied"}</span>
        </div>
        <span class="status-pill ${statusClass(company.status)}">${escapeHTML(company.status)}</span>
        <div><span class="type-pill">${escapeHTML(company.type)}</span></div>
        <div class="card-meta">
          <div><p class="meta-label">Package</p><p class="meta-value">${formatSalary(company.salary)}</p></div>
          <div><p class="meta-label">Minimum CGPA</p><p class="meta-value">${escapeHTML(company.cgpa)} / 10</p></div>
          <div><p class="meta-label">Location</p><p class="meta-value">${escapeHTML(company.location || "Not specified")}</p></div>
          <div><p class="meta-label">Academic percentage</p><p class="meta-value">${escapeHTML(company.percentage || "Not specified")}% minimum</p></div>
        </div>
        <p class="card-eligibility"><strong>Eligibility:</strong> ${escapeHTML((company.eligibility || "Check the official notice.").slice(0, 112))}${(company.eligibility || "").length > 112 ? "…" : ""}<br><span>${deadline}</span></p>
        <div class="card-actions">
          <button class="button button-secondary" data-action="details" data-id="${escapeHTML(company.id)}">View details</button>
          <button class="button ${applied ? "button-quiet" : "button-primary"}" data-action="application" data-id="${escapeHTML(company.id)}">${applied ? "Undo applied" : "Mark applied"}</button>
        </div>
      </article>`;
  }).join("");

  $("#emptyState").classList.toggle("hidden", filtered.length > 0);
  grid.classList.toggle("hidden", filtered.length === 0);
}
function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}
function openDetails(id) {
  const company = companies.find(item => item.id === id);
  if (!company) return;
  const applied = (applications[id] || "Not Applied") === "Applied";
  const officialLink = company.url && /^https?:\/\//i.test(company.url)
    ? `<p><a class="official-link" href="${escapeHTML(company.url)}" target="_blank" rel="noopener noreferrer">Open official company page ↗</a></p>`
    : `<p>No official link supplied. Search for the company's verified careers page.</p>`;

  $("#detailsContent").innerHTML = `
    <div class="details-header">
      <div class="company-logo">${escapeHTML(company.shortName || initials(company.name))}</div>
      <h2>${escapeHTML(company.name)}</h2>
      <p class="details-role">${escapeHTML(company.role)} · ${escapeHTML(company.location || "Location not specified")}</p>
      <span class="status-pill ${statusClass(company.status)}">${escapeHTML(company.status)}</span>
      <span class="type-pill">${escapeHTML(company.type)}</span>
    </div>
    <div class="details-stats">
      <div class="details-stat"><span>Package</span><strong>${formatSalary(company.salary)}</strong></div>
      <div class="details-stat"><span>Minimum CGPA</span><strong>${escapeHTML(company.cgpa)} / 10</strong></div>
      <div class="details-stat"><span>Minimum percentage</span><strong>${escapeHTML(company.percentage || "Not specified")}%</strong></div>
    </div>
    <section class="details-section"><h3>Company overview</h3><p>${escapeHTML(company.overview || "No overview provided.")}</p></section>
    <section class="details-section"><h3>Eligibility criteria</h3><p>${escapeHTML(company.eligibility || "Not provided. Check the official notice.")}</p></section>
    <section class="details-section"><h3>Job description</h3><p>${escapeHTML(company.description || "No job description provided.")}</p></section>
    <section class="details-section"><h3>Recruitment information</h3><p>Status: ${escapeHTML(company.status)}\nDeadline: ${escapeHTML(company.deadline || "Not listed")}</p>${officialLink}</section>
    <div class="details-footer">
      <button class="button ${applied ? "button-quiet" : "button-primary"}" data-action="application" data-id="${escapeHTML(company.id)}">${applied ? "Undo applied" : "Mark as applied"}</button>
      <button class="button button-quiet" data-action="close-details">Close</button>
    </div>`;
  $("#detailsDialog").showModal();
}
function resetFilters() {
  ["#searchInput", "#statusFilter", "#typeFilter", "#cgpaFilter", "#percentageFilter", "#salaryFilter", "#applicationFilter"].forEach(selector => {
    $(selector).value = "";
  });
  render();
}
function openAddDialog() {
  $("#formError").classList.add("hidden");
  $("#addCompanyForm").reset();
  $("#addDialog").showModal();
}
function addCompany(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const role = String(data.get("role") || "").trim();
  const cgpa = Number(data.get("cgpa"));
  const salary = Number(data.get("salary"));
  if (!name || !role || !Number.isFinite(cgpa) || cgpa < 0 || cgpa > 10 || !Number.isFinite(salary) || salary < 0) {
    $("#formError").textContent = "Enter a company, role, valid package, and CGPA between 0 and 10.";
    $("#formError").classList.remove("hidden");
    return;
  }
  const company = {
    id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name, shortName: initials(name), role,
    location: String(data.get("location") || "").trim(),
    type: String(data.get("type") || "Full-time"),
    status: String(data.get("status") || "Upcoming"),
    salary, cgpa, percentage: Number(data.get("percentage") || 60),
    deadline: String(data.get("deadline") || ""),
    overview: String(data.get("overview") || "").trim(),
    eligibility: String(data.get("eligibility") || "").trim(),
    description: String(data.get("description") || "").trim(),
    url: String(data.get("url") || "").trim()
  };
  const row = {
    name: company.name, short_name: company.shortName, role: company.role, location: company.location,
    type: company.type, status: company.status, salary: company.salary, cgpa: company.cgpa,
    percentage: company.percentage, eligibility_percentage: company.percentage,
    application_deadline: company.deadline || null, overview: company.overview,
    eligibility: company.eligibility, description: company.description, website: company.url
  };
  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = "Saving…";
  fetch(COMPANIES_ENDPOINT, {
    method: "POST",
    headers: apiHeaders({ Prefer: "return=representation" }),
    body: JSON.stringify(row)
  }).then(async response => {
    if (!response.ok) throw new Error(await response.text());
    const inserted = await response.json();
    if (inserted[0]) companies.unshift(fromDatabase(inserted[0]));
    $("#addDialog").close();
    render();
    showToast("Opportunity shared with everyone.");
  }).catch(error => {
    console.error("Could not add company:", error);
    $("#formError").textContent = "Could not save to the shared database. Confirm the Supabase SQL migration and INSERT policy have been run.";
    $("#formError").classList.remove("hidden");
  }).finally(() => {
    submitButton.disabled = false;
    submitButton.textContent = "Save opportunity";
  });
}
grid.addEventListener("click", event => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const { action, id } = button.dataset;
  if (action === "details") openDetails(id);
  if (action === "application") {
    applications[id] = (applications[id] || "Not Applied") === "Applied" ? "Not Applied" : "Applied";
    saveApplications();
    render();
    if ($("#detailsDialog").open && $("#detailsContent").querySelector(`[data-id="${CSS.escape(id)}"]`)) openDetails(id);
    showToast(applications[id] === "Applied" ? "Marked as applied." : "Application status updated.");
  }
});
$("#detailsContent").addEventListener("click", event => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  if (button.dataset.action === "close-details") $("#detailsDialog").close();
  if (button.dataset.action === "application") {
    const id = button.dataset.id;
    applications[id] = (applications[id] || "Not Applied") === "Applied" ? "Not Applied" : "Applied";
    saveApplications();
    render();
    openDetails(id);
    showToast(applications[id] === "Applied" ? "Marked as applied." : "Application status updated.");
  }
});
$("#openAddCompany").addEventListener("click", openAddDialog);
$("#closeAddCompany").addEventListener("click", () => $("#addDialog").close());
$("#cancelAddCompany").addEventListener("click", () => $("#addDialog").close());
$("#addCompanyForm").addEventListener("submit", addCompany);
$("#resetFilters").addEventListener("click", resetFilters);
$("#emptyReset").addEventListener("click", resetFilters);
["#searchInput", "#statusFilter", "#typeFilter", "#cgpaFilter", "#percentageFilter", "#salaryFilter", "#applicationFilter"].forEach(selector => {
  $(selector).addEventListener("input", render);
});
render();
loadRemoteCompanies();
