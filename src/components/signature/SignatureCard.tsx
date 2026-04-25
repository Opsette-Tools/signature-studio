import { StarFilled, StarOutlined } from "@ant-design/icons";
import { Tag, Tooltip } from "antd";
import { CATEGORY_LABELS, type SignatureTemplate } from "@/types/template";
import type { SignatureData } from "@/types/signature";

type Props = {
  template: SignatureTemplate;
  data: SignatureData;
  active: boolean;
  favorite: boolean;
  onSelect: () => void;
  onToggleFavorite: () => void;
};

export function SignatureCard({ template, data, active, favorite, onSelect, onToggleFavorite }: Props) {
  return (
    <div
      className={`template-card${active ? " template-card--active" : ""}`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      <div className="template-card__head">
        <div>
          <h4 className="template-card__name">{template.name}</h4>
          <p className="template-card__desc">{template.description}</p>
        </div>
        <Tooltip title={favorite ? "Unfavorite" : "Favorite"}>
          <button
            type="button"
            className={`fav-btn${favorite ? " fav-btn--on" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            aria-label="Toggle favorite"
          >
            {favorite ? <StarFilled /> : <StarOutlined />}
          </button>
        </Tooltip>
      </div>
      <div className="template-card__preview">
        <div
          className="template-card__preview-scale"
          dangerouslySetInnerHTML={{ __html: template.renderHtml(data) }}
        />
      </div>
      <div className="template-card__tags">
        <Tag color="processing">{CATEGORY_LABELS[template.category]}</Tag>
        {template.supportsLogo ? <Tag>Logo</Tag> : null}
        {template.supportsImage ? <Tag>Photo</Tag> : null}
        {template.supportsSocialLinks ? <Tag>Social</Tag> : null}
      </div>
    </div>
  );
}
