export function roundTime(time: string): string {
  let [hours, minutes] = time.split(':');

  if (minutes === '30' || minutes === '00') return `${hours}:${minutes}`;

  if (+minutes > 30) {
    const checkedHours =
      +hours + 1 >= 24 ? '00' : +hours + 1 > 10 ? +hours + 1 : +hours + 1;

    return `${checkedHours}:00`;
  }

  return `${hours}:30`;
}
