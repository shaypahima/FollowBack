
import AdmZip = require("adm-zip");
import { Profile, RawProfile } from "./types";


/**
 * Converts RawProfile array to Profile array
 */
export const mapRawToProfile = (rawProfiles: RawProfile[]): Profile[] => {
  return rawProfiles.map((item) => {
    const data = item.string_list_data[0];
    return {
      username: item.title === "" ? (data.value || "") : item.title,
      url: data.href,
      timestamp: data.timestamp,
    };
  });
};

/**
 * Converts FormData file to Buffer and initializes AdmZip
 */
export const getZipFromForm = async (file: File): Promise<AdmZip> => {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return new AdmZip(buffer);
};

/**
 *  Extracts JSON files and converts them to Profile objects
 */
export const extractInstagramData = (zip: AdmZip) => {
  const followersPath = "connections/followers_and_following/followers_1.json";
  const followingPath = "connections/followers_and_following/following.json";

  const getJsonContent = (path: string): RawProfile[] => {
    const entry = zip.getEntry(path);
    if (!entry) return [];
    
    const content = entry.getData().toString("utf8");
    const parsed = JSON.parse(content);

    // Instagram following.json is usually wrapped in { relationships_following: [...] }
    // followers_1.json is usually a raw array or wrapped similarly.
    return parsed.relationships_following || parsed; 
  };

  const rawFollowers = getJsonContent(followersPath);
  const rawFollowing = getJsonContent(followingPath);

  return {
    followers: mapRawToProfile(rawFollowers),
    following: mapRawToProfile(rawFollowing),
  };
};

/**
 * Returns a list of profiles that you follow, but who do not follow you back.
 */
export const getNotFollowingBack = (followers: Profile[], following: Profile[]): Profile[] => {
  // 1. Create a Set of follower usernames for fast lookup
  const followerUsernames = new Set(followers.map(f => f.username));

  // 2. Filter the following list
  return following.filter(profile => !followerUsernames.has(profile.username));
};