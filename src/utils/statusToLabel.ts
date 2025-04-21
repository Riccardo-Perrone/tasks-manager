// Prende il valore dello status e lo transforma in una label
export const statusToLabel = (status: string) => {
  return status
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
