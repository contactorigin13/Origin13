import { COMPANY } from "@/data/studio";

/** Turns the saved email setting (one or more addresses, split by new lines, commas or spaces) into a clean list. */
export function emailList(value: string | undefined | null): string[] {
  const list = (value ?? "")
    .split(/[\s,;]+/)
    .map((e) => e.trim())
    .filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
  const unique = [...new Set(list)];
  return unique.length ? unique : [COMPANY.email];
}
