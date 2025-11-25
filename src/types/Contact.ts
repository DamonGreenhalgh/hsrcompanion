export interface Contact {
  name: string;
  flair: string;
  icon: string;
}

export const defaultContact = {
  name: '',
  flair: '',
  icon: ''
};

export type ContactCollection = Record<string, Contact>;
