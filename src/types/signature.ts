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

  // Branding color — drives every template's accent (surname, icons, bars, CTAs).
  accentColor: string;

  // When true (default), the surname renders in the accent color for a two-tone
  // name; when false, the whole name is single-color ink. A per-signature style
  // choice — some corporate looks want the restrained single color.
  twoToneName: boolean;
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
  accentColor: "#c2410c",
  twoToneName: true,
};

/**
 * Realistic placeholder data used to render template previews (thumbnails + the
 * main preview) BEFORE the user has typed anything. A signature gallery must show
 * what each template looks like so they can be browsed and compared — rendering
 * empty data produces blank thumbnails. The moment the user enters real data,
 * `previewData` switches over to it. See previewData() below.
 */
export const sampleSignatureData: SignatureData = {
  fullName: "Jane Doe",
  pronouns: "she/her",
  jobTitle: "Senior Designer",
  company: "Acme Inc.",
  tagline: "Design that gets out of the way.",
  email: "jane@acme.com",
  phone: "+1 (555) 234-5678",
  website: "acme.com",
  bookingLink: "cal.com/jane",
  address: "San Francisco, CA",
  logoUrl: "",
  logoDataUrl: "",
  profileImageDataUrl: "",
  linkedin: "linkedin.com/in/janedoe",
  instagram: "",
  facebook: "",
  youtube: "",
  twitter: "x.com/janedoe",
  tiktok: "",
  ctaLabel: "Book a call",
  ctaUrl: "cal.com/jane",
  disclaimer: "This email and any attachments are confidential.",
  accentColor: "#c2410c",
  twoToneName: true,
};

export type SavedSignature = {
  id: string;
  name: string;
  templateId: string;
  data: SignatureData;
  updatedAt: number;
};

export const MAX_SAVED_SIGNATURES = 3;
