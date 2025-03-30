function getCsrfToken() {
  if (import.meta.client) {
    return document
      .querySelector('meta[name="csrf-token"]')
      ?.getAttribute("content");
  }

  const csrfToken = useCookie("csrf-token").value;
  if (!csrfToken) {
    throw new Error("CSRF token not found");
  }
  return csrfToken;
}

export const useApi = () => {
  const fetchWithCsrf = async (url: string, options: RequestInit = {}) => {
    const csrfToken = getCsrfToken();

    console.log("csrfToken", csrfToken);

    const headers = {
      ...options.headers,
      "X-CSRF-Token": csrfToken || "",
    };

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "API request failed");
    }

    return response.json();
  };

  return {
    fetchWithCsrf,
  };
};
