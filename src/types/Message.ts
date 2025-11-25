export interface Message {
  contactId: number;
  content: string;
  promptPlayer: boolean;
  options: number[];
  next: number;
}

export const defaultMessage = {
  contactId: -1,
  content: '',
  promptPlayer: false,
  options: [],
  next: -1
};

export type MessageCollection = Record<string, Message>;
