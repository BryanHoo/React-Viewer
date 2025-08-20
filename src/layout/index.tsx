import { memo } from 'react';
import Header from './header';
import Materiel from './materiel';
import Canvas from './canvas';
import Setting from './setting';

const App = memo(() => {
  return (
    <div className="w-full h-full flex flex-col">
      <Header />
      <div className="flex-1 flex h-0">
        <Materiel />
        <Canvas />
        <Setting />
      </div>
    </div>
  );
});

App.displayName = 'App';

export default App;
