import { ApiError } from "../utils/ApiError.js";

const API_BASE = import.meta.env.VITE_API_URL || "";

const request = async (
  endpoint,
  {
    method = "GET",
    body = null,
    headers = {},
    isFormData = false,
    retry = true,
  } = {}
) => {
  const url = API_BASE + endpoint;

  const opts = {
    method: method,
    headers: { ...headers },
    credentials: "include",
  };

  if (body != null) {
    if (isFormData) {
      opts.body = body;
    } else {
      opts.headers["Content-Type"] = "application/json";
      opts.body = JSON.stringify(body);
    }
  }

  const res = await fetch(url, opts);

  let data = null;
  try {
    data = await res.json();
  } catch (error) {
    if (!res.ok) {
      throw new ApiError(res.status, "Server returned an invalid response", []);
    }
    return null;
  }

  if (!res.ok) {
    if (res.status == 401 && retry) {
      const refreshed = await tryRefreshToken();

      if (refreshed) {
        return request(endpoint, {
          method,
          body,
          headers,
          isFormData,
          retry: false,
        });
      }
    }

    throw new ApiError(
      res.status,
      data?.message ?? "Request failed",
      data?.errors ?? []
    );
  }

  return data;
};

const tryRefreshToken = async () => {
  try {
    const res = await fetch(`${API_BASE || ""}/api/v1/users/refresh-token`, {
      method: "POST",
      credentials: "include",
    });

    return res.ok;
  } catch (error) {
    return false;
  }
};

export const apiClient = {
  get: (endpoint, options = {}) => {
    return request(endpoint, { method: "GET", ...options });
  },

  post: (endpoint, body, options = {}) => {
    return request(endpoint, { method: "POST", body, ...options });
  },

  patch: (endpoint, body, options = {}) => {
    return request(endpoint, { method: "PATCH", body, ...options });
  },

  delete: (endpoint, options = {}) => {
    return request(endpoint, { method: "DELETE", ...options });
  },
};
