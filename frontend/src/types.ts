export interface Profile {
  username: string;
  url: string;
  timestamp: number;
  status?: 'Unfollowed' | 'Approved' | 'Not Exist';
}

