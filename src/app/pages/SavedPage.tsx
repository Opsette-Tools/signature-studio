import { SavedSignatures } from "@/components/signature/SavedSignatures";
import { useSignatureContext } from "@/app/SignatureContext";

export function SavedPage() {
  const { data, selectedTemplateId, replaceAll, setSelectedTemplateId } = useSignatureContext();
  return (
    <SavedSignatures
      currentTemplateId={selectedTemplateId}
      currentData={data}
      onLoad={(entry) => {
        replaceAll(entry.data);
        setSelectedTemplateId(entry.templateId);
      }}
    />
  );
}
