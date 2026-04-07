import WebcamView from "./WebcamView";
import './App.css';

function App() {
  return (
    <>
      <section id="app">
        <section>
          <h1>Gesture Draw</h1>
        </section>
        <WebcamView />
      </section>
    </>
  );
}

export default App;