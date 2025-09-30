export const parseUtmParams = (urlSearchParams: URLSearchParams) => {
  const utm: Record<string, string | string[]> = {};

  ["utm_campaign", "utm_source", "utm_medium", "utm_term", "utm_content"].forEach((key) => {
    const values = urlSearchParams.getAll(key);
    if (values.length === 1) {
      utm[key] = values[0];
    } else if (values.length > 1) {
      utm[key] = values; // store array if multiple values
    }
  });

  return utm;
};
