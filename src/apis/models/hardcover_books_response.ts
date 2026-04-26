export interface HardcoverImage {
  url: string;
  width?: number;
  height?: number;
  color?: string;
}

export interface HardcoverAuthor {
  id?: number;
  name: string;
  slug?: string;
}

export interface HardcoverContribution {
  author: HardcoverAuthor;
}

export interface HardcoverBookDocument {
  id: string;
  title: string;
  description?: string;
  release_date?: string;
  release_year?: number;
  pages?: number;
  slug?: string;
  image?: HardcoverImage;
  contributions?: HardcoverContribution[];
  isbns?: string[];
  genres?: string[];
}

export interface HardcoverSearchHit {
  document: HardcoverBookDocument;
}

export interface HardcoverSearchResults {
  found: number;
  hits: HardcoverSearchHit[];
}

export interface HardcoverSearchResponse {
  data: {
    search: {
      results: HardcoverSearchResults;
    };
  };
}
