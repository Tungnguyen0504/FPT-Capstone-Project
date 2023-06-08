export class DateUtils {
  static fromDB(input: any): any {
    if (!input) return undefined;
    return new Date(input * 1000);
  }

  static toDB(input: Date): any {
    return new Date(
      Date.UTC(
        input.getFullYear(),
        input.getMonth(),
        input.getDate(),
        input.getHours(),
        input.getMinutes(),
        input.getMilliseconds()
      )
    );
  }

  static fromLocalTimeStringToDate(s: string): Date | undefined {
    try {
      const splitted = s.split(":");
      return new Date(
        2023,
        0,
        1,
        Number.parseInt(splitted[0]),
        Number.parseInt(splitted[1])
      );
    } catch (e: any) {
      return undefined;
    }
  }

  static fromDateToLocalTimeString(date: Date): string {
    return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  }
}
