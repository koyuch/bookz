import {AuthorDTO} from "./AuthorDTO";

export interface BookQueryDTO {
  title?: string;
  description?: string;
  author?: AuthorDTO;
}
