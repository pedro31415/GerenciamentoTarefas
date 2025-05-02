"use client"

import React, { FormEventHandler, useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import Modal from './Modal'
import { trpc } from '@/utils/trpc'

const AddTask = () => {

  const utils = trpc.useUtils()

  const addTodo = trpc.task.add.useMutation({
    onSuccess: () => {
      utils.task.getall.invalidate()
    }
  })

  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [newTaskValue, setNewTaskValue] = useState<string>('')
  const [newTaskDescription, setNewTaskDescription] = useState<string>('')

  const handleSubmitNewTodo: FormEventHandler<HTMLFormElement> =  async (e) => {
    e.preventDefault()
    console.log(newTaskValue)
    console.log(newTaskDescription)
    await addTodo.mutateAsync({
      titulo: newTaskValue,
      descricao: newTaskDescription,
    })
    setNewTaskValue("")
    setNewTaskDescription("")
    setModalOpen(false)
  }


  return (
    <div>
        <button onClick={() => {
          setModalOpen(true)
        }} className='btn btn-secondary w-full'>
            Adicione uma tarefa<AiOutlinePlus className='ml-2' size={13}/>
        </button>

        <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
          <form onSubmit={handleSubmitNewTodo}>
            <h3 className='font-bold text-lg texe-center'>
              Adicione uma nova tarefa
            </h3>
            <div className='w-full mb-4'>
              <label className='label mb-2'>
                <span className='label-text font-semibold'>Título</span>
              </label>
              <input 
                value={newTaskValue}
                onChange={e => setNewTaskValue(e.target.value)}
                type="text" 
                placeholder='Type here'
                className='input input-bodered w-full mb-4'
              />
              <label className='label mb-2'>
                <span className='label-text font-semibold'>Descrição</span>
              </label>
              <input 
                value={newTaskDescription}
                onChange={e => setNewTaskDescription(e.target.value)}
                type="text" 
                placeholder='Type here'
                className='input input-bodered w-full mb-4'
              />
              <button type='submit' className='btn'>Submit</button>
            </div>
          </form>
        </Modal>
    </div>
  )
}

export default AddTask

