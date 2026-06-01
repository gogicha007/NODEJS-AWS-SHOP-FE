import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios from "axios";
import { useMutation } from "react-query";

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File | null>(null);

  const { mutate: uploadFileMutation, isLoading } = useMutation({
    mutationFn: async (fileToUpload: File) => {
      const token = localStorage.getItem("authorization_token");

      const response = await axios({
        method: "GET",
        headers: {
          Authorization: `Basic ${token}`,
        },
        url,
        params: {
          name: fileToUpload.name,
        },
        responseType: "text",
      });

      const result = await fetch(response.data, {
        method: "PUT",
        body: fileToUpload,
      });

      if (!result.ok) {
        const error = new Error("S3 upload failed") as Error & {
          status?: number;
        };
        error.status = result.status;
        throw error;
      }
    },
  });

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setFile(files && files.length > 0 ? files[0] : null);
  };

  const removeFile = () => {
    setFile(null);
  };

  const uploadFile = () => {
    if (!file) return;

    uploadFileMutation(file, {
      onSuccess: () => {
        setFile(null);
      },
    });
  };
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type="file" onChange={onFileChange} />
      ) : (
        <div>
          <button onClick={removeFile} disabled={isLoading}>
            Remove file
          </button>
          <button onClick={uploadFile} disabled={isLoading}>
            {isLoading ? "Uploading..." : "Upload file"}
          </button>
        </div>
      )}
    </Box>
  );
}
