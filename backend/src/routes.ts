import { Hono } from "hono";
import profilesControllers from "./controller";
import { getProfiles } from "./services";

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
profiles.get("/all", async (c) => {
  const allProfiles = await getProfiles();
  return c.json({ success: true, profiles: allProfiles });
});

profiles.post("/upload-zip",uploadZipFile);
profiles.post("/update-profiles", updateProfiles);

export default profiles;
