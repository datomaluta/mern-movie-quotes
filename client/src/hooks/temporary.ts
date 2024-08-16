import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import toast from "react-hot-toast";

const useSocket = () => {
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(
    null
  );
  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_SOCKET_URL, {
      withCredentials: true,
    });
  }, []);

  useEffect(() => {
    if (!socketRef.current) return;

    socketRef.current.on("notification_like", () => {
      console.log("NOTIFICATION");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("You have new notification");
    });

    socketRef.current.on("notification_comment", () => {
        console.log("NOTIFICATION COMMENT");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [queryClient]);

  const emit = (event: string, data: any) => {
    if (!socketRef.current) return;
    socketRef.current.emit(event, data);
  };

  return {
    emit,
  };
};

export default useSocket;
