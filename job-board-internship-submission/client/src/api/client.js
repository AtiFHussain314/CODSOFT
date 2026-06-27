export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const getAssetUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE.replace("/api", "")}${path}`;
};

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("tb_token");
  const { body, headers = {}, ...rest } = options;
  const isFormData = body instanceof FormData;

  const response = await fetch(`${API_BASE}${path}`, {
    ...rest,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers
    }
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
}

