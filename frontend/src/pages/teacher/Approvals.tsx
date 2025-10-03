import React,{useState} from 'react';import { api } from '../../shared/api';
export default function Approvals(){const [rows,setRows]=useState([{id:1,student:'张三',course:'数学',reason:'请假一天',status:'待审批'},{id:2,student:'李四',course:'语文',reason:'病假',status:'已通过'}]);
async function act(id,status){await api.messages.act(id,{action:status==='已通过'?'approve':'reject'});setRows(rows.map(r=>r.id===id?{...r,status}:r));}
return <div style={{padding:40,fontFamily:'sans-serif'}}><h1 style={{fontSize:28,marginBottom:20}}>审批中心</h1><table style={{width:'100%',borderCollapse:'collapse'}}>
<thead><tr><th>学生</th><th>课程</th><th>理由</th><th>状态</th><th>操作</th></tr></thead><tbody>{rows.map(r=><tr key={r.id}><td>{r.student}</td><td>{r.course}</td><td>{r.reason}</td><td>{r.status}</td>
<td>{r.status==='待审批' && <><button onClick={()=>act(r.id,'已通过')} style={{marginRight:8}}>通过</button><button onClick={()=>act(r.id,'已拒绝')}>拒绝</button></>}</td></tr>)}</tbody></table></div>; }