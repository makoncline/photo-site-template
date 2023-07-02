import React from "react";
import Image from "next/image";
import { toBase64 } from "~/lib/utils";
import { Button } from "./ui/button";
import { Dialog, DialogContent } from "./ui/dialog";
import { imageConfig } from "~/config/image";

export const ImageUpload = ({
  children,
  id,
  onConfirm,
}: {
  children: React.ReactNode;
  id: string;
  onConfirm: (file: File) => void;
}) => {
  const [file, setFile] = React.useState<File | null>(null);
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const base64Image = await toBase64(file);
      setPreviewImage(base64Image);
    }
    e.target.value = "";
  };
  const handleConfirm = () => {
    if (file) {
      onConfirm(file);
    }
    handleClear();
  };
  const handleClear = () => {
    setFile(null);
    setPreviewImage(null);
    setError(null);
  };
  return (
    <>
      <label htmlFor={id}>{children}</label>
      <input
        id={id}
        type="file"
        accept="image/*"
        name="fileInput"
        multiple={false}
        onChange={onFileChange}
        hidden
      />
      <Dialog open={Boolean(previewImage)} onOpenChange={handleClear}>
        <DialogContent>
          <div className="flex flex-col items-center justify-center gap-4">
            {previewImage && (
              <div className="relative h-image w-image">
                <Image
                  src={previewImage}
                  fill={true}
                  alt="preview"
                  className="object-cover"
                />
              </div>
            )}
            {error && (
              <span className="text-sm font-medium text-destructive">
                {error}
              </span>
            )}
            <div
              className="flex justify-between"
              style={{ width: `${imageConfig.main.square.size}px` }}
            >
              <Button onClick={handleClear} variant={"destructive"}>
                Try Again
              </Button>
              <Button type="submit" onClick={handleConfirm}>
                Looks Good!
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
