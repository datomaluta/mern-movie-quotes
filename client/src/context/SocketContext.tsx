import React, { createContext, useContext, useEffect, useState } from "react";
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

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const [socket, setSocket] = useState<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);
  const { t } = useTranslate();
  const message = t("you_have_new_notification");

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
      withCredentials: true,
    });

    setSocket(newSocket);

    newSocket.on("notification_like", () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast(message, {
        icon: "🔔",
      });
    });

    // newSocket.on("error", (error) => {
    //   console.log("NEW ERROR");
    //   toast.error(error);
    // });

    newSocket.on("notification_comment", () => {
      // console.log("not comment");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast(message, {
        icon: "🔔",
      });
    });

    return () => {
      newSocket.disconnect();
    };
  }, [queryClient, message]);

  const emit = (event: string, data: any) => {
    if (!socket) return;
    socket.emit(event, data);
  };

  return (
    <SocketContext.Provider value={{ socket, emit }}>
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
