import { Status } from "./generated/prisma/client";
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

export const updateProfilesDB = async (profiles: Record<string,string>) => {
  console.log( "profiles: " + JSON.stringify(profiles));
  const existenceChecks = await Promise.all(
    
    Object.entries(profiles).map(async ([username, status]) => ({
      username,
      status: status as Status,
      exists: !!(await prisma.profile.findUnique({ where: { username } })),
    }))
  );
  const profilesToUpdate = existenceChecks.filter(({ exists }) => exists).map(({ username, status }) => ({ username, status }));
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
