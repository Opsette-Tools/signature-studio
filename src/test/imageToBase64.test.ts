import { describe, expect, it, vi } from "vitest";

// We test the private isFullyOpaque path by exercising resizeImage. jsdom's canvas
// doesn't actually paint pixels, so we mock canvas APIs to simulate transparent
// vs opaque image data.

import { LOGO_PRESET, resizeImage } from "@/utils/imageToBase64";

function makeCanvasMock(opaque: boolean) {
  const w = 4;
  const h = 4;
  const data = new Uint8ClampedArray(w * h * 4);
  // Fill with red
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255;
    data[i + 1] = 0;
    data[i + 2] = 0;
    data[i + 3] = opaque ? 255 : 128; // alpha
  }

  const ctx = {
    drawImage: vi.fn(),
    getImageData: vi.fn(() => ({ data, width: w, height: h, colorSpace: "srgb" as PredefinedColorSpace })),
  };

  // toDataURL: png returns long string, jpeg returns short string (so the
  // size-comparison branch would prefer JPEG if reached).
  const toDataURL = vi.fn((mime: string) =>
    mime === "image/jpeg"
      ? "data:image/jpeg;base64,SHORT"
      : "data:image/png;base64,LONGLONGLONGLONGLONGLONGLONGLONGLONGLONG",
  );

  return { ctx, toDataURL };
}

function installCanvasMocks(opaque: boolean) {
  const { ctx, toDataURL } = makeCanvasMock(opaque);
  const origCreateElement = document.createElement.bind(document);
  vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
    if (tag === "canvas") {
      const el = origCreateElement("canvas");
      // @ts-expect-error — overriding for test
      el.getContext = () => ctx;
      // @ts-expect-error — overriding for test
      el.toDataURL = toDataURL;
      return el;
    }
    return origCreateElement(tag);
  });
  return { toDataURL };
}

function makeFakeImage() {
  // Stub Image constructor so loadImage resolves immediately without a network fetch.
  class FakeImage {
    width = 8;
    height = 8;
    onload: (() => void) | null = null;
    onerror: ((e: unknown) => void) | null = null;
    set src(_v: string) {
      queueMicrotask(() => this.onload?.());
    }
  }
  // @ts-expect-error — replacing global for test
  globalThis.Image = FakeImage;
}

describe("resizeImage transparency handling", () => {
  it("keeps PNG when canvas has any transparent pixel", async () => {
    const { toDataURL } = installCanvasMocks(/* opaque */ false);
    makeFakeImage();
    const file = new File(["x"], "logo.png", { type: "image/png" });
    const result = await resizeImage(file, LOGO_PRESET);
    expect(result.startsWith("data:image/png")).toBe(true);
    // JPEG path must NOT have been considered (only the primary PNG call)
    expect(toDataURL).toHaveBeenCalledTimes(1);
    expect(toDataURL).toHaveBeenCalledWith("image/png", LOGO_PRESET.quality);
  });

  it("considers JPEG when canvas is fully opaque (no alpha to lose)", async () => {
    const { toDataURL } = installCanvasMocks(/* opaque */ true);
    makeFakeImage();
    const file = new File(["x"], "logo.png", { type: "image/png" });
    const result = await resizeImage(file, LOGO_PRESET);
    // JPEG returned because mock JPEG is shorter than mock PNG
    expect(result.startsWith("data:image/jpeg")).toBe(true);
    expect(toDataURL).toHaveBeenCalledTimes(2); // PNG primary + JPEG comparison
  });
});
