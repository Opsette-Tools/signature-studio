import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TemplateFilters, type FilterState } from "@/components/signature/TemplateFilters";
import { TemplateGallery } from "@/components/signature/TemplateGallery";
import { SectionCard } from "@/components/ui/SectionCard";
import { useFavorites } from "@/hooks/useFavorites";
import { useSignatureContext } from "@/app/SignatureContext";

const initial: FilterState = {
  query: "",
  category: "all",
  needsLogo: false,
  needsPhoto: false,
  textOnly: false,
};

export function TemplatesPage() {
  const { data, selectedTemplateId, setSelectedTemplateId } = useSignatureContext();
  const { favorites } = useFavorites();
  const [filters, setFilters] = useState<FilterState>(initial);
  const navigate = useNavigate();

  return (
    <div className="stack">
      <SectionCard
        title="Browse templates"
        extra={
          <Link to="/">
            <Button icon={<ArrowLeftOutlined />}>Back to studio</Button>
          </Link>
        }
      >
        <TemplateFilters value={filters} onChange={setFilters} favoritesCount={favorites.length} />
      </SectionCard>
      <TemplateGallery
        filters={filters}
        data={data}
        selectedId={selectedTemplateId}
        onSelect={(id) => {
          setSelectedTemplateId(id);
          navigate("/");
        }}
      />
    </div>
  );
}
