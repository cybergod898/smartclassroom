import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TeachingService, type AttendanceItem } from '../../../services/teaching';
import AttendancePanel from './components/AttendancePanel';
import SeatMap from './components/SeatMap';
import InteractionsPanel from './components/InteractionsPanel';
import ScreenCastPanel from './components/ScreenCastPanel';

type Tab = 'attendance'|'seat'|'interact'|'work';

export default function TeachingSession(){
  const { id='' } = useParams();
  const [tab, setTab] = useState<Tab>('attendance');
  const [attendance, setAttendance] = useState<AttendanceItem[]>([]);
  const [cast, setCast] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const present = useMemo(()=>attendance.filter(a=>a.status==='present').length,[attendance]);

  useEffect(()=>{ document.title = '课堂 · '+id; },[id]);

  const onSeatPick = (seat:string)=>{
    const n = [...attendance];
    const idx = n.findIndex(x=>!x.seat);
    if(idx>=0){ n[idx] = {...n[idx], seat}; setAttendance(n); }
  };

  const onRandom = async()=>{
    const inClass = attendance.filter(a=>a.status==='present');
    if(inClass.length===0) return;
    const stu = inClass[Math.floor(Math.random()*inClass.length)];
    setLog(l=>[`抽问：${stu.name}`, ...l]);
    await TeachingService.interaction(id, 'random', {studentId: stu.studentId});
  };
  const onVote = async()=>{ setLog(l=>['发起投票（示例）', ...l]); await TeachingService.interaction(id, 'vote', {title:'课堂投票'}); };
  const onQuiz = async()=>{ setLog(l=>['发起课堂小测（示例）', ...l]); await TeachingService.interaction(id, 'quiz', {paperId:'DEMO'}); };

  const onStartCast = async()=>{ await TeachingService.screenCast(id,'start'); setCast(true); };
  const onStopCast = async()=>{ await TeachingService.screenCast(id,'stop'); setCast(false); };

  const [title,setTitle] = useState('课堂练习');
  const [content,setContent] = useState('请完成教材P23第1-3题');
  const assignWork = async()=>{ await TeachingService.assignClasswork(id, title, content); setLog(l=>[`已布置课堂作业：${title}`, ...l]); };

  return (<div className='p-6 space-y-4'>
    <div className='flex items-center justify-between'>
      <div><h2 className='text-lg font-semibold'>课堂进行中：{id}</h2><div className='text-sm text-gray-500'>到课 {present} 人</div></div>
      <ScreenCastPanel active={cast} onStart={onStartCast} onStop={onStopCast}/>
    </div>
    <div className='flex gap-2'>
      {(['attendance','seat','interact','work'] as Tab[]).map(t=>(
        <button key={t} className={`px-3 py-1 rounded border ${tab===t?'bg-blue-600 text-white':''}`} onClick={()=>setTab(t)}>
          {{attendance:'点名', seat:'换座', interact:'互动', work:'布置作业'}[t]}
        </button>
      ))}
    </div>
    {tab==='attendance' && (<AttendancePanel sessionId={id} fetchRoster={TeachingService.getRoster} save={TeachingService.saveAttendance} onChange={setAttendance} />)}
    {tab==='seat' && (<div className='space-y-2'><div className='text-sm text-gray-600'>点击座位将分配给名单中第一个未设置座位的学生（演示）。</div><SeatMap onPick={onSeatPick}/></div>)}
    {tab==='interact' && (<InteractionsPanel onRandom={onRandom} onVote={onVote} onQuiz={onQuiz} log={log}/>)}
    {tab==='work' && (<div className='space-y-2'>
      <input value={title} onChange={e=>setTitle(e.target.value)} className='border rounded px-2 py-1 w-full' placeholder='标题'/>
      <textarea value={content} onChange={e=>setContent(e.target.value)} className='border rounded px-2 py-1 w-full' rows={3} placeholder='作业要求'/>
      <button onClick={assignWork} className='px-3 py-1 rounded bg-green-600 text-white'>发布作业</button>
    </div>)}
  </div>);
}
