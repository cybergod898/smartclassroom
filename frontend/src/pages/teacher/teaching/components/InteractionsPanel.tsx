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
