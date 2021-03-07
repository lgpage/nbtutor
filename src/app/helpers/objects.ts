import { Dictionary } from '@app/models';

export function isEmpty(obj: Array<any> | Dictionary<any>) {
  if (Array.isArray(obj)) {
    return obj.length < 1;
  }

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }

  return true;
}

export function keys<T>(obj: Dictionary<T>): string[] {
  return Object.keys(obj).filter(k => obj.hasOwnProperty(k));
}

export function values<T extends R, R = T>(obj: Dictionary<T>, selector?: (v: T) => R): R[] {
  const result: R[] = [];
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = !!selector ? selector(obj[key]) : obj[key];
      result.push(value);
    }
  }

  return result;
}

export function deepClone<T extends object>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}
