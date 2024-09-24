
import Layout from './Layout'
import { Route, Routes } from 'react-router-dom'
import { Home, Channel, Video, VideoPlayer, WatchHistory, Settings, Tweet, UserChannel} from './components/exports'
import Login from './features/Login'
import Signup from './features/Signup'



function App() {

  return (
    <div className=''>
    <Routes >
    <Route path='/sign-up' element={<Signup/>}/>
    <Route path='/login' element={<Login/>}/>

    <Route path='/' element={<Layout/>}>
        <Route path='/' element={<Home/>}/>
        <Route path='/your-channel/:userId?' element={<Channel/>}/>
        <Route path='/user-channel/:username' element={<UserChannel/>}/>
        <Route path='/watch-history' element={<WatchHistory/>}/>
        <Route path='/settings' element={<Settings/>}/>
        <Route path='/add-video' element={<Video/>}/>
        <Route path='/add-tweet' element={<Tweet/>}/>
        <Route path='/video/:id' element={<VideoPlayer/>}/>
      </Route>
    </Routes>
    </div>
  )
}

export default App
