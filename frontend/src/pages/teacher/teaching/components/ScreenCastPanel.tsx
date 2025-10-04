type Props = { onStart():void; onStop():void; active:boolean };
export default function ScreenCastPanel({onStart,onStop,active}:Props){
  return (<div className='flex items-center gap-2'>
    {active?(<>
      <div className='text-green-700 text-sm'>投屏中...</div>
      <button onClick={onStop} className='px-3 py-1 rounded bg-red-600 text-white'>停止投屏</button>
    </>):(<button onClick={onStart} className='px-3 py-1 rounded bg-blue-600 text-white'>开始投屏</button>)}
  </div>);
}
