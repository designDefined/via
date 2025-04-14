import { View } from "@viable/via";
import { Paginated } from "../../entity/common/Paginated";
import { NamedSummary } from "../../entity/common/Summary";
import { PokemonRepository } from "../../repository/pokemon";
import { wait } from "../../utility/wait";

export const PokemonsView = View<[], Promise<Paginated<NamedSummary>>>(() => ({
  key: { name: "Pokemons" },
  from: () => PokemonRepository.getPokemons().then(wait(1000)),
}));
