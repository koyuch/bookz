import {AuthorDTO} from "./AuthorDTO";

export interface BookDTO {
  id?: number;
  title: string;
  description?: string;
  authors?: AuthorDTO[];
}
