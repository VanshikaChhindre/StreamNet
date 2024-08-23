
import Layout from './Layout'
import { Route, Routes } from 'react-router-dom'
import { Home, Channel } from './components/exports'
import Video from './components/VideoUpload'
import Login from './features/Login'
import Signup from './features/Signup'
import VideoPlayer from './components/VideoPlayer'


function App() {

  return (
    <div className=''>
    <Routes >
    <Route path='/sign-up' element={<Signup/>}/>
    <Route path='/login' element={<Login/>}/>

    <Route path='/' element={<Layout/>}>
        <Route path='/' element={<Home/>}/>
        <Route path='/your-channel' element={<Channel/>}/>
        <Route path='/add-video' element={<Video/>}/>
        <Route path='/video/:id' element={<VideoPlayer/>}/>
      </Route>
    </Routes>
    </div>
  )
}

export default App
