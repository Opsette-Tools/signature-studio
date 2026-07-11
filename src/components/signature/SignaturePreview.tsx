import type { SignatureData } from "@/types/signature";
import type { SignatureTemplate } from "@/types/template";
import { hasAnyContent } from "@/utils/sanitizeSignatureData";

export type PreviewCanvas = "light" | "dark";

type Props = {
  template: SignatureTemplate | undefined;
  data: SignatureData;
  /**
   * The recipient's inbox canvas. A signature inherits the inbox background, not
   * the app theme — so this toggle is independent of the app's own light/dark.
   * Every template must still read on a dark canvas (§7 of the rebuild plan).
   */
  canvas?: PreviewCanvas;
};

// The tail of a plausible email, shown ABOVE the signature so it reads as
// "placed in a real message" instead of floating in an empty box — the framing
// is what makes a signature look designed rather than naked.
const EMAIL_TAIL = "Thanks so much — talk soon,";

export function SignaturePreview({ template, data, canvas = "light" }: Props) {
  const canvasClass = `sig-inbox sig-inbox--${canvas}`;

  if (!template) {
    return (
      <div className={canvasClass}>
        <div className="sig-inbox__empty">Select a template to preview your signature</div>
      </div>
    );
  }
  if (!hasAnyContent(data)) {
    return (
      <div className={canvasClass}>
        <div className="sig-inbox__empty">
          <p>
            This is the <strong>{template.name}</strong> template. Fill in your details on the left
            to see your signature here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={canvasClass}>
      <div className="sig-inbox__window">
        <div className="sig-inbox__chrome" aria-hidden="true">
          <span className="sig-inbox__dot" />
          <span className="sig-inbox__dot" />
          <span className="sig-inbox__dot" />
          <span className="sig-inbox__from">New message</span>
        </div>
        <div className="sig-inbox__body">
          <p className="sig-inbox__tail">{EMAIL_TAIL}</p>
          <div
            className="sig-inbox__signature"
            // Inline HTML from a template renderer — required to be email-safe markup
            dangerouslySetInnerHTML={{ __html: template.renderHtml(data) }}
          />
        </div>
      </div>
    </div>
  );
}
