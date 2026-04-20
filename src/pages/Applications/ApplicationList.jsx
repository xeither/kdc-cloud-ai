import { useNavigate } from 'react-router-dom';
import { IconPlus, IconCalendar } from '../../icons';

export default function ApplicationList() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-kdc-title font-medium text-kdc-primary">申請單列表</h2>
        <button
          className="bg-kdc-primary-alt text-white rounded-btn px-5 py-2 text-kdc-btn border border-kdc-border cursor-pointer inline-flex items-center gap-1.5 hover:opacity-85"
          onClick={() => navigate('/applications/new')}
        >
          <IconPlus /> 新增
        </button>
      </div>
      <div className="flex gap-3 items-center mb-4 bg-white px-4 py-3 border border-kdc-border rounded mt-5">
        <select className="h-9 border border-kdc-border rounded-btn px-2 text-kdc-table font-kdc bg-white outline-none cursor-pointer w-[140px]">
          <option>類型</option>
        </select>
        <input
          className="h-9 border border-kdc-border rounded-btn px-2.5 text-kdc-table font-kdc outline-none w-[140px]"
          placeholder="單號"
        />
        <input
          className="h-9 border border-kdc-border rounded-btn px-2.5 text-kdc-table font-kdc outline-none w-[160px]"
          placeholder="公司名稱"
        />
        <select className="h-9 border border-kdc-border rounded-btn px-2 text-kdc-table font-kdc bg-white outline-none cursor-pointer w-[120px]">
          <option>狀態</option>
        </select>
        <input
          className="h-9 border border-kdc-border rounded-btn px-2.5 text-kdc-table font-kdc outline-none w-[120px]"
          placeholder="下一關"
        />
        <span className="flex items-center gap-1">
          <IconCalendar />
          <input
            className="h-9 border border-kdc-border rounded-btn px-2.5 text-kdc-table font-kdc outline-none w-[160px]"
            type="date"
          />
        </span>
        <button className="bg-kdc-primary-alt text-white rounded-btn px-5 py-2 text-kdc-btn border-none cursor-pointer hover:opacity-85 ml-auto">
          待簽核
        </button>
        <button className="bg-kdc-primary-alt text-white rounded-btn px-5 py-2 text-kdc-btn border-none cursor-pointer hover:opacity-85">
          查詢
        </button>
      </div>
      <div className="text-center py-20 text-[#ccc] text-lg">查詢申請單列表</div>
    </div>
  );
}
