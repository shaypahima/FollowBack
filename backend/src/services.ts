import { extractInstagramData, getNotFollowingBack, getZipFromForm } from "./helpers";

export const fileToNotFollowingBack = async (file: File) => {
  // 1. Convert to Buffer & Load Zip
  const zip = await getZipFromForm(file);

  // 2. Extract and Objectify
  const data = extractInstagramData(zip);

  const { followers, following } = data;

  return getNotFollowingBack(followers, following)


};
