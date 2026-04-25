export type SignatureData = {
  // Identity
  fullName: string;
  pronouns: string;
  jobTitle: string;
  company: string;
  tagline: string;

  // Contact
  email: string;
  phone: string;
  website: string;
  bookingLink: string;
  address: string;

  // Media (base64 data URL or http(s) URL)
  logoUrl: string;
  logoDataUrl: string;
  profileImageDataUrl: string;

  // Social
  linkedin: string;
  instagram: string;
  facebook: string;
  youtube: string;
  twitter: string;
  tiktok: string;

  // CTA
  ctaLabel: string;
  ctaUrl: string;

  // Footer
  disclaimer: string;

  // Branding color (used by some templates)
  accentColor: string;
};

export const emptySignatureData: SignatureData = {
  fullName: "",
  pronouns: "",
  jobTitle: "",
  company: "",
  tagline: "",
  email: "",
  phone: "",
  website: "",
  bookingLink: "",
  address: "",
  logoUrl: "",
  logoDataUrl: "",
  profileImageDataUrl: "",
  linkedin: "",
  instagram: "",
  facebook: "",
  youtube: "",
  twitter: "",
  tiktok: "",
  ctaLabel: "",
  ctaUrl: "",
  disclaimer: "",
  accentColor: "#4f46e5",
};

export type SavedSignature = {
  id: string;
  name: string;
  templateId: string;
  data: SignatureData;
  updatedAt: number;
};

export const MAX_SAVED_SIGNATURES = 3;
