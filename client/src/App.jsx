
import Layout from './Layout'
import Landing from './pages/Landing'
import { Route, Routes } from 'react-router-dom'
import { Home, Channel } from './components/exports'


function App() {

  return (
    <div className=''>
    <Routes >
      <Route path='/' element={<Layout/>}>
        <Route path='/' element={<Home/>}/>
        <Route path='/your-channel' element={<Channel/>}/>
       

      </Route>
    </Routes>
    </div>
  )
}

export default App
