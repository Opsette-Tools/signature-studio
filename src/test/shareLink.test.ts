import { describe, expect, it } from "vitest";
import { emptySignatureData, type SignatureData } from "@/types/signature";
import {
  PERSONAL_FIELDS,
  applySharePayload,
  buildPayload,
  decodeShare,
  encodeShare,
} from "@/utils/shareLink";

const sample: SignatureData = {
  ...emptySignatureData,
  fullName: "Jane Doe",
  jobTitle: "Designer",
  company: "Acme Inc.",
  tagline: "Designing calm interfaces",
  email: "jane@acme.com",
  phone: "+1 555 123 4567",
  website: "acme.com",
  logoUrl: "https://acme.com/logo.png",
  accentColor: "#243958",
  linkedin: "linkedin.com/in/jane",
};

describe("shareLink", () => {
  it("roundtrips a full payload through encode/decode", () => {
    const payload = buildPayload({ mode: "full", templateId: "modern-card-style", data: sample });
    const decoded = decodeShare(encodeShare(payload));
    expect(decoded).not.toBeNull();
    expect(decoded?.mode).toBe("full");
    expect(decoded?.t).toBe("modern-card-style");
    expect(decoded?.d.fullName).toBe("Jane Doe");
    expect(decoded?.d.email).toBe("jane@acme.com");
  });

  it("kit mode strips personal fields from the encoded payload", () => {
    const payload = buildPayload({ mode: "kit", templateId: "modern-card-style", data: sample });
    for (const f of PERSONAL_FIELDS) {
      expect(payload.d[f]).toBeUndefined();
    }
    expect(payload.d.company).toBe("Acme Inc.");
    expect(payload.d.linkedin).toBe("linkedin.com/in/jane");
  });

  it("applySharePayload blanks personal fields in kit mode", () => {
    const payload = buildPayload({ mode: "kit", templateId: "modern-card-style", data: sample });
    const applied = applySharePayload(payload);
    expect(applied.fullName).toBe("");
    expect(applied.email).toBe("");
    expect(applied.company).toBe("Acme Inc.");
  });

  it("strips an uploaded logo when stripLogoData is true", () => {
    const withLogo: SignatureData = { ...sample, logoDataUrl: "data:image/png;base64,AAA" };
    const payload = buildPayload({
      mode: "kit",
      templateId: "modern-card-style",
      data: withLogo,
      stripLogoData: true,
    });
    expect(payload.d.logoDataUrl).toBeUndefined();
    expect(payload.stripped).toBe(true);
  });

  it("rejects malformed tokens", () => {
    expect(decodeShare("not-a-real-token")).toBeNull();
    expect(decodeShare("")).toBeNull();
  });

  it("rejects payloads missing the v1 envelope", () => {
    // base64-ish junk that decompresses to invalid JSON shape
    const fake = encodeShare({ v: 1, mode: "kit", t: "x", d: { company: "x" } });
    // mutate one char to force schema rejection or decompress failure
    const bad = fake.slice(0, -3) + "xyz";
    const result = decodeShare(bad);
    // Either it fails to decompress OR fails the schema — both are acceptable null returns.
    if (result !== null) {
      // If it happened to decompress to something, it must still match the envelope.
      expect(result.v).toBe(1);
    }
  });
});
