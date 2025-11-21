import { useState } from "react";
import * as FileUpload from "@/components/ui/file-upload";
import { Upload, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface DropzoneProps {
  label?: string;
  maxSize?: number; // bytes
  allowedTypes?: string[];
  required?: boolean;
  onChange?: (file: File | null) => void;
}

export default function Dropzone({
  label = "Upload File",
  maxSize = 5 * 1024 * 1024,
  allowedTypes = ["image/png", "image/jpeg", "application/pdf"],
  required = false,
  onChange,
}: DropzoneProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  const validateFile = (f: File | null) => {
    if (!f) {
      if (required) {
        setError("This field is required");
      }
      return false;
    }

    if (f.size > maxSize) {
      setError(
        `File too big. Max size is ${Math.round(maxSize / 1024 / 1024)}MB`,
      );
      return false;
    }

    if (!allowedTypes.includes(f.type)) {
      setError("Invalid file type");
      return false;
    }

    setError("");
    return true;
  };

  const handleFileChange = (files: File[]) => {
    const f = files[0] ?? null;

    if (!validateFile(f)) {
      setFile(null);
      onChange?.(null);
      return;
    }

    setFile(f);
    setError("");
    onChange?.(f);
  };

  const handleDelete = () => {
    setFile(null);
    onChange?.(null);

    if (required) {
      setError("This field is required");
    } else {
      setError("");
    }
  };

  return (
    <div className="w-full space-y-2">
      <Label className="font-medium flex items-center gap-1">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>

      <FileUpload.Root
        value={file ? [file] : []}
        onValueChange={handleFileChange}
        maxFiles={1}
        maxSize={maxSize}
        className="w-full"
      >
        {!file && (
          <FileUpload.Dropzone className="p-6 border rounded-xl flex flex-col items-center text-center gap-2">
            <Upload className="size-6 text-muted-foreground" />

            <div className="text-sm font-medium">Drag or click to upload</div>

            <div className="text-xs text-muted-foreground">
              Max {Math.round(maxSize / 1024 / 1024)}MB — Allowed:{" "}
              {allowedTypes.map((t) => t.split("/")[1]).join(", ")}
            </div>

            <FileUpload.Trigger asChild>
              <Button size="sm" variant="outline">
                Choose File
              </Button>
            </FileUpload.Trigger>
          </FileUpload.Dropzone>
        )}

        {file && (
          <FileUpload.List className="mt-2">
            <FileUpload.Item
              value={file}
              className="flex items-center gap-3 p-2 border rounded-md"
            >
              <FileUpload.ItemPreview className="size-16 rounded-md overflow-hidden">
                <FileUpload.ItemProgress variant="fill" />
              </FileUpload.ItemPreview>

              <div className="flex-1 text-sm truncate">{file.name}</div>

              <FileUpload.ItemDelete asChild>
                <Button size="icon" variant="ghost" onClick={handleDelete}>
                  <X className="size-4" />
                </Button>
              </FileUpload.ItemDelete>
            </FileUpload.Item>
          </FileUpload.List>
        )}
      </FileUpload.Root>

      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}
