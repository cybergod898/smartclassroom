import { useEffect, useState } from 'react';
import { TeachingService, type Session } from '../../../services/teaching';
import { Link } from 'react-router-dom';
export default function TeachingToday(){
  const [items, setItems] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(()=>{(async()=>{ setLoading(true); try{ setItems(await TeachingService.listToday()); } finally{ setLoading(false); } })()},[]);
  if(loading) return <div className='text-gray-500 mt-4'>加载中...</div>;
  return (<div className='space-y-3 mt-2'>
    {items.map(s=>(
      <div key={s.id} className='border rounded p-3 flex items-center justify-between'>
        <div><div className='font-medium'>{s.course}</div><div className='text-sm text-gray-500'>{s.time} · {s.room}</div></div>
        <div className='flex gap-2'><Link to={`../session/${s.id}`} className='px-3 py-1 rounded bg-blue-600 text-white'>开始上课</Link></div>
      </div>
    ))}
    {items.length===0 && <div className='text-gray-500'>今天没有待上课的课程。</div>}
  </div>);
}
