export const industryOptions = Array.from(
  new Set([
    "Agriculture, Forestry and Fishing",
    "Mining",
    "Manufacturing",
    "Electricity, Gas, Water and Waste Services",
    "Construction",
    "Wholesale Trade",
    "Retail Trade",
    "Accommodation and Food Services",
    "Transport, Postal and Warehousing",
    "Information Media and Telecommunications",
    "Financial and Insurance Services",
    "Rental, Hiring and Real Estate Services",
    "Professional, Scientific and Technical Services",
    "Administrative and Support Services",
    "Public Administration and Safety",
    "Education and Training",
    "Health Care and Social Assistance",
    "Arts and Recreation Services",
    "Other Services",
  ])
);

export const employeeCountOptions = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1000+",
];

export const statusOptions = [
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "suspended", label: "Suspended" },
];
