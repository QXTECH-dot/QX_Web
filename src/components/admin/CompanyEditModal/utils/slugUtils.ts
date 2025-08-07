export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

export const isSlugUnique = async (
  slug: string,
  excludeCompanyId?: string
): Promise<boolean> => {
  try {
    const response = await fetch("/api/admin/companies/check-slug", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ slug, excludeCompanyId }),
    });

    if (!response.ok) {
      throw new Error("Failed to check slug uniqueness");
    }

    const result = await response.json();
    return result.isUnique;
  } catch (error) {
    console.error("Error checking slug uniqueness:", error);
    return false;
  }
};

export const generateUniqueSlug = async (
  name: string,
  excludeCompanyId?: string
): Promise<string> => {
  let baseSlug = generateSlug(name);
  let slug = baseSlug;
  let counter = 1;

  while (!(await isSlugUnique(slug, excludeCompanyId))) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};
