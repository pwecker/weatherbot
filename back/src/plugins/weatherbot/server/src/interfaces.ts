export interface Coord {
  lat: number;
  lng: number;
  id: string;
}

export interface Forecast {
  city_name: string;
  country_code: string;
  state_code: string;
  timezone: string;
  lat: number;
  lon: number;
  data: any[];
  location: number;
}

export interface ForecastQuery {
  filters: {
    date: string;
    location?: any;
  };
  sort: string;
  limit: number;
  populate: any;
}

export interface ForecastDoc {
  data: any;
  date: string;
  score: number;
  location: any;
}

export interface LocationDoc {
  name: string;
  state: string;
  id: number;
}

export interface MessageDoc {
  date: string;
  content: string;
  usage: number;
  location: any;
  uploaded: boolean;
}

export interface TokenDoc {
  documentId: string;
  access_token: string;
  refresh_token: string;
  expires_at: number;
}