import { ArrowRightOutlined, EyeOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import { TemplateFilters, type FilterState } from "@/components/signature/TemplateFilters";
import { TemplateGallery } from "@/components/signature/TemplateGallery";
import { SectionCard } from "@/components/ui/SectionCard";
import { getTemplateById } from "@/data/templates";
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
  const selectedTemplate = getTemplateById(selectedTemplateId);

  return (
    <div className="stack">
      <SectionCard
        title="Choose a template"
        hint="Step 1: pick a style. Step 2: use Edit info to enter your details. Step 3: open Preview to copy it."
        extra={
          <div className="row">
            <Link to="/edit">
              <Button type="primary" icon={<ArrowRightOutlined />}>
                Edit info
              </Button>
            </Link>
            <Link to="/preview">
              <Button icon={<EyeOutlined />}>Preview</Button>
            </Link>
          </div>
        }
      >
        <TemplateFilters value={filters} onChange={setFilters} favoritesCount={favorites.length} />
        {selectedTemplate ? (
          <p className="selected-template-note">Selected: {selectedTemplate.name}</p>
        ) : null}
      </SectionCard>
      <TemplateGallery
        filters={filters}
        data={data}
        selectedId={selectedTemplateId}
        onSelect={setSelectedTemplateId}
      />
    </div>
  );
}

