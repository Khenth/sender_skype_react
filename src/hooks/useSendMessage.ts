import { useState } from "react";
import axiosClient from "../config/AxiosClient";

interface Message {
  user: string;
  password: string;
  message: string;
  file: string | Blob;
  image?: string | Blob | undefined;
}
export interface ErrorMessage {
  contact: string;
  name: string;
  status: string;
  error: string;
}

interface DataDetalResponse {
  detail: DataResponse;
}
interface DataResponse {
  status: "success" | "failure";
  message: string;
  details: ErrorMessage[];
}

export const useSender = () => {
  const [loading, setLoadig] = useState<boolean>(false);

  const useSendMessage = async ({
    file,
    message,
    password,
    user,
    image,
  }: Message): Promise<DataResponse> => {
    setLoadig(true);

    const formData = new FormData();
    formData.append("user", user);
    formData.append("password", password);
    formData.append("message", message);
    formData.append("file", file);
    if (image) formData.append("image", image);

    try {
      const { data } = await axiosClient.post<DataDetalResponse>(
        `/sender`,
        formData
      );

      setLoadig(false);

      if (data.detail.details.length > 0) {
        return data.detail;
      }

      return {
        status: "success",
        message: "Envio Exitoso",
        details: [],
      };
    } catch (error: any) {
      setLoadig(false);

      if (error.response.data.detail) {
        if (error.response.data.detail.message) {
          return error.response.data.detail;
        }
      }

      return {
        status: "failure",
        message: "Error en la comunicacion con el servidor",
        details: [],
      };
    }
  };

  //download file
  const useDownloadTemplate = async () => {
    try {
      const response = await axiosClient.get(`/template`, {
        responseType: "blob", // Indicar que esperamos una respuesta blob (archivo)
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "template.xlsx"; // Nombre del archivo CSV descargado
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      return {
        message: "Error al descargar documento",
      };
    }
  };

  return {
    // Propiedades
    loading,
    //Metodos
    useSendMessage,
    useDownloadTemplate,
  };
};
