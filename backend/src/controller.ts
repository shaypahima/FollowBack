import { Context } from "hono";
import { extractInstagramData, getZipFromForm } from "./helpers";
import {
  fileToNotFollowingBack,
  getProfiles,
} from "./services";

import profileRepository from "./repositories";
import { Profile, Status } from "./generated/prisma/client";

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
  console.log("body: " + JSON.stringify(body));
  const file = body["file"] as File;
  console.log("file: " + file);
  if (!file) {
    console.log("No file uploaded");
    return c.json({ error: "No file uploaded" }, 400);
  }

  try {
    const notFollowingBackProfiles = await fileToNotFollowingBack(file);
    await profileRepository.addProfiles(notFollowingBackProfiles as unknown  as Profile[]);
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
    const profiles = body["updatedProfiles"] as unknown as Record<string,Status | null>;
    await profileRepository.updateProfileStatus(profiles as Record<string, Status | null>);
    return c.json({ success: true });
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
