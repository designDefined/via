import { useCallback } from "react";
import { useNavigate as useNativeNavigate, useParams } from "react-router-dom";

type Destination = {
  presentationId?: number;
  contentId?: number;
};

export const useNavigate = () => {
  const params = useParams();
  const nativeNavigate = useNativeNavigate();
  const navigate = useCallback(
    (destination: Destination) => {
      const paths: string[] = [];
      if (destination.presentationId) paths.push(`presentation/${destination.presentationId}`);
      if (destination.contentId)
        paths.length < 1
          ? paths.push(`presentation/${params.presentationId}`, `${destination.contentId}`)
          : paths.push(`${destination.contentId}`);
      nativeNavigate("/" + paths.join("/"));
    },
    [params, nativeNavigate],
  );
  return navigate;
};

export const useDestination = () => {
  const params = useParams();
  return {
    presentationId: Number(params.presentationId) ?? 0,
    contentId: Number(params.contentId) ?? 0,
  };
};
