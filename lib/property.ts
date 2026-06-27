export function normalizeBedroomsLabel(label?: string | null) {
  const bedroomLabel = label?.trim() ?? "";

  if (!bedroomLabel) {
    return [];
  }

  return bedroomLabel
    .replace(/\s+\/\s+/g, "|")
    .replace(/\s+[•·]\s+/g, "|")
    .replace(/\s+[|;,]\s+/g, "|")
    .replace(/\s+e\s+/gi, "|")
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
}
