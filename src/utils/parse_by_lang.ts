export default (text: string, lang: string): string => {
  const regex = new RegExp(`@${lang}@(.*?)@${lang}@`, "g");
  const matches = [];
  let match;

  while ((match = regex.exec(text))) {
    matches.push(match[1]);
  }

  if (matches.length > 0) {
    return matches[0];
  }

  return text.replace(/@ru@|@en@/g, "");
};
