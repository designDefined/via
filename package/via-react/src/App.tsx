import { Suspense } from "react";

const Test = () => {
  throw new Promise(res => {
    setTimeout(() => res("42"), 2000);
  });

  return <div>test</div>;
};

function App() {
  return (
    <div>
      <Suspense fallback={<div>fallback</div>}>
        <Test />
      </Suspense>
    </div>
  );
}

export default App;
