import { DeleteOutlined, EditOutlined, SaveOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Input, Modal, Popconfirm, Radio, message } from "antd";
import { useState } from "react";
import type { SavedSignature, SignatureData } from "@/types/signature";
import { getTemplateById } from "@/data/templates";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionCard } from "@/components/ui/SectionCard";
import { useLocalSignatures } from "@/hooks/useLocalSignatures";

type Props = {
  currentTemplateId: string;
  currentData: SignatureData;
  onLoad: (entry: SavedSignature) => void;
};

export function SavedSignatures({ currentTemplateId, currentData, onLoad }: Props) {
  const { items, save, rename, remove, isFull, max } = useLocalSignatures();
  const [saveOpen, setSaveOpen] = useState(false);
  const [name, setName] = useState("");
  const [replaceId, setReplaceId] = useState<string>("");
  const [renameTarget, setRenameTarget] = useState<SavedSignature | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const openSave = () => {
    setName(`Signature ${items.length + 1}`);
    setReplaceId(isFull ? items[0]?.id ?? "" : "");
    setSaveOpen(true);
  };

  const handleSave = () => {
    save({
      name,
      templateId: currentTemplateId,
      data: currentData,
      replaceId: isFull ? replaceId : undefined,
    });
    setSaveOpen(false);
    message.success(isFull ? "Saved (replaced)" : "Saved");
  };

  return (
    <SectionCard
      title={`Saved signatures (${items.length}/${max})`}
      hint="Stored locally on this device only."
      extra={
        <Button type="primary" size="small" icon={<SaveOutlined />} onClick={openSave}>
          Save current
        </Button>
      }
    >
      {items.length === 0 ? (
        <EmptyState title="No saved signatures yet" />
      ) : (
        <div className="stack">
          {items.map((it) => {
            const tpl = getTemplateById(it.templateId);
            return (
              <div className="saved-row" key={it.id}>
                <div className="saved-row__meta">
                  <div className="saved-row__name">{it.name}</div>
                  <div className="saved-row__sub">
                    {tpl?.name ?? "Unknown template"} ·{" "}
                    {new Date(it.updatedAt).toLocaleString()}
                  </div>
                </div>
                <div className="saved-row__actions">
                  <Button
                    size="small"
                    icon={<UploadOutlined />}
                    onClick={() => {
                      onLoad(it);
                      message.success(`Loaded "${it.name}"`);
                    }}
                  >
                    Load
                  </Button>
                  <Button
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => {
                      setRenameTarget(it);
                      setRenameValue(it.name);
                    }}
                  />
                  <Popconfirm
                    title="Delete this saved signature?"
                    onConfirm={() => remove(it.id)}
                    okText="Delete"
                    okButtonProps={{ danger: true }}
                  >
                    <Button size="small" danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        title="Save current signature"
        open={saveOpen}
        onOk={handleSave}
        onCancel={() => setSaveOpen(false)}
        okText="Save"
      >
        <div className="stack">
          <Input
            placeholder="Signature name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {isFull ? (
            <div>
              <p style={{ marginTop: 8, marginBottom: 8 }}>
                You already have {max} saved signatures. Pick one to replace:
              </p>
              <Radio.Group
                value={replaceId}
                onChange={(e) => setReplaceId(e.target.value)}
              >
                <div className="stack-sm">
                  {items.map((it) => (
                    <Radio key={it.id} value={it.id}>
                      {it.name}
                    </Radio>
                  ))}
                </div>
              </Radio.Group>
            </div>
          ) : null}
        </div>
      </Modal>

      <Modal
        title="Rename signature"
        open={Boolean(renameTarget)}
        onOk={() => {
          if (renameTarget) rename(renameTarget.id, renameValue);
          setRenameTarget(null);
        }}
        onCancel={() => setRenameTarget(null)}
        okText="Rename"
      >
        <Input value={renameValue} onChange={(e) => setRenameValue(e.target.value)} />
      </Modal>
    </SectionCard>
  );
}
