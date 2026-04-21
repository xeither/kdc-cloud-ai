import tokens from '../../design-tokens.json';
import {
  IconEdit, IconTrash, IconCopy, IconPlus, IconClose,
  IconCalendar, IconArrowUp, IconArrowDown, IconCloudAi,
} from '../../icons';

function Section({ title, children }) {
  return (
    <section className="mb-10">
      <h3 className="text-kdc-title font-medium text-kdc-primary mb-4 pb-2 border-b border-kdc-border">
        {title}
      </h3>
      {children}
    </section>
  );
}

function Row({ label, children }) {
  return (
    <div className="grid grid-cols-[200px_1fr] gap-4 py-2 items-center">
      <div className="font-mono text-sm text-kdc-text/70">{label}</div>
      <div>{children}</div>
    </div>
  );
}

function Swatch({ name, value, description }) {
  const isLight = /^#(f|e|d)/i.test(value) || value.includes('255');
  return (
    <div className="inline-flex flex-col mr-4 mb-4">
      <div
        className="w-[120px] h-[72px] rounded border border-kdc-border flex items-end p-2"
        style={{ background: value }}
      >
        <span className={`font-mono text-[11px] ${isLight ? 'text-kdc-text' : 'text-white'}`}>
          {value}
        </span>
      </div>
      <div className="text-[13px] mt-1 font-mono">{name}</div>
      {description && <div className="text-[11px] text-kdc-text/60 max-w-[120px]">{description}</div>}
    </div>
  );
}

function TypeSample({ name, size, weight, sample }) {
  return (
    <Row label={`${name} — ${size} / ${weight}`}>
      <span style={{ fontSize: size, fontWeight: weight }}>{sample}</span>
    </Row>
  );
}

export default function DesignSystem() {
  return (
    <div className="max-w-[1200px]">
      <div className="mb-6">
        <h2 className="text-kdc-title font-medium text-kdc-primary mb-2">KDC Design System</h2>
        <p className="text-sm text-kdc-text/70">
          Single source of truth: <code className="font-mono">src/design-tokens.json</code> v{tokens.$version} ·
          Extracted from wr-rd-kmp-aa.kalay.us · Tokens Studio compatible
        </p>
      </div>

      <Section title="1. Colors">
        <div className="flex flex-wrap">
          {Object.entries(tokens.color.kdc).map(([k, v]) => (
            <Swatch key={k} name={k} value={v.value} description={v.description} />
          ))}
        </div>
      </Section>

      <Section title="2. Typography">
        <TypeSample name="kdcNavbarProduct" size="23px" weight="600" sample="KDC Internal" />
        <TypeSample name="kdcTitle" size="20.8px" weight="500" sample="申請單列表 / VLM Profiles" />
        <TypeSample name="kdcEmail" size="18px" weight="400" sample="kmp_admin@tutk.com" />
        <TypeSample name="kdcTable / kdcSidebar / kdcBtn" size="16px" weight="400" sample="表格內容 / 側邊欄項目 / 按鈕文字" />
        <TypeSample name="kdcBody" size="14px" weight="400" sample="一般內文 14px" />
        <Row label="fontFamily.kdc">
          <code className="font-mono text-[13px]">{tokens.fontFamily.kdc.value}</code>
        </Row>
      </Section>

      <Section title="3. Sizing">
        {Object.entries(tokens.sizing).map(([k, v]) => (
          <Row key={k} label={k}>
            <span className="font-mono">{v.value}</span>
            {v.description && <span className="ml-3 text-sm text-kdc-text/60">{v.description}</span>}
          </Row>
        ))}
      </Section>

      <Section title="4. Border Radius">
        {Object.entries(tokens.borderRadius).map(([k, v]) => (
          <Row key={k} label={k}>
            <div className="flex items-center gap-3">
              <div
                className="w-16 h-10 bg-kdc-primary"
                style={{ borderRadius: v.value }}
              />
              <span className="font-mono text-sm">{v.value}</span>
              {v.description && <span className="text-sm text-kdc-text/60">{v.description}</span>}
            </div>
          </Row>
        ))}
      </Section>

      <Section title="5. Buttons">
        <Row label="primary">
          <button className="bg-kdc-primary-alt text-white rounded-btn px-5 py-2 text-kdc-btn">
            + 新增
          </button>
        </Row>
        <Row label="secondary">
          <button className="bg-white text-kdc-primary border border-kdc-primary rounded-btn px-5 py-2 text-kdc-btn">
            取消
          </button>
        </Row>
      </Section>

      <Section title="6. Form Controls">
        <Row label="input">
          <input type="text" placeholder="公司名稱" className="h-9 border border-kdc-border rounded px-2.5 w-64" />
        </Row>
        <Row label="select">
          <select className="h-9 border border-kdc-border rounded px-2.5 w-40">
            <option>類型</option>
          </select>
        </Row>
        <Row label="toggle (on)">
          <div className="toggle-slider active" />
        </Row>
        <Row label="toggle (off)">
          <div className="toggle-slider" />
        </Row>
      </Section>

      <Section title="7. Tabs (folder-shape)">
        <div className="bg-white p-4">
          <ul className="flex flex-wrap pl-[5px] m-0">
            {["Tab One", "Tab Two", "Tab Three"].map((t, i) => (
              <li
                key={t}
                className={`cursor-pointer flex justify-center list-none mr-[5px] min-w-[50px] px-4 py-1.5 relative tracking-[0.1rem] font-normal text-kdc-table rounded-t-[10px] border border-transparent border-b-0
                  ${i === 0 ? 'bg-white text-kdc-primary-alt z-10' : 'bg-kdc-tab-unselected text-white'}`}
                style={{ transform: 'skew(-20deg)' }}
              >
                <span style={{ transform: 'skew(20deg)' }}>{t}</span>
              </li>
            ))}
          </ul>
          <div className="bg-[#fafafa] rounded-[10px] p-[10px] min-h-[80px]">
            Tab content goes here
          </div>
        </div>
      </Section>

      <Section title="8. Icons">
        <div className="flex flex-wrap gap-6 items-center text-kdc-text">
          {[
            ['Edit', IconEdit], ['Trash', IconTrash], ['Copy', IconCopy],
            ['Plus', IconPlus], ['Close', IconClose], ['Calendar', IconCalendar],
            ['ArrowUp', IconArrowUp], ['ArrowDown', IconArrowDown], ['CloudAi', IconCloudAi],
          ].map(([name, Icon]) => (
            <div key={name} className="flex flex-col items-center gap-1 w-16">
              <Icon />
              <span className="font-mono text-[11px]">{name}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="9. Assets">
        {Object.entries(tokens.asset).map(([k, v]) => (
          <Row key={k} label={k}>
            <div className="flex items-center gap-4">
              <img src={v.value} alt={k} className="max-h-12 border border-kdc-border" />
              <span className="font-mono text-sm">{v.value}</span>
              <span className="text-sm text-kdc-text/60">{v.description}</span>
            </div>
          </Row>
        ))}
      </Section>

      <Section title="10. Cloud AI Section (composite)">
        <div
          className="rounded"
          style={{ border: `2px solid ${tokens.color.kdc.primary.value}` }}
        >
          <div
            className="px-3 py-1.5 text-kdc-primary font-medium"
            style={{ background: tokens.component.cloudAiSection.labelBg.value }}
          >
            Cloud AI
          </div>
          <div className="p-4 bg-white">
            Content area for Cloud AI feature toggle + plan selector
          </div>
        </div>
      </Section>
    </div>
  );
}
