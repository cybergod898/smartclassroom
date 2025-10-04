import { useEffect, useState } from 'react';
import type { AttendanceItem } from '../../../services/teaching';
type Props = { sessionId: string; onChange?(list: AttendanceItem[]): void; fetchRoster(sessionId:string): Promise<AttendanceItem[]>; save(sessionId:string, list:AttendanceItem[]): Promise<any> };
export default function AttendancePanel({sessionId, onChange, fetchRoster, save}:Props){
  const [list, setList] = useState<AttendanceItem[]>([]);
  const [saving, setSaving] = useState(false);
  useEffect(()=>{(async()=>{ const data = await fetchRoster(sessionId); setList(data); })()},[sessionId]);
  const setStatus = (i:number, status:AttendanceItem['status'])=>{ const n=[...list]; n[i]={...n[i], status}; setList(n); onChange?.(n); };
  const saveAll = async()=>{ setSaving(true); try{ await save(sessionId, list); } finally{ setSaving(false); } };
  const present = list.filter(i=>i.status==='present').length;
  return (<div className='space-y-3'>
    <div className='text-sm text-gray-600'>已到 {present} / {list.length}</div>
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2'>
      {list.map((s,idx)=>(
        <div key={s.studentId} className='border rounded p-2'>
          <div className='text-sm font-medium'>{s.name}</div>
          <div className='text-xs text-gray-500'>座位: {s.seat ?? '-'}</div>
          <div className='flex gap-1 mt-1 text-xs'>
            {(['present','late','leave','absent'] as const).map(st=>(
              <button key={st} className={`px-2 py-1 rounded border ${s.status===st?'bg-blue-600 text-white':'bg-white'}`} onClick={()=>setStatus(idx, st)}>
                {({present:'到',late:'迟到',leave:'请假',absent:'缺勤'} as any)[st]}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
    <button disabled={saving} onClick={saveAll} className='px-3 py-1 rounded bg-green-600 text-white'>{saving?'保存中...':'保存点名结果'}</button>
  </div>);
}
