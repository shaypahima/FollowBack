import { Hono } from "hono";
import profilesControllers from "./controller";

const {
  getApprovedProfiles,
  getNotExistedProfiles,
  getNotFollowingBack,
  updateProfiles,
  uploadZipFile,
} = profilesControllers;

const profiles = new Hono();

profiles.get("/not-following", getNotFollowingBack);
profiles.get("/approved", getApprovedProfiles);
profiles.get("/not-existed", getNotExistedProfiles);

profiles.post("/upload-zip",uploadZipFile);
profiles.post("/update-profiles", updateProfiles);

export default profiles;
