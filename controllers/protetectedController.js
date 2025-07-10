import expressAsyncHandler from "express-async-handler";

export const getProtectedData = expressAsyncHandler(async (req, res) => {
  res.json({
    message: `Welcome, ${req.user.username}!`,
    user: req.user,
  });
});
