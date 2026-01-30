type DownloadBase64Options = {
  base64: string;
  filename: string;
  mimeType?: string;
};

export const downloadBase64File = ({
  base64,
  filename,
  mimeType = "application/pdf",
}: DownloadBase64Options) => {
  const link = document.createElement("a");
  link.href = `data:${mimeType};base64,${base64}`;
  link.download = filename;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
