import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'

const SUGGESTIONS = [
  { label: '💡 Ideia do dia', msg: 'Me dê uma ideia de tarefa para hoje' },
  { label: '⚡ Produtividade', msg: 'Como posso ser mais produtivo?' },
  { label: '🔥 Motivação',    msg: 'Me motive!' },
  { label: '📌 Organização',  msg: 'Dica para organizar tarefas' },
]

export default function Chatbot({ currentDate }) {
  const [collapsed, setCollapsed] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bodyRef = useRef(null)

  useEffect(() => {
    const h = new Date().getHours()
    const saudacao = h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite'
    setMessages([{
      role: 'bot',
      text: `${saudacao}! 👋 Sou seu assistente de produtividade. Pergunte qualquer coisa ou use as sugestões abaixo!`
    }])
  }, [])

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [messages])

  async function send(text) {
    const msg = text || input.trim()
    if (!msg || loading) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: msg }])
    setLoading(true)

    try {
      const { data } = await axios.post('http://localhost:8000/api/chatbot/', {
        mensagem: msg,
        tarefas_contexto: `Data: ${currentDate.toLocaleDateString('pt-BR')}`
      })
      setMessages(prev => [...prev, { role: 'bot', text: data.resposta }])
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: '⚠️ Erro ao conectar com o servidor.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ ...panelStyle, width: collapsed ? 48 : 320 }}>

      {/* Header */}
      <div onClick={() => setCollapsed(c => !c)} style={headerStyle}>
        <div style={aiIconStyle}>🤖</div>
        {!collapsed && (
          <>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9' }}>Assistente IA</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>Ideias & Motivação</div>
            </div>
            <span style={{ marginLeft: 'auto', color: '#64748b', fontSize: 18 }}>◀</span>
          </>
        )}
        {collapsed && <span style={{ color: '#64748b', fontSize: 18, marginLeft: 4 }}>▶</span>}
      </div>

      {!collapsed && (
        <>
          {/* Mensagens */}
          <div ref={bodyRef} style={bodyStyle}>
            {messages.map((m, i) => (
              <div key={i} style={msgStyle(m.role)}>{m.text}</div>
            ))}
            {loading && <div style={msgStyle('bot')}>✍️ Digitando...</div>}
          </div>

          {/* Sugestões rápidas */}
          <div style={{ padding: '8px 16px', display: 'flex', flexWrap: 'wrap', gap: 6, borderTop: '1px solid #334155' }}>
            {SUGGESTIONS.map(s => (
              <span key={s.label} onClick={() => send(s.msg)} style={chipStyle}>{s.label}</span>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid #334155', display: 'flex', gap: 8 }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
              placeholder="Pergunte algo..."
              rows={1}
              style={textareaStyle}
            />
            <button onClick={() => send()} disabled={loading} style={sendBtnStyle}>➤</button>
          </div>
        </>
      )}
    </div>
  )
}

const panelStyle = {
  background: '#1e293b',
  borderLeft: '1px solid #334155',
  display: 'flex',
  flexDirection: 'column',
  transition: 'width 0.3s ease',
  overflow: 'hidden',
  flexShrink: 0,
}

const headerStyle = {
  padding: 16,
  borderBottom: '1px solid #334155',
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  cursor: 'pointer',
  userSelect: 'none',
}

const aiIconStyle = {
  width: 32, height: 32,
  background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
  borderRadius: 10,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: 16, flexShrink: 0,
}

const bodyStyle = {
  flex: 1,
  overflowY: 'auto',
  padding: 16,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
}

const msgStyle = role => ({
  maxWidth: '90%',
  padding: '10px 12px',
  borderRadius: role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
  fontSize: 13,
  lineHeight: 1.5,
  background: role === 'user' ? 'linear-gradient(135deg,#312e81,#4c1d95)' : '#0f172a',
  color: role === 'user' ? '#e0e7ff' : '#cbd5e1',
  alignSelf: role === 'user' ? 'flex-end' : 'flex-start',
  animation: 'slideIn .2s ease',
  whiteSpace: 'pre-wrap',
})

const chipStyle = {
  background: '#0f172a',
  border: '1px solid #334155',
  borderRadius: 20,
  padding: '4px 10px',
  fontSize: 11,
  color: '#94a3b8',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
}

const textareaStyle = {
  flex: 1,
  background: '#0f172a',
  border: '1px solid #334155',
  borderRadius: 10,
  padding: '8px 12px',
  color: '#f1f5f9',
  fontSize: 13,
  outline: 'none',
  resize: 'none',
  height: 38,
}

const sendBtnStyle = {
  background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
  border: 'none',
  borderRadius: 10,
  width: 38, height: 38,
  color: 'white',
  fontSize: 16,
  cursor: 'pointer',
  flexShrink: 0,
}
