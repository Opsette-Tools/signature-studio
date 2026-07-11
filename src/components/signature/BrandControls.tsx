import { Form, Switch, Tooltip } from "antd";
import type { SignatureData } from "@/types/signature";

type Props = {
  data: SignatureData;
  onChange: <K extends keyof SignatureData>(key: K, value: SignatureData[K]) => void;
};

// The five house accents from the rebuild mockup — the quick way to see the pop.
// A buyer's brand color drops in via the custom picker at the end.
const PRESETS: { name: string; hex: string }[] = [
  { name: "Rust", hex: "#c2410c" },
  { name: "Indigo", hex: "#4338ca" },
  { name: "Teal", hex: "#0f766e" },
  { name: "Crimson", hex: "#be123c" },
  { name: "Ink", hex: "#0e1420" },
  { name: "Violet", hex: "#7c3aed" },
];

function firstLast(fullName: string): [string, string] {
  const parts = (fullName || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return ["Your", "Name"];
  if (parts.length === 1) return [parts[0]!, ""];
  return [parts[0]!, parts.slice(1).join(" ")];
}

export function BrandControls({ data, onChange }: Props) {
  const accent = data.accentColor || "#c2410c";
  const [first, last] = firstLast(data.fullName);

  return (
    <Form layout="vertical">
      <Form.Item
        label="Brand color"
        style={{ marginBottom: 16 }}
        extra="Drives every template — the surname, icons, bars, and buttons all read from this one color."
      >
        <div className="brand-swatches">
          {PRESETS.map((p) => {
            const active = accent.toLowerCase() === p.hex.toLowerCase();
            return (
              <Tooltip key={p.hex} title={p.name}>
                <button
                  type="button"
                  className={`brand-swatch${active ? " is-active" : ""}`}
                  style={{ background: p.hex }}
                  aria-label={p.name}
                  aria-pressed={active}
                  onClick={() => onChange("accentColor", p.hex)}
                />
              </Tooltip>
            );
          })}
          <Tooltip title="Custom color">
            <label className="brand-swatch brand-swatch--custom" aria-label="Custom color">
              <input
                type="color"
                value={accent}
                onChange={(e) => onChange("accentColor", e.target.value)}
              />
              <span aria-hidden>+</span>
            </label>
          </Tooltip>
        </div>
      </Form.Item>

      <Form.Item
        label="Two-tone name"
        style={{ marginBottom: 8 }}
        extra="Show the last name in your brand color for instant identity. Turn off for a restrained, single-color name."
      >
        <div className="brand-toggle-row">
          <Switch
            checked={data.twoToneName}
            onChange={(v) => onChange("twoToneName", v)}
          />
          <span className="brand-name-example" aria-hidden>
            <span style={{ color: "var(--color-text)" }}>{first}</span>
            {last ? (
              <>
                {" "}
                <span style={{ color: data.twoToneName ? accent : "var(--color-text)" }}>{last}</span>
              </>
            ) : null}
          </span>
        </div>
      </Form.Item>
    </Form>
  );
}
