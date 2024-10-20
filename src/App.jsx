import './App.css'
// import Home from './pages/Home'
import Button from './components/Button'

function App() {
  return (
    <>
      {/* Button with isOutline true */}
      <Button label="Learn More" isOutline={true} />

      {/* Button with isOutline false */}
      <Button label="Start Learning" isOutline={false} />
    </>
  );
}

export default App;
