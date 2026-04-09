export const getIndustryFromCategory = (category) => {
  if (!category) return "general";

  if (category.includes("부동산")) return "real_estate";
  if (category.includes("근로") || category.includes("노동")) return "labor";
  if (category.includes("금전")) return "finance";
  if (category.includes("프리랜서") || category.includes("용역")) return "it";
  if (category.includes("스마트팜")) return "smartfarm";

  return "general";
};