export interface Profile {
  username: string;
  url: string;
  timestamp: number;
  status?: Status;
}


export enum Status {
  Unfollowed = 'Unfollowed',
  Approved = 'Approved',
  NotExist = 'Not Exist',
}
