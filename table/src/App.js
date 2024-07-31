 
import './App.css';
import Header from './component/Header';
import Main from './component/Main';
 
function App() {
  return (
    <div className='flex flex-col p-4 m-3 gap-6' >
      <Header />
      <Main/>
    </div>
  );
}

export default App;
