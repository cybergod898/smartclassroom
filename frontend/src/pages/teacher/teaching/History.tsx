import { useEffect, useState } from 'react';
import { TeachingService, type HistoryItem } from '../../../services/teaching';
export default function TeachingHistory(){
  const [list, setList] = useState<HistoryItem[]>([]);
  useEffect(()=>{(async()=>{ setList(await TeachingService.historyList()); })()},[]);
  return (<div className='mt-3'>
    <table className='w-full text-sm'>
      <thead><tr className='text-left text-gray-500'><th className='py-2'>日期</th><th>课程</th><th>班级</th><th>出勤</th></tr></thead>
      <tbody>{list.map(i=>(
        <tr key={i.id} className='border-t'><td className='py-2'>{i.date}</td><td>{i.course}</td><td>{i.class}</td><td>{i.present}/{i.total}</td></tr>
      ))}</tbody>
    </table>
  </div>);
}
