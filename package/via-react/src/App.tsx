import { fetchState } from "@viable/via";
import { useSubscribedState } from "./store/useStoreState";
import { map } from "rxjs";

const [TestSubject] = fetchState<{ text: string }>({ key: "test", init: () => ({ text: "start!" }) });

function App() {
  const test = useSubscribedState({ key: "test", subject: TestSubject.pipe(map(({ context }) => context)) });
  return <div>app</div>;
}

export default App;
