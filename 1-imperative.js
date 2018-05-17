const nextCharForNumberString = str => {
  const trimmed = str.trim();
  const number = parseInt(trimmed);
  const nextNumber = number + 1;
  return String.fromCharCode(nextNumber);
}

console.log(nextCharForNumberString(' 64 ')); //A

const nextCharForNumberStringNested = str =>
  String.fromCharCode(parseInt(str.trim()) + 1);

console.log(nextCharForNumberStringNested(' 64 ')); //A