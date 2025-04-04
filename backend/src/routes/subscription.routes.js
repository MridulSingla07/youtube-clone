import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
  getSubscribedChannels,
  getUserChannelSubscribers,
  toggleSubscription,
} from "../controllers/subscription.controller.js";

const subscribeRouter = Router();

subscribeRouter.use(verifyJWT);

subscribeRouter
  .route("/toggle-subscription/:channelId")
  .patch(toggleSubscription);
subscribeRouter.route("/my-subscription").get(getSubscribedChannels);
subscribeRouter.route("/my-subscribers").get(getUserChannelSubscribers);

export default subscribeRouter;
