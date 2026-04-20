export default function Toggle({ checked, onChange }) {
  return (
    <div
      className={`toggle-slider ${checked ? 'active' : ''}`}
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
    />
  );
}
