param(
  [Parameter(Mandatory=$false)][string]$ProjectRoot="."
)

$ErrorActionPreference = "Stop"

function Write-TextFile {
  param([string]$Path, [string]$Content)
  $dir = Split-Path $Path
  if (!(Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
  Set-Content -Path $Path -Encoding UTF8 -Value $Content
  Write-Host "✓ 写入 ${Path}"
}

function Ensure-Line {
  param([string]$Path, [string]$Line)
  if (!(Test-Path $Path)) {
    Set-Content -Path $Path -Encoding UTF8 -Value $Line
    Write-Host "✓ 创建 ${Path} 并写入: ${Line}"
    return
  }
  $raw = Get-Content -Path $Path -Raw
  if ($raw -notmatch [Regex]::Escape($Line)) {
    Add-Content -Path $Path -Value $Line
    Write-Host "✓ 追加到 ${Path}: ${Line}"
  } else {
    Write-Host "i ${Path} 已包含所需配置"
  }
}

$SRC = Join-Path $ProjectRoot 'frontend\src'
if (!(Test-Path $SRC)) { throw '未找到 ' + $SRC + '，请确认 -ProjectRoot 指向项目根目录。' }

# 0) 本地 MOCK 环境开关
$envLocal = Join-Path $ProjectRoot 'frontend\.env.development.local'
Ensure-Line $envLocal 'VITE_USE_MOCK=1'

# 1) services
$servicesPath = Join-Path $SRC 'services\teaching.ts'
$servicesText = @"
export type Session = { id: string; course: string; time: string; room: string; };
export type AttendanceItem = { studentId: string; name: string; status: 'present'|'late'|'absent'|'leave'; seat?: string };
export type HistoryItem = { id: string; date: string; course: string; class: string; present: number; total: number };

const useMock = import.meta.env.VITE_USE_MOCK === '1';

const mockDB = {
  today: [
    { id: 'S-001', course: '高一(1) 语文', time: '08:00-08:45', room: 'A-301' },
    { id: 'S-002', course: '高一(2) 语文', time: '10:00-10:45', room: 'A-305' }
  ] as Session[],
  roster: Array.from({length: 36}).map((_,i)=>({ studentId: (1000+i).toString(), name: '学生'+(i+1), status: 'present' as const, seat: `${'$'}{Math.floor(i/6)+1}-${'$'}{(i%6)+1}` })),
  history: [
    { id:'H-20250929-01', date: '2025-09-29', course: '高一(1) 语文', class: 'A1', present: 34, total: 36 },
    { id:'H-20250928-01', date: '2025-09-28', course: '高一(2) 语文', class: 'A2', present: 35, total: 36 },
  ] as HistoryItem[],
  cache: {} as Record<string, AttendanceItem[]>
};

async function api<T>(url:string, init?:RequestInit):Promise<T>{
  const base = '/api';
  const res = await fetch(base+url, {headers:{'Content-Type':'application/json'}, ...init});
  if(!res.ok) throw new Error('API '+res.status);
  return res.json();
}

export const TeachingService = {
  async listToday(): Promise<Session[]> {
    if(useMock) return mockDB.today;
    return api('/teacher/schedule/today');
  },
  async getRoster(sessionId: string): Promise<AttendanceItem[]> {
    if(useMock) return mockDB.cache[sessionId] ?? structuredClone(mockDB.roster);
    return api(`/teacher/session/${'$'}{sessionId}/roster`);
  },
  async saveAttendance(sessionId: string, list: AttendanceItem[]) {
    if(useMock){ mockDB.cache[sessionId]=structuredClone(list); return {ok:true}; }
    return api(`/teacher/session/${'$'}{sessionId}/attendance`, {method:'POST', body: JSON.stringify(list)});
  },
  async historyList(): Promise<HistoryItem[]> {
    if(useMock) return mockDB.history;
    return api('/teacher/schedule/history');
  },
  async screenCast(sessionId: string, action:'start'|'stop') {
    if(useMock){ return {ok:true}; }
    return api(`/teacher/session/${'$'}{sessionId}/screencast`, {method:'POST', body: JSON.stringify({action})});
  },
  async interaction(sessionId: string, type:'random'|'vote'|'quiz', payload?:any) {
    if(useMock){ return {ok:true, id: 'EVT-'+Date.now()}; }
    return api(`/teacher/session/${'$'}{sessionId}/interaction`, {method:'POST', body: JSON.stringify({type, payload})});
  },
  async assignClasswork(sessionId: string, title:string, content:string){
    if(useMock){ return {ok:true, workId: 'HW-'+Date.now()}; }
    return api(`/teacher/session/${'$'}{sessionId}/classwork`, {method:'POST', body: JSON.stringify({title, content})});
  }
};
"@
Write-TextFile -Path $servicesPath -Content $servicesText

# 2) pages & components
$teachingDir = Join-Path $SRC 'pages\teacher\teaching'
New-Item -ItemType Directory -Force -Path (Join-Path $teachingDir 'components') | Out-Null

Write-TextFile -Path (Join-Path $teachingDir 'index.tsx') -Content @"
import { Outlet, NavLink } from 'react-router-dom';
export default function TeachingIndex() {
  const tab = (to: string, label: string) => (
    <NavLink to={to} className={({ isActive }) => `px-3 py-2 rounded ${'$'}{isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`} end>{label}</NavLink>
  );
  return (<div className='p-6 space-y-4'>
    <h1 className='text-xl font-semibold'>我的上课</h1>
    <div className='flex gap-2'>{tab('.', '今日上课')}{tab('history', '历史记录')}</div>
    <Outlet />
  </div>);
}
"@

Write-TextFile -Path (Join-Path $teachingDir 'Today.tsx') -Content @"
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
        <div className='flex gap-2'><Link to={`../session/${'$'}{s.id}`} className='px-3 py-1 rounded bg-blue-600 text-white'>开始上课</Link></div>
      </div>
    ))}
    {items.length===0 && <div className='text-gray-500'>今天没有待上课的课程。</div>}
  </div>);
}
"@

Write-TextFile -Path (Join-Path $teachingDir 'History.tsx') -Content @'
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
'@

Write-TextFile -Path (Join-Path $teachingDir 'components\AttendancePanel.tsx') -Content @"
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
              <button key={st} className={`px-2 py-1 rounded border ${'$'}{s.status===st?'bg-blue-600 text-white':'bg-white'}`} onClick={()=>setStatus(idx, st)}>
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
"@

Write-TextFile -Path (Join-Path $teachingDir 'components\SeatMap.tsx') -Content @"
type Props = { rows?: number; cols?: number; onPick?(seat:string):void };
export default function SeatMap({rows=6, cols=6, onPick}:Props){
  const seats = Array.from({length: rows*cols}).map((_,i)=>`${'$'}{Math.floor(i/cols)+1}-${'$'}{(i%cols)+1}`);
  return (<div className='grid grid-cols-6 gap-1'>
    {seats.map(s=>(<button key={s} onClick={()=>onPick?.(s)} className='border rounded px-2 py-1 text-xs hover:bg-gray-100'>{s}</button>))}
  </div>);
}
"@

Write-TextFile -Path (Join-Path $teachingDir 'components\InteractionsPanel.tsx') -Content @'
type Props = { onRandom():void; onVote():void; onQuiz():void; log:string[] };
export default function InteractionsPanel({onRandom,onVote,onQuiz,log}:Props){
  return (<div className='space-y-2'>
    <div className='flex gap-2'>
      <button onClick={onRandom} className='px-3 py-1 rounded border'>随机抽问</button>
      <button onClick={onVote} className='px-3 py-1 rounded border'>发起投票</button>
      <button onClick={onQuiz} className='px-3 py-1 rounded border'>课堂小测</button>
    </div>
    <div className='text-sm text-gray-600'>互动记录</div>
    <ul className='text-sm list-disc pl-5'>{log.map((l,i)=>(<li key={i}>{l}</li>))}</ul>
  </div>);
}
'@

Write-TextFile -Path (Join-Path $teachingDir 'components\ScreenCastPanel.tsx') -Content @'
type Props = { onStart():void; onStop():void; active:boolean };
export default function ScreenCastPanel({onStart,onStop,active}:Props){
  return (<div className='flex items-center gap-2'>
    {active?(<>
      <div className='text-green-700 text-sm'>投屏中...</div>
      <button onClick={onStop} className='px-3 py-1 rounded bg-red-600 text-white'>停止投屏</button>
    </>):(<button onClick={onStart} className='px-3 py-1 rounded bg-blue-600 text-white'>开始投屏</button>)}
  </div>);
}
'@

Write-TextFile -Path (Join-Path $teachingDir 'Session.tsx') -Content @"
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
    setLog(l=>[`抽问：${'$'}{stu.name}`, ...l]);
    await TeachingService.interaction(id, 'random', {studentId: stu.studentId});
  };
  const onVote = async()=>{ setLog(l=>['发起投票（示例）', ...l]); await TeachingService.interaction(id, 'vote', {title:'课堂投票'}); };
  const onQuiz = async()=>{ setLog(l=>['发起课堂小测（示例）', ...l]); await TeachingService.interaction(id, 'quiz', {paperId:'DEMO'}); };

  const onStartCast = async()=>{ await TeachingService.screenCast(id,'start'); setCast(true); };
  const onStopCast = async()=>{ await TeachingService.screenCast(id,'stop'); setCast(false); };

  const [title,setTitle] = useState('课堂练习');
  const [content,setContent] = useState('请完成教材P23第1-3题');
  const assignWork = async()=>{ await TeachingService.assignClasswork(id, title, content); setLog(l=>[`已布置课堂作业：${'$'}{title}`, ...l]); };

  return (<div className='p-6 space-y-4'>
    <div className='flex items-center justify-between'>
      <div><h2 className='text-lg font-semibold'>课堂进行中：{id}</h2><div className='text-sm text-gray-500'>到课 {present} 人</div></div>
      <ScreenCastPanel active={cast} onStart={onStartCast} onStop={onStopCast}/>
    </div>
    <div className='flex gap-2'>
      {(['attendance','seat','interact','work'] as Tab[]).map(t=>(
        <button key={t} className={`px-3 py-1 rounded border ${'$'}{tab===t?'bg-blue-600 text-white':''}`} onClick={()=>setTab(t)}>
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
"@

# 3) 生成“独立路由模块”与“菜单补丁”，避免直接改你现有文件
$routesPatch = Join-Path $SRC 'router\teacher.teaching.routes.tsx'
Write-TextFile -Path $routesPatch -Content @'
import TeachingIndex from '../pages/teacher/teaching';
import TeachingToday from '../pages/teacher/teaching/Today';
import TeachingHistory from '../pages/teacher/teaching/History';
import TeachingSession from '../pages/teacher/teaching/Session';

/** 可在你的教师端路由里引入：
 * import { teachingRoutes } from './teacher.teaching.routes';
 * ...
 * children: [
 *   ...teachingRoutes,
 * ]
 */
export const teachingRoutes = [
  { path: 'teaching', element: <TeachingIndex />, children: [
    { index: true, element: <TeachingToday /> },
    { path: 'history', element: <TeachingHistory /> },
    { path: 'session/:id', element: <TeachingSession /> },
  ]},
];
'@

$menuPatch = Join-Path $SRC 'layouts\TeacherLayout\menu.teaching.patch.txt'
Write-TextFile -Path $menuPatch -Content @'
将下面对象加入教师侧边菜单数组（紧邻课表/消息等）：
{ key: 'teaching', label: '我的上课', to: '/teacher/teaching', icon: 'presentation' }
'@

Write-Host ''
Write-Host '==== 补丁完成 ===='
Write-Host 'A) 已写入页面/组件/服务：frontend/src/pages/teacher/teaching/*、services/teaching.ts'
Write-Host 'B) 路由未强行改动你现有文件 — 已生成模块：frontend/src/router/teacher.teaching.routes.tsx'
Write-Host '   请在教师端路由 children 内合并：...teachingRoutes'
Write-Host 'C) 菜单补丁说明文件：frontend/src/layouts/TeacherLayout/menu.teaching.patch.txt'
Write-Host ''
Write-Host '快速验证：'
Write-Host '1) 路由里引入：import { teachingRoutes } from ''./router/teacher.teaching.routes'';'
Write-Host '2) 将 ''teachingRoutes'' 展开进教师端 children；菜单加入“我的上课”。'
Write-Host '3) 开发启动：cd frontend && npm run dev'
Write-Host '4) 打开：http://localhost:5173/teacher/teaching'
