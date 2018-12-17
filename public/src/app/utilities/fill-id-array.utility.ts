export function fillIdArray(id: string[]): string[] {
  let c = 'a';

  for (let i = 0; i < 26; i++) {
    id.push(c);
    c = nextChar(c)
  }
  return id;
}

function nextChar(c) {
  return String.fromCharCode(c.charCodeAt(0) + 1);
}
