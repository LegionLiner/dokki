const copyToClipboard = async (value: string) => {
  if (!navigator.clipboard) {
    throw new Error("Not able to");
  }

  return await navigator.clipboard.writeText(value);
};

export default copyToClipboard;
