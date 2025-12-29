import { PrepStatus } from "@mep/types";

const STATUS_ORDER = [
  PrepStatus.NONE,
  PrepStatus.MARK,
  PrepStatus.PREP,
  PrepStatus.PREP2,
  PrepStatus.PRIORITY,
] as const;

export function getNextPrepStatus(
  currentStatus: PrepStatus | undefined | null,
): PrepStatus {
  if (!currentStatus || currentStatus === PrepStatus.NONE) {
    return PrepStatus.MARK;
  }

  const currentIndex = STATUS_ORDER.indexOf(currentStatus);
  if (currentIndex === -1) {
    return PrepStatus.MARK;
  }

  const nextIndex = (currentIndex + 1) % STATUS_ORDER.length;
  return STATUS_ORDER[nextIndex];
}
