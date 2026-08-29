function buildQueryString(params = {}) {
  const cleaned = Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) => value !== undefined && value !== null && value !== ""
    )
  );

  const queryString = new URLSearchParams(cleaned).toString();

  return queryString ? `?${queryString}` : "";
}

export { buildQueryString };
