import { useState } from "react";
import axiosClient from "../config/AxiosClient";
import imageCompression from "browser-image-compression";
import { generarId } from "../helpers";

interface Message {
  user: string;
  password: string;
  message: string;
  file: File | undefined;
  image?: File | undefined;
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

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
    };

    try {
      const formData = new FormData();
      formData.append("user", user);
      formData.append("password", password);
      formData.append("message", message);
      formData.append("file", file as Blob);
      if (image) {
        if (image) {
          // Comprimir la imagen
          const compressedBlob = await imageCompression(image, options);

          // Convertir el Blob comprimido en un File con un nombre y tipo
          const compressedFile = new File(
            [compressedBlob],
            `${generarId()}.` + (image.type.split("/")[1] || "jpeg"), // Usa la extensión original si es posible
            { type: compressedBlob.type }
          );

          formData.append("image", compressedFile);
        }
      }

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
        message: data.detail.message,
        details: [],
      };
    } catch (error: any) {
      setLoadig(false);

      if (error.code == "ERR_NETWORK") {
        return {
          status: "failure",
          message:
            "Sin comunicacion con el servidor comunicate con el administrador",
          details: [],
        };
      }

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
