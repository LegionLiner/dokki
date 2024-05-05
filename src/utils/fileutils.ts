export const readAsBuffer = (
  file: File | Blob,
): Promise<ArrayBuffer | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (!e?.target) {
        return null;
      }

      const { result } = e.target;

      if (!(result instanceof ArrayBuffer)) {
        return null;
      }

      resolve(result);
    };
    reader.onerror = (e) => reject(e);
    reader.readAsArrayBuffer(file);
  });
};
