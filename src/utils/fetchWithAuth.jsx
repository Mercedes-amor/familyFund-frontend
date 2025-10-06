
export async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(url, {
    ...options, //...options — permite pasar method, body, headers, etc., y los incorpora a la petición.
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  // Si la sesión expiró y detecta el error 401 --> redirige automáticamente a /login
  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login?sessionExpired=true";
    return;
  }

  return res;
}
