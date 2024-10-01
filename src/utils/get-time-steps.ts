export function getTimeSlots(startTime: Date, endTime: Date): string[] {
  const slots: string[] = [];
  let currentTime = new Date(startTime);
  while (currentTime <= endTime) {
    const hours = currentTime.getHours().toString();
    const minutes = currentTime.getMinutes().toString();

    slots.push(
      `${hours.length === 1 ? '0' + hours : hours}:${minutes.length === 1 ? '0' + minutes : minutes}`,
    );
    currentTime = new Date(+currentTime + 30 * 60000); // добавляем 30 минут
  }
  return slots;
}
