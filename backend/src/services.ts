import { Profile, Status } from "./generated/prisma/client";
import { prisma } from "./db";
import {
  extractInstagramData,
  getNotFollowingBack,
  getZipFromForm,
} from "./helpers";

import profileRepository from "./repositories";

export const fileToNotFollowingBack = async (file: File) => {
  // 1. Convert to Buffer & Load Zip
  const zip = await getZipFromForm(file);

  // 2. Extract and Objectify
  const data = extractInstagramData(zip);

  const { followers, following } = data;

  return getNotFollowingBack(followers, following);
};



export const getProfiles = async () => {
  const profiles = await prisma.profile.findMany();
  return profiles;
};
