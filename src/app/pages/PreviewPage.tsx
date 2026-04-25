import { CopyPanel } from "@/components/signature/CopyPanel";
import { SignaturePreview } from "@/components/signature/SignaturePreview";
import { SectionCard } from "@/components/ui/SectionCard";
import { useSignatureContext } from "@/app/SignatureContext";

export function PreviewPage() {
  const { selectedTemplate, data } = useSignatureContext();
  return (
    <div className="stack">
      <SectionCard
        title={selectedTemplate ? `Preview · ${selectedTemplate.name}` : "Preview"}
        hint="This is how your signature will look in an email client."
      >
        <SignaturePreview template={selectedTemplate} data={data} />
      </SectionCard>
      <CopyPanel template={selectedTemplate} data={data} />
    </div>
  );
}
