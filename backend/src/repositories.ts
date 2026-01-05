import { prisma } from "./db";
import { Profile } from "./generated/prisma/client";
import { Status } from "./generated/prisma/enums";

interface ProfileRepository {
  addProfiles(profiles: Profile[]): Promise<Profile[]>;
  updateProfileStatus(profiles: Record<string, Status>): Promise<Profile[]>;
}

const profileRepository: ProfileRepository = {
  
  async addProfiles(profiles: Profile[]) {
    return await Promise.all(
      profiles.map(async (profile : Profile) => {
        return await prisma.profile.upsert({
          where: {
            username: profile.username
          },
          update: {},
          create: {
            username:profile.username ,
            timestamp: profile.timestamp, 
            url: profile.url
          }
        });
      })
    );
  },
  async updateProfileStatus(profiles: Record<string, Status>) {
    console.log("profiles: " + JSON.stringify(profiles));
    console.log("profile statuses: " + Object.entries(profiles).map(([username, status]) => `${username}: ${status}`).join(', '));
    
    const mapStatus = (status: string): Status => {
      if (status === 'Not Exist') {
        return 'NOT_EXISTED' as Status;
      }
      if (status === 'Unfollowed') {
        return 'UNFOLLOWED' as Status;
      }
      if (status === 'Approved') {
        return 'APPROVED' as Status;
      }
      return status as Status;
    };
    
    return await Promise.all(
      Object.entries(profiles).map(([username, status]) =>
        prisma.profile.update({
          where: {
            username
          },
          data: {
            status: mapStatus(status as string)
          }
        })
      )
    );
  },
} 

export default profileRepository;