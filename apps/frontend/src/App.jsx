// App.js
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Canvas from './components/Canvas';


function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Canvas />
    </DndProvider>
  );
}

export default App;
