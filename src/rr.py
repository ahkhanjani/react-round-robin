timeSlice = int(input('Enter the time slice: '))
processCount = int(input('Enter the # of processes: '))

# تعریف آرایه خالی با تعداد خانه به اندازه تعداد پروسس
processArrivalTimes = [0] * processCount
processBurstTimes = [0] * processCount
processExitTimes = [0] * processCount


def devider():
    print('__________________________________')


for i in range(processCount):
    processArrivalTimes[i] = int(input(
        'Enter the arrival time of P{}: '.format(i + 1)))

    processBurstTimes[i] = int(input(
        'Enter the burst time of P{}: '.format(i + 1)))

devider()

processQueue = [0]

# شماره پروسس انتخاب شده
selectedProcessIndex = 0


def selectedProcessId():
    global processQueue
    global selectedProcessIndex
    return processQueue[selectedProcessIndex]


# تایمر از زمان شروع پروسس اول حساب می‌شود
timer = processArrivalTimes[0]

biggestSelectedProcessId = 0

processJustQuit = False


def next():
    global processArrivalTimes
    global selectedProcessIndex
    global timer
    global processQueue
    global biggestSelectedProcessId
    global processJustQuit

    if biggestSelectedProcessId < processCount - 1 and processArrivalTimes[biggestSelectedProcessId + 1] <= timer:
        processJustQuit = False
        processQueue.append(biggestSelectedProcessId + 1)
        selectedProcessIndex = len(processQueue) - 1
        biggestSelectedProcessId += 1
        return

    if processJustQuit:
        processJustQuit = False
        if selectedProcessIndex > len(
                processQueue) - 1:
            selectedProcessIndex = 0
        return

    if selectedProcessIndex >= len(
            processQueue) - 1:
        selectedProcessIndex = 0
        return

    selectedProcessIndex += 1


def log():
    global selectedProcessIndex
    global timer

    if processBurstTimes[selectedProcessId()] > 0:
        print('Timer:', timer)
        print('Current process name: P{}'.format(
            selectedProcessId() + 1))
        print('Remaining burst time:',
              processBurstTimes[selectedProcessId()])
        devider()


def tick(spentTime):
    global timer
    timer += spentTime
    processBurstTimes[selectedProcessId()] -= spentTime
    # print('Spent {} time unit(s) on P{}'.format(
    #     spentTime, selectedProcessId() + 1))
    # devider()


def kill():
    global processJustQuit
    global processExitTimes
    global timer
    global processQueue
    global selectedProcessIndex

    print('P{} finished at {}!'.format(
        selectedProcessId() + 1, timer))
    devider()

    processJustQuit = True
    processExitTimes[selectedProcessId()] = timer
    processQueue.pop(selectedProcessIndex)


# تا زمانی که همه زمان انفجار همه پروسس‌ها صفر شود
while (True):
    log()

    if processBurstTimes[selectedProcessId()] > timeSlice:
        tick(timeSlice)
    else:
        tick(processBurstTimes[selectedProcessId()])
        kill()

    if sum(processBurstTimes) == 0:
        print('End of program!')
        break

    next()