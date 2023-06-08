import { useState } from 'react';
import { nanoid } from 'nanoid';
import { MinusIcon, PlusIcon } from 'lucide-react';
import uniqolor from 'uniqolor';

import { calculate } from './utils';
import { Label } from './components/ui/label';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import { cn } from './lib/utils';

export type Process = {
  id: string;
  arrivalTime: number;
  burstTime: number;
  exitTime?: number;
};

export type Log = {
  id: string;
  processId: string;
  start: number;
  duration: number;
  exits?: true;
};

function App() {
  const [timeSlice, setTimeSlice] = useState<number>(0);
  const [processes, setProcesses] = useState<Process[]>([
    { id: nanoid(), arrivalTime: 0, burstTime: 0 },
  ]);
  const [logs, setLogs] = useState<Log[] | null>(null);

  function createProcess() {
    setProcesses((current) => [
      ...current,
      { id: nanoid(), arrivalTime: 0, burstTime: 0 },
    ]);
  }

  function removeProcess(processId: string) {
    setProcesses((current) => current.filter(({ id }) => id !== processId));
  }

  return (
    <>
      <header>
        <h1 className='text-center text-4xl py-10'>Round Robin</h1>
      </header>
      <main className='flex flex-col gap-5 items-center'>
        <div className='max-w-4xl'>
          <Label htmlFor='time-slice'>Time slice</Label>
          <Input
            id='time-slice'
            type='number'
            inputMode='numeric'
            value={timeSlice}
            onChange={(e) => {
              setTimeSlice(parseInt(e.target.value));
            }}
          />
        </div>
        {processes.map(({ id }, i) => (
          <div
            key={id}
            className='flex flex-row gap-3 max-w-4xl justify-center items-center'
          >
            <h2 className='whitespace-nowrap'>Process #{i + 1}</h2>
            <div>
              <Label htmlFor={`arrival${id}`}>Arrival time</Label>
              <Input
                id={`arrival${id}`}
                type='number'
                inputMode='numeric'
                value={processes[i].arrivalTime}
                onChange={(e) => {
                  setProcesses((current) => {
                    const newProcesses = structuredClone(current);
                    newProcesses[i].arrivalTime = parseInt(e.target.value);
                    return newProcesses;
                  });
                }}
              />
            </div>
            <div>
              <Label htmlFor={`burst${id}`}>Burst time</Label>
              <Input
                id={`burst${id}`}
                type='number'
                inputMode='numeric'
                value={processes[i].burstTime}
                onChange={(e) => {
                  setProcesses((current) => {
                    const newProcesses = structuredClone(current);
                    newProcesses[i].burstTime = parseInt(e.target.value);
                    return newProcesses;
                  });
                }}
              />
            </div>
            <Button onClick={() => removeProcess(id)}>
              <MinusIcon width={12} height={12} />
            </Button>
          </div>
        ))}
        <Button onClick={createProcess}>
          <PlusIcon width={12} height={12} />
        </Button>
        <Button
          disabled={timeSlice < 1}
          onClick={() => {
            const newLogs = calculate(timeSlice, structuredClone(processes));
            console.log(newLogs);
            setLogs(newLogs as Log[]);
          }}
        >
          Ok
        </Button>
        {logs && <ResultChart logs={logs} processes={processes} />}
      </main>
    </>
  );
}

export default App;

function ResultChart({
  logs,
  processes,
}: {
  logs: Log[];
  processes: Process[];
}) {
  const unitWidth =
    1000 /
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (logs.at(-1)!.start + logs.at(-1)!.duration - processes[0].arrivalTime);

  return (
    <div className='w-[1000px] h-12 bg-slate-400 flex flex-row gap-0'>
      {logs.map((log) => (
        <div
          key={log.id}
          className={cn(
            'h-12 flex flex-col',
            log.exits && 'border-black border-r-2 border-dashed'
          )}
          style={{
            width: `${unitWidth * log.duration}px`,
            backgroundColor: uniqolor(log.processId).color,
          }}
        >
          <span className='text-xs'>{log.start}</span>
          <span>p{processes.findIndex((p) => p.id === log.processId) + 1}</span>
        </div>
      ))}
    </div>
  );
}
