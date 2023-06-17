import { nanoid } from 'nanoid';
import { type Log, type Process } from './App';

export function calculate(timeSlice: number, processes: Process[]) {
  const logs: Log[] = [];
  let queue = [0];
  let timer = processes[0].arrivalTime;
  let selectedProcessQueueIndex = 0;
  let biggestSelectedProcessIndex = 0;
  let processJustQuit = false;

  const getSelectedProcessRealIndex = () => queue[selectedProcessQueueIndex];

  function next() {
    if (
      biggestSelectedProcessIndex < processes.length - 1 &&
      processes[biggestSelectedProcessIndex + 1].arrivalTime <= timer
    ) {
      processJustQuit = false;
      queue.push(biggestSelectedProcessIndex + 1);
      selectedProcessQueueIndex = queue.length - 1;
      biggestSelectedProcessIndex++;
      return;
    }

    if (queue.length === 0 && sumBurstTimes() !== 0) {
      processJustQuit = false;
      queue.push(biggestSelectedProcessIndex + 1);
      selectedProcessQueueIndex = 0;
      biggestSelectedProcessIndex++;
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

    console.log('here');

    selectedProcessQueueIndex += 1;
  }

  function tick(spentTime: number) {
    timer += spentTime;
    processes[getSelectedProcessRealIndex()].burstTime -= spentTime;
  }

  function kill() {
    processJustQuit = true;
    processes[getSelectedProcessRealIndex()].exitTime = timer;
    queue = queue.filter((_, i) => i !== selectedProcessQueueIndex);
  }

  function log(spentTime: number, exits?: true) {
    const log: Log = {
      id: nanoid(),
      processId: processes[getSelectedProcessRealIndex()].id,
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
    if (processes[getSelectedProcessRealIndex()].burstTime > timeSlice) {
      const spentTime = timeSlice;
      log(spentTime);
      tick(spentTime);
    } else {
      const spentTime = processes[getSelectedProcessRealIndex()].burstTime;
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
