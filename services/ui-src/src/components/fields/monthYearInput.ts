export const formatMonthYearInput = (value: string) => {
  const sanitized = value.replaceAll(/[^\d/]/g, "").slice(0, 7);

  if (sanitized.includes("/")) {
    const [rawMonth = "", rawYear = ""] = sanitized.split("/");
    const month = rawMonth.replaceAll(/\D/g, "").slice(0, 2);
    const year = rawYear.replaceAll(/\D/g, "").slice(0, 4);

    if (!month) return year ? `/${year}` : "";

    const normalizedMonth = month.length === 1 ? `0${month}` : month;
    return year ? `${normalizedMonth}/${year}` : `${normalizedMonth}/`;
  }

  const digitsOnly = sanitized.replaceAll(/\D/g, "").slice(0, 6);
  if (digitsOnly.length === 5) {
    return `0${digitsOnly[0]}/${digitsOnly.slice(1)}`;
  }
  if (digitsOnly.length <= 2) return digitsOnly;
  return `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}`;
};

export const formatWithPlaceholders = (value: string) => {
  if (!value) return "MM/YYYY";

  const [month = "", year = ""] = value.split("/");
  const paddedMonth = month.padEnd(2, "M");
  const paddedYear = year.padEnd(4, "Y");

  return `${paddedMonth}/${paddedYear}`;
};
