import { SignatureForm } from "@/components/signature/SignatureForm";
import { useSignatureContext } from "@/app/SignatureContext";

export function EditPage() {
  const { data, update } = useSignatureContext();
  return <SignatureForm data={data} onChange={update} />;
}
