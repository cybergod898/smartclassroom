import { Outlet, NavLink } from 'react-router-dom';
export default function TeachingIndex() {
  const tab = (to: string, label: string) => (
    <NavLink to={to} className={({ isActive }) => `px-3 py-2 rounded ${isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`} end>{label}</NavLink>
  );
  return (<div className='p-6 space-y-4'>
    <h1 className='text-xl font-semibold'>我的上课</h1>
    <div className='flex gap-2'>{tab('.', '今日上课')}{tab('history', '历史记录')}</div>
    <Outlet />
  </div>);
}
