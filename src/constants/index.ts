export const NEW_LINE = '\n';

export function replaceAll(str: string, find: string, replace: string) {
  return str.replace(new RegExp(find, 'g'), replace);
}
export const sleep = (ms = 2000) => new Promise(r => setTimeout(r, ms));
