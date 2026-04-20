export default function Pagination({ total }) {
  return (
    <div className="flex items-center justify-end gap-2 mt-4 text-kdc-body">
      <span>共 {total} 筆</span>
      <select className="border border-kdc-border rounded-btn px-2 py-1 text-sm h-7">
        <option>10 筆/頁</option>
      </select>
      <button className="w-7 h-7 rounded-full flex items-center justify-center border-none cursor-pointer text-sm bg-kdc-primary text-white">1</button>
    </div>
  );
}
