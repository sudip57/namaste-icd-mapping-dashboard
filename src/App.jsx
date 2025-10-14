import { useState } from 'react'
import './App.css'
import Map from './components/Map'
import Items from './components/Items'

function App() {
  return (
    <>
    <div className='flex justify-center p-3 bg-cyan-400 font-bold text-white'>Mapping Data</div>
    <div className='flex flex-col h-full gap-2'>
      <Map/>
    </div>
    </>
  )
}

export default App
