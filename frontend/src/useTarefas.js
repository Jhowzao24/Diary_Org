import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

const API = 'http://localhost:8000/api/tarefas/'

function toISO(date) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`
}

export function useTarefas(date) {
  const [tarefas, setTarefas] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchTarefas = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await axios.get(API, { params: { data: toISO(date) } })
      setTarefas(data)
    } catch { setTarefas([]) }
    finally { setLoading(false) }
  }, [date])

  useEffect(() => { fetchTarefas() }, [fetchTarefas])

  async function addTarefa(texto, prioridade) {
    const { data } = await axios.post(API, { texto, prioridade, data: toISO(date), concluida: false })
    setTarefas(prev => [...prev, data])
  }

  async function toggleTarefa(id, concluida) {
    const { data } = await axios.patch(`${API}${id}/`, { concluida: !concluida })
    setTarefas(prev => prev.map(t => t.id === id ? data : t))
  }

  async function deleteTarefa(id) {
    await axios.delete(`${API}${id}/`)
    setTarefas(prev => prev.filter(t => t.id !== id))
  }

  return { tarefas, loading, addTarefa, toggleTarefa, deleteTarefa }
}
