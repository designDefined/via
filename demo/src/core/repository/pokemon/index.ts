import ky from "ky";
import { PaginationNamedDto } from "../common/dto/PaginationDto";

const getPokemons = (nextUrl?: string) =>
  ky
    .get(`${nextUrl ?? "https://pokeapi.co/api/v2/pokemon/"}`)
    .json()
    .then(PaginationNamedDto.parse);

export const PokemonRepository = { getPokemons };
