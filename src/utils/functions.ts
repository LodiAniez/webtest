
import { Timestamp } from "firebase/firestore";
import { TSDate } from "@/utils/variables"
import { ArgFunction, NotUndefined } from "@/types";


const IDGenerator = () =>
  Number(
    new Date(TSDate()).getTime() + Math.random() + Math.floor(Math.random() * 10000),
  ).toString().replaceAll(".", "_");

const isNumber = (input: unknown): input is number => {
  if (typeof input !== "string" && typeof input !== "number") return false
  if (String(input).length > 9) return false; // a weak attempt to prevent generating numbers with letters or special characters
  if (Math.abs(Number(input) - Number(input)) !== 0) return false;
  if (String(input).trim() === "") return false;
  if (/[a-zA-Z]/g.test(String(input))) return false;
  return isFinite(+input)
}

const removeDuplicates = <T>(
  array: Array<T>,
  key?: keyof T,
): Array<T> => {
  if (!key) {
    return Array.from(new Set(array));
  } else {
    let seen = new Set();
    return array.filter((item) => {
      if (!item) return item;
      // @ts-ignore
      let k = item[key];
      return seen.has(k) ? false : seen.add(k);
    });
  }
};
const removeUndefined = <T>(array: (T | null | undefined)[]): Array<T> => {
  if (!Array.isArray(array)) return []
  return array.filter((item) => item && item !== "undefined" && item !== "null") as T[]
}
const getNumberWithOrdinal = (n: number) => {
  var s = ["th", "st", "nd", "rd"],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};
function convertTimestampsToDate<T>(obj: T, noTime = false) {
  const clone = JSON.parse(JSON.stringify(obj));
  if (Array.isArray(clone)) {
    for (let i = 0; i < clone.length; i++) {
      clone[i] = convertTimestampsToDate(clone[i], noTime);
    }
  } else if (typeof clone === "object" && clone !== null) {
    Object.keys(clone).forEach((k) => {
      const key = k as keyof typeof clone;
      // @ts-ignore
      if (clone[key] && typeof clone[key] === "object" && ("seconds" in clone[key] || "_seconds" in clone[key] || clone[key] instanceof Timestamp)) {
        // @ts-ignore
        const convertedDate = TSDate(clone[key])
        // @ts-ignore
        clone[key] = clone.hasOwnProperty(String(`${key}String`)) && isValidDate(TSDate(clone[String(`${key}String`)])) ? dateStringToDate(clone[String(`${key}String`)]) : noTime ? clearTime(convertedDate) : convertedDate;
      }
    });
  }
  return clone;
}
const timestampToDate = (ts: Timestamp) => new Timestamp(ts.seconds, ts.nanoseconds).toDate()

const isTimeStamp = (obj: Record<string, any>): obj is Timestamp => {
  if (typeof obj !== "object") return false;
  return obj instanceof Timestamp || ("seconds" in obj && "nanoseconds" in obj)
}
const replaceUndefinedWithNull = <T extends Record<any, any>>(obj: T): Record<any, NotUndefined<T>> => {
  const copiedObj = { ...obj };
  Object.keys(copiedObj).forEach((key) => {
    if (copiedObj[key] === undefined) {
      // @ts-ignore
      copiedObj[key] = null;
    } else if (Array.isArray(copiedObj[key])) {
      // @ts-ignore
      copiedObj[key] = copiedObj[key].map((data: any) =>
        data === undefined ? null : data,
      );
    }
  });
  return copiedObj;
}

const removeHtmlTags = (str: string) => {
  return str.replace(/<\/?[^>]+(>|$)/g, '');
}

const isValidDate = (d: any): d is Date => {
  return d instanceof Date && !isNaN(d as unknown as number);
}
const isFloat = (x: number) => { return !!(x % 1); }
const sanitizeString = (str: string): string => typeof str === "string" ? str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim, "") : "";

const formatDate = (date: Date, prev?: Date) => {
  if (prev && date.getMonth() === prev.getMonth()) return date.getDate()
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
};
const getFormattedPhoneNum = (input: string) => {
  let output = "";
  input.replaceAll("+1", "").replace(
    /^\D*(\d{0,3})\D*(\d{0,3})\D*(\d{0,4})/,
    // @ts-ignore
    function (match, g1, g2, g3) {
      if (g1.length) {
        output += "(";
        output += g1;
        if (g1.length == 3) {
          if (input.length !== 4) output += ")";
          if (g2.length) {
            output += " " + g2;
            if (g2.length == 3) {
              output += "-";
              if (g3.length) {
                output += g3;
              }
            }
          }
        }
      }
    },
  );
  return (output).replaceAll("+1", "");
};

const sleep = (duration: number = 300) => new Promise((resolve) => setTimeout(resolve, duration));

const memoize = (func: ArgFunction<any>) => {
  const cache = new Map();
  return (...args: any) => {
    const key = JSON.stringify(args)
    if (cache.has(key)) return cache.get(key);

    const result = func(...args);
    cache.set(key, result);
    return result
  }
}


const CurrencyNoDeci = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
});


export {
  IDGenerator,
  isNumber,
  isFloat,
  removeDuplicates,
  removeUndefined,
  getNumberWithOrdinal,
  getFormattedPhoneNum,
  convertTimestampsToDate,
  timestampToDate,
  isTimeStamp,
  replaceUndefinedWithNull,
  removeHtmlTags,
  isValidDate,
  sanitizeString,
  formatDate,
  sleep,
  memoize,
  CurrencyNoDeci,

}