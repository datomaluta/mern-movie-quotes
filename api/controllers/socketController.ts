import { SocketWithUser } from "../middlewares/authMiddleware";
import Comment from "../models/commentModel";
import Like from "../models/likeModel";
import Notification from "../models/notificationModel";
import Quote from "../models/quoteModel";

export const onConnection = (socket: SocketWithUser) => {
  console.log("Connected to socket.io ", socket.id);

  if (socket.user) {
    socket.join(socket.user.id);
  }

  socket.on("like", async (data: { quoteId: string }) => {
    if (!socket.user) {
      console.log("User not authenticated");
      return;
    }
    const { quoteId } = data;
    const userId = socket.user.id;

    try {
      const quote = await Quote.findById(quoteId);
      if (!quote) {
        socket.emit("error", "Quote not found");
        return;
      }

      const existingLike = await Like.findOne({ userId, quoteId });
      if (existingLike) {
        console.log("Existing like found");
        socket.emit("error", "You already liked this quote");
        return;
      }

      const notification = new Notification({
        recipient: quote.userId?._id?.toString(),
        sender: userId,
        type: "like",
        quote: quoteId,
      });
      await notification.save();

      const like = new Like({ userId, quoteId });
      await like.save();

      console.log("SENT TO: ", quote.userId?._id?.toString());
      socket
        .to(quote.userId?._id?.toString())
        .emit("notification_like", notification);
    } catch (error) {
      socket.emit("error", "An error occurred while liking the quote");
      console.error(error);
    }
  });

  socket.on(
    "createComment",
    async (data: { quoteId: string; text: string }) => {
      try {
        if (!socket.user) {
          console.log("User not authenticated");
          return;
        }
        const { quoteId, text } = data;
        const userId = socket.user.id;

        const quote = await Quote.findById(quoteId);
        if (!quote) {
          socket.emit("error", "Quote not found");
          return;
        }

        const comment = new Comment({ userId, quoteId, text });
        await comment.save();

        await Quote.findByIdAndUpdate(quoteId, {
          $push: { comments: comment._id },
        });

        const notification = new Notification({
          recipient: quote.userId?._id?.toString(),
          sender: userId,
          type: "comment",
          quote: quoteId,
        });
        await notification.save();

        console.log(
          "Comment notification SENT TO: ",
          quote.userId?._id?.toString()
        );
        socket
          .to(quote.userId?._id?.toString())
          .emit("notification_comment", notification);
      } catch (error) {
        socket.emit("error", "An error occurred while commenting on the quote");
        console.error(error);
      }
    }
  );


};

