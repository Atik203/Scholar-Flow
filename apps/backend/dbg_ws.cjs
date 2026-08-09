(async () => {
  const login = async (email) => {
    const r = await fetch("http://localhost:5000/api/auth/signin", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: "password123" }),
    });
    const j = await r.json();
    return j?.data?.accessToken;
  };
  const t = await login("researcher@scholarflow.com");
  const res = await fetch("http://localhost:5000/api/workspaces?limit=5", {
    headers: { Authorization: `Bearer ${t}` },
  });
  console.log("workspaces status:", res.status);
  const j = await res.json();
  console.log("top-level keys:", Object.keys(j));
  console.log(JSON.stringify(j).slice(0, 400));
})().catch(e => console.error("ERR", e.message));
