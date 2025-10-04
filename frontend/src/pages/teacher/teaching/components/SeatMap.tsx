type Props = { rows?: number; cols?: number; onPick?(seat:string):void };
export default function SeatMap({rows=6, cols=6, onPick}:Props){
  const seats = Array.from({length: rows*cols}).map((_,i)=>`${Math.floor(i/cols)+1}-${(i%cols)+1}`);
  return (<div className='grid grid-cols-6 gap-1'>
    {seats.map(s=>(<button key={s} onClick={()=>onPick?.(s)} className='border rounded px-2 py-1 text-xs hover:bg-gray-100'>{s}</button>))}
  </div>);
}
