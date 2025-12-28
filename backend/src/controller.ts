import { Context } from "hono"
import { extractInstagramData, getZipFromForm } from "./helpers"
import { fileToNotFollowingBack } from "./services"

const getNotFollowingBack = (c : Context) => {
  return c.text("response")
}
const getApprovedProfiles = (c : Context) => {
  return c.text("response")
}
const getNotExistedProfiles = (c : Context) => {
  return c.text("response")
}

const uploadZipFile = async (c : Context) => {
  const body = await c.req.parseBody();
  const file = body['file'] as File;

  if (!file) {
    return c.json({ error: 'No file uploaded' }, 400);
  }

  try {

    const profiles = await fileToNotFollowingBack(file)
    

    return c.json({
      success: true,
      profileCount: data.followers.length,

      data: data
    });
  } catch (error) {
    return c.json({ error: 'Failed to process zip file' }, 500);
  }
}
const updateProfiles = (c : Context) => {
  return c.text("response")
}

export default {
  getNotFollowingBack,
  getApprovedProfiles,
  getNotExistedProfiles,
  uploadZipFile,
  updateProfiles
}