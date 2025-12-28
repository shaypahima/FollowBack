export interface RawProfile {
  title: string;
  string_list_data: Array<{
    href: string;
    value?: string;
    timestamp: number;
  }>;
}

export interface Profile {
  username: string;
  url: string;
  timestamp: number;
}