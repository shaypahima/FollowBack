import { Status } from "../prisma/generated/client";
import { prisma } from "./db";
import { extractInstagramData, getNotFollowingBack, getZipFromForm } from "./helpers";
import { Profile } from "./types";

export const fileToNotFollowingBack = async (file: File) => {
  // 1. Convert to Buffer & Load Zip
  const zip = await getZipFromForm(file);

  // 2. Extract and Objectify
  const data = extractInstagramData(zip);

  const { followers, following } = data;

  return getNotFollowingBack(followers, following)


};

export const updateProfilesDB = async (profiles: Profile[]) => {

  const existenceChecks = await Promise.all(
    profiles.map(async (profile) => ({
      profile,
      exists: !!(await prisma.profile.findUnique({ where: { username: profile.username } })),
    }))
  );
  const profilesToAdd = existenceChecks.filter(({ exists }) => !exists).map(({ profile }) => profile);
  await prisma.profile.createMany({
    data: profilesToAdd.map((profile) => ({
      username: profile.username,
      url: profile.url,
      timestamp: profile.timestamp,
    })),
  });
  const profilesToUpdate = profiles.filter((profile) => profile.status);
  await prisma.$transaction(
    profilesToUpdate.map((profile) =>
      prisma.profile.update({
        where: { username: profile.username },
        data: { status: profile.status as Status },
      })
    )
  );
  
};

export const getProfiles = async () => {
  const profiles = await prisma.profile.findMany();
  return profiles;
};
