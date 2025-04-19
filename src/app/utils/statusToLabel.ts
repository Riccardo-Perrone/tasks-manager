import { TaskStatus } from "./types";

// Prende il valore dello status e lo transforma in una label
export const statusToLabel = (status: TaskStatus) => {
  return status
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
