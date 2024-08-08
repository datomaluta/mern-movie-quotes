import Comment from "../models/commentModel";
import Quote from "../models/quoteModel";
import { CustomRequest } from "../types";
import { catchAsync } from "../utils/catchAsync";

export const createComment = catchAsync(
  async (req: CustomRequest, res, next) => {
    const { text, quoteId } = req.body;

    const newComment = await Comment.create({
      text,
      userId: req.user._id,
      quoteId,
    });

    await Quote.findByIdAndUpdate(quoteId, {
      $push: { comments: newComment._id },
    });

    res.status(201).json({
      status: "success",
      data: {
        comment: newComment,
      },
    });
  }
);
