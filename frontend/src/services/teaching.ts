export type Session = { id: string; course: string; time: string; room: string; };
export type AttendanceItem = { studentId: string; name: string; status: 'present'|'late'|'absent'|'leave'; seat?: string };
export type HistoryItem = { id: string; date: string; course: string; class: string; present: number; total: number };

const useMock = import.meta.env.VITE_USE_MOCK === '1';

const mockDB = {
  today: [
    { id: 'S-001', course: '高一(1) 语文', time: '08:00-08:45', room: 'A-301' },
    { id: 'S-002', course: '高一(2) 语文', time: '10:00-10:45', room: 'A-305' }
  ] as Session[],
  roster: Array.from({length: 36}).map((_,i)=>({ studentId: (1000+i).toString(), name: '学生'+(i+1), status: 'present' as const, seat: `${Math.floor(i/6)+1}-${(i%6)+1}` })),
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
    return api(`/teacher/session/${sessionId}/roster`);
  },
  async saveAttendance(sessionId: string, list: AttendanceItem[]) {
    if(useMock){ mockDB.cache[sessionId]=structuredClone(list); return {ok:true}; }
    return api(`/teacher/session/${sessionId}/attendance`, {method:'POST', body: JSON.stringify(list)});
  },
  async historyList(): Promise<HistoryItem[]> {
    if(useMock) return mockDB.history;
    return api('/teacher/schedule/history');
  },
  async screenCast(sessionId: string, action:'start'|'stop') {
    if(useMock){ return {ok:true}; }
    return api(`/teacher/session/${sessionId}/screencast`, {method:'POST', body: JSON.stringify({action})});
  },
  async interaction(sessionId: string, type:'random'|'vote'|'quiz', payload?:any) {
    if(useMock){ return {ok:true, id: 'EVT-'+Date.now()}; }
    return api(`/teacher/session/${sessionId}/interaction`, {method:'POST', body: JSON.stringify({type, payload})});
  },
  async assignClasswork(sessionId: string, title:string, content:string){
    if(useMock){ return {ok:true, workId: 'HW-'+Date.now()}; }
    return api(`/teacher/session/${sessionId}/classwork`, {method:'POST', body: JSON.stringify({title, content})});
  }
};
