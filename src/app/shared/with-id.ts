export interface WithId {
    id: string | number;
    [key: string]: any; // Add index signature
  }