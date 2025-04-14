import { useView } from "@viable/via-react";
import { PokemonsView } from "../../../core/view/pokemon/Pokemons";
import { Div } from "@flexive/core";
export const PokemonList = () => {
  const { value } = useView({ view: PokemonsView() });

  return value.results.map(({ name }) => <Div>{name}</Div>);
};
