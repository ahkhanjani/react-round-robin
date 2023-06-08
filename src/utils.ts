import { nanoid } from 'nanoid';
import { type Log, type Process } from './App';

export function calculate(timeSlice: number, processes: Process[]) {
  const logs: Log[] = [];
  let queue = [0];
  let selectedProcessQueueIndex = 0;
  let timer = processes[0].arrivalTime;
  let biggestSelectedProcessId = 0;
  let processJustQuit = false;

  const selectedProcessRealIndex = () => queue[selectedProcessQueueIndex];

  function next() {
    if (
      biggestSelectedProcessId < processes.length - 1 &&
      processes[biggestSelectedProcessId + 1].arrivalTime <= timer
    ) {
      processJustQuit = false;
      queue.push(biggestSelectedProcessId + 1);
      selectedProcessQueueIndex = queue.length - 1;
      biggestSelectedProcessId += 1;
      return;
    }

    if (processJustQuit) {
      processJustQuit = false;
      if (selectedProcessQueueIndex > queue.length - 1) {
        selectedProcessQueueIndex = 0;
      }
      return;
    }

    if (selectedProcessQueueIndex >= queue.length - 1) {
      selectedProcessQueueIndex = 0;
      return;
    }

    selectedProcessQueueIndex += 1;
  }

  function tick(spentTime: number) {
    timer += spentTime;
    processes[selectedProcessRealIndex()].burstTime -= spentTime;
  }

  function kill() {
    processJustQuit = true;
    processes[selectedProcessRealIndex()].exitTime = timer;
    queue = queue.filter((_, i) => i !== selectedProcessQueueIndex);
  }

  function log(spentTime: number, exits?: true) {
    const log: Log = {
      id: nanoid(),
      processId: processes[selectedProcessRealIndex()].id,
      start: timer,
      duration: spentTime,
    };

    if (exits) log.exits = true;

    logs.push(log);
  }

  function sumBurstTimes() {
    let sum = 0;
    processes.map((p) => p.burstTime).forEach((n) => (sum += n));
    return sum;
  }

  while (sumBurstTimes() > 0) {
    if (processes[selectedProcessRealIndex()].burstTime > timeSlice) {
      const spentTime = timeSlice;
      log(spentTime);
      tick(spentTime);
    } else {
      const spentTime = processes[selectedProcessRealIndex()].burstTime;
      log(spentTime, true);
      tick(spentTime);
      kill();
    }

    if (sumBurstTimes() === 0) {
      console.log('Calculation finished.');
      return logs;
    }

    next();
  }
}
