import { type Process } from './App';

type Log = {
  processId: number;
  start: number;
};

export function calculate(timeSlice: number, processes: Process[]) {
  const logs: Log[] = [];
  const queue = [0];
  let selectedProcessIndex = 0;
  let timer = processes[0].arrivalTime;
  let biggestSelectedProcessId = 0;
  let processJustQuit = false;

  const selectedProcessId = () => queue[selectedProcessIndex];

  function next() {
    if (
      biggestSelectedProcessId < processes.length - 1 &&
      processes[biggestSelectedProcessId + 1].arrivalTime <= timer
    ) {
      processJustQuit = false;
      queue.push(biggestSelectedProcessId + 1);
      selectedProcessIndex = queue.length - 1;
      biggestSelectedProcessId += 1;
      return;
    }

    if (processJustQuit) {
      processJustQuit = false;
      if (selectedProcessIndex > queue.length - 1) {
        selectedProcessIndex = 0;
      }
      return;
    }

    if (selectedProcessIndex >= queue.length - 1) {
      selectedProcessIndex = 0;
      return;
    }

    selectedProcessIndex += 1;
  }

  function log() {
    if (processes[selectedProcessId()].burstTime > 0) {
      const log = {
        processId: selectedProcessId(),
        start: timer,
      };

      console.log(log);

      logs.push(log);
    }
  }

  function tick(spentTime: number) {
    timer += spentTime;
    processes[selectedProcessId()].burstTime -= spentTime;
  }

  function kill() {
    processJustQuit = true;
    processes[selectedProcessId()].exitTime = timer;
    queue.filter((_, i) => i !== selectedProcessIndex);
  }

  function sumBurstTimes() {
    let sum = 0;
    processes.map((p) => p.burstTime).forEach((n) => (sum += n));
    return sum;
  }

  // eslint-disable-next-line no-constant-condition
  while (true) {
    log();

    if (processes[selectedProcessId()].burstTime > timeSlice) {
      tick(timeSlice);
    } else {
      tick(processes[selectedProcessId()].burstTime);
      kill();
    }

    if (sumBurstTimes() === 0) {
      console.log('Calculation finished.');
      return logs;
    }

    next();
  }
}
