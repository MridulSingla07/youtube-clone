import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getUserPlaylists,
  removeVideoFromPlaylist,
  updatePlaylist,
} from "../controllers/playlist.controller.js";

const playlistRouter = Router();

playlistRouter.use(verifyJWT);
playlistRouter.route("/create-playlist").post(createPlaylist);
playlistRouter.route("/add-to-playlist").post(addVideoToPlaylist);
playlistRouter.route("/remove-from-playlist").delete(removeVideoFromPlaylist);
playlistRouter.route("/my-playlists").get(getUserPlaylists);
playlistRouter.route("/:playlistId").get(getPlaylistById);
playlistRouter.route("/delete-playlist/:playlistId").delete(deletePlaylist);
playlistRouter.route("/update-playlist/:playlistId").get(updatePlaylist);

export default playlistRouter;
