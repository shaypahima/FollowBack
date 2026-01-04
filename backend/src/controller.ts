import { Context } from "hono";
import { extractInstagramData, getZipFromForm } from "./helpers";
import {
  fileToNotFollowingBack,
  getProfiles,
  updateProfilesDB,
} from "./services";
import { Profile } from "./types";

const getNotFollowingBack = (c: Context) => {
  return c.text("response");
};
const getApprovedProfiles = (c: Context) => {
  return c.text("response");
};
const getNotExistedProfiles = (c: Context) => {
  return c.text("response");
};

const uploadZipFile = async (c: Context) => {
  const body = await c.req.parseBody();
  const file = body["file"] as File;

  if (!file) {
    return c.json({ error: "No file uploaded" }, 400);
  }

  try {
    const notFollowingBackProfiles = await fileToNotFollowingBack(file);
    await updateProfilesDB(notFollowingBackProfiles);

    const allProfiles = await getProfiles();
    return c.json({
      success: true,
      profileCount: allProfiles.length,

      data: allProfiles,
    });
  } catch (error) {
    return c.json({ error: "Failed to process zip file" }, 500);
  }
};
const updateProfiles = async (c: Context) => {
  try {
    const body = await c.req.json();
    const profiles = body["updatedProfiles"] as unknown as Record<string,string>;
    console.log("body: " + JSON.stringify(body));
    await updateProfilesDB(profiles);
    const allProfiles = await getProfiles();
    return c.json({ success: true, profiles: allProfiles });
  } catch (error) {
    console.error(error);
    return c.json({ error: "Failed to update profiles" }, 500);
  }
};

export default {
  getNotFollowingBack,
  getApprovedProfiles,
  getNotExistedProfiles,
  uploadZipFile,
  updateProfiles,
};
