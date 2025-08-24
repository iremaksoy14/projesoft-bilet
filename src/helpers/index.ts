export function seatLabel(row: number, col: number, side: "L" | "R") {
  const letter = side === "L" ? (col === 0 ? "A" : "B") : col === 0 ? "C" : "D";
  return `${row}${letter}`;
}

export const formatCard = (v: string) =>
  v
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ")
    .trim();

export const formatExp = (v: string) =>
  v
    .replace(/\D/g, "")
    .slice(0, 4)
    .replace(/(\d{2})(?=\d)/, "$1/");

export const toYYYYMMDD = (date: Date) => {
  const tzOffsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - tzOffsetMs).toISOString().slice(0, 10);
};
