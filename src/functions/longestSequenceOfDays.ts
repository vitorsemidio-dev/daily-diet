export function longestSequenceOfDays(dates: Date[]): Date[] {
  const sortedDates = dates.sort((a, b) => a.getTime() - b.getTime());
  const MILLISECONDS_PER_DAY = 86400000;

  let longestSequence: Date[] = [];
  let currentSequence: Date[] = [];

  for (let i = 0; i < sortedDates.length; i++) {
    const currentDate = sortedDates[i];

    if (
      currentSequence.length === 0 ||
      currentSequence[currentSequence.length - 1].getTime() ===
        currentDate.getTime() - MILLISECONDS_PER_DAY
    ) {
      currentSequence.push(currentDate);
    } else {
      if (currentSequence.length > longestSequence.length) {
        longestSequence = currentSequence;
      }
      currentSequence = [currentDate];
    }
  }

  if (currentSequence.length > longestSequence.length) {
    longestSequence = currentSequence;
  }

  const currentDate = new Date();
  const currentDateMidnight = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate(),
  );
  let closestSequence: Date[] = [];

  for (let i = 0; i < sortedDates.length; i++) {
    const currentSequence = [sortedDates[i]];
    let j = i + 1;
    while (
      j < sortedDates.length &&
      currentSequence[currentSequence.length - 1].getTime() ===
        sortedDates[j].getTime() - 86400000
    ) {
      currentSequence.push(sortedDates[j]);
      j++;
    }
    if (currentSequence.length === longestSequence.length) {
      const closestSequenceLastDate =
        closestSequence[closestSequence.length - 1];
      if (
        !closestSequenceLastDate ||
        Math.abs(
          closestSequenceLastDate.getTime() - currentDateMidnight.getTime(),
        ) >
          Math.abs(
            currentSequence[currentSequence.length - 1].getTime() -
              currentDateMidnight.getTime(),
          )
      ) {
        closestSequence = currentSequence;
      }
    }
  }

  return closestSequence.length > 0 ? closestSequence : longestSequence;
}
