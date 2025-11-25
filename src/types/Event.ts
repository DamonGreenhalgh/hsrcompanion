export interface Event {
  title: string;
  flair: string;
  startMessageId: number;
}

export const defaultEvent: Event = {
  title: '',
  flair: '',
  startMessageId: -1
}

export type EventCollection = Record<string, Event>;
