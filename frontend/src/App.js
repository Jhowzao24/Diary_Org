import React, { useState } from 'react'
import TaskPanel from './components/TaskPanel'
import Chatbot from './components/Chatbot'

export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date())

  function changeDay(delta) {
    setCurrentDate(prev => {
      const d = new Date(prev)
      d.setDate(d.getDate() + delta)
      return d
    })
  }

  function goToday() { setCurrentDate(new Date()) }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <TaskPanel currentDate={currentDate} onChangeDay={changeDay} onToday={goToday} />
      <Chatbot currentDate={currentDate} />
    </div>
  )
}
