// SocketContext.tsx
import React, { createContext, useContext, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useTranslate } from "../hooks/useTranslate";

interface SocketContextProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
  emit: (event: string, data: any) => void;
}

const SocketContext = createContext<SocketContextProps | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(
    null
  );
  const { t } = useTranslate();
  const message = t("you_have_new_notification");

  useEffect(() => {
    console.log(import.meta.env.VITE_SOCKET_URL);
    socketRef.current = io(import.meta.env.VITE_SOCKET_URL, {
      withCredentials: true,
    });

    const socket = socketRef.current;

    socket.on("notification_like", () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast(message, {
        icon: "🔔",
      });
    });

    socket.on("error", (error) => {
      console.log("NEW ERROR");
      toast.error(error);
    });

    socket.on("notification_comment", () => {
      console.log("not comment");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast(message, {
        icon: "🔔",
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [queryClient, message]);

  const emit = (event: string, data: any) => {
    if (!socketRef.current) return;
    socketRef.current.emit(event, data);
  };

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, emit }}>
      {children}
    </SocketContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = (): SocketContextProps => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
