import { Main } from "@flexive/core";
import { TextLoader } from "../../component/loaders/TextLoader";
import { PokemonList } from "./PokemonList";

export const HomePage = () => {
  return (
    <Main>
      <TextLoader>
        <PokemonList />
      </TextLoader>
    </Main>
  );
};
