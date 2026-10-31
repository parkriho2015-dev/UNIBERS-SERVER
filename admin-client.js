async function adminLogin(password) {
  const res = await fetch("/api/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ password })
  });

  return await res.json();
}

async function adminLogout() {
  const res = await fetch("/api/logout", { method: "POST" });
  return await res.json();
}

async function getAdminStatus() {
  const res = await fetch("/api/me");
  return await res.json();
}

async function getResults() {
  const res = await fetch("/api/results");
  return await res.json();
}

async function saveResult(round, home, away, homeScore, awayScore, date = "") {
  const res = await fetch("/api/results", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      round, home, away, homeScore, awayScore, date
    })
  });

  return await res.json();
}
