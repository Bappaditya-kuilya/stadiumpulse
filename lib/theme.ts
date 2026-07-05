export const colors = {
  primary: "#0f356e",
  secondary: "#6b7280",
  tertiary: "#e5e7eb",
  neutral: "#fafafa",
  surface: "#ffffff",
  onSurface: "#000000",
  error: "#d92d20",
  border: "#e8e8e8",
  borderSubtle: "#e5e7eb",
  mutedText: "#222222",
};

export const font = {
  headline: { fontSize: 32, fontWeight: "700" as const, lineHeight: 38 },
  title: { fontSize: 26, fontWeight: "500" as const, lineHeight: 31 },
  heading: { fontSize: 21, fontWeight: "500" as const, lineHeight: 25 },
  subheading: { fontSize: 17, fontWeight: "500" as const, lineHeight: 20 },
  bodyLg: { fontSize: 16, fontWeight: "400" as const, lineHeight: 24 },
  body: { fontSize: 14, fontWeight: "400" as const, lineHeight: 21 },
  bodySm: { fontSize: 12, fontWeight: "400" as const, lineHeight: 18 },
  labelLg: { fontSize: 14, fontWeight: "500" as const, lineHeight: 20 },
  label: { fontSize: 13, fontWeight: "500" as const, lineHeight: 18 },
  labelSm: { fontSize: 12, fontWeight: "500" as const, lineHeight: 16 },
  caption: { fontSize: 11, fontWeight: "400" as const, lineHeight: 14 },
};

export const buttonPrimary = {
  backgroundColor: colors.primary,
  height: 64,
  borderRadius: 24,
  paddingHorizontal: 32,
  paddingVertical: 25,
  alignItems: "center" as const,
  justifyContent: "center" as const,
};

export const buttonSecondary = {
  backgroundColor: colors.surface,
  height: 64,
  borderRadius: 24,
  paddingHorizontal: 32,
  paddingVertical: 25,
  borderWidth: 1,
  borderColor: colors.border,
  alignItems: "center" as const,
  justifyContent: "center" as const,
};

export const card = {
  backgroundColor: colors.neutral,
  borderRadius: 8,
  padding: 16,
};

export const input = {
  backgroundColor: colors.surface,
  borderRadius: 9999,
  paddingHorizontal: 16,
  paddingVertical: 12,
  borderWidth: 1,
  borderColor: colors.border,
};

export const chip = {
  backgroundColor: colors.surface,
  borderRadius: 9999,
  paddingHorizontal: 14,
  paddingVertical: 8,
  borderWidth: 1,
  borderColor: colors.border,
};
