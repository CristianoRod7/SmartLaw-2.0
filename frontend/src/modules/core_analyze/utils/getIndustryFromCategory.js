export const getIndustryFromCategory = (category) => {
  if (!category) return "general";

  if (category.includes("부동산")) return "real_estate";
  if (category.includes("근로") || category.includes("노동")) return "labor";
  if (category.includes("금전")) return "finance";
  if (
    category.includes("프리랜서") ||
    category.includes("용역") ||
    category.includes("외주") ||
    category.includes("비밀유지") ||
    category.includes("NDA") ||
    category.includes("유지보수") ||
    category.includes("소프트웨어")
  ) return "it";
  if (category.includes("스마트팜")) return "smartfarm";

  return "general";
};