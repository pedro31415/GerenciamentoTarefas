"use client"

import { ITask } from '@/types/tasks'
import React, { FormEventHandler, useState } from 'react'
import { FaTrash } from 'react-icons/fa'
import { FiEdit } from 'react-icons/fi'
import Modal from './Modal'
import { trpc } from '@/utils/trpc'

interface TaskProps {
    task: ITask
}

const Task: React.FC<TaskProps> = ({ task }) => {

  const utils = trpc.useUtils()

  const editTodo = trpc.task.edit.useMutation({
    onSuccess: (data) => {
      console.log(data.message)
      utils.task.getall.invalidate()
    },
    onError: (error) => {
      console.log(error)
    }
  })

  const deleteTodo = trpc.task.delete.useMutation({
    onSuccess: (data) => {
      console.log(data.message)
      utils.task.getall.invalidate()
    },
    onError: (error) => {
      console.log(error)
    }
  })

  const [openModalEdit, setModalOpenEdit] = useState<boolean>(false)
  const [openModalDelete, setModalOpenDeleted] = useState<boolean>(false)
  const [taskToEdit, setTaskEdit] = useState<string>(task.titulo)
  const [taskToEditDescription, setTaskEditDescription] = useState<string | undefined >(task.descricao)

  const handleSubmitEditTodo: FormEventHandler<HTMLFormElement> =  async (e) => {
    e.preventDefault()
    try {
      const response = await editTodo.mutateAsync({
        id: task.id,
        titulo: taskToEdit,
        descricao: taskToEditDescription
      })
      console.log(response.message)
      setTaskEdit("")
      setTaskEditDescription("")
      setModalOpenEdit(false)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmitDeleteTodo =  async (id: string) => {
    try {
      const response = await deleteTodo.mutateAsync(id)
      console.log(response.message)
      setModalOpenDeleted(false)

      const alertContainer = document.createElement('div')
      alertContainer.innerHTML = `
            <div role="alert" class="alert alert-success fixed bottom-4 right-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Tarefa removida com sucesso!</span>
            </div>
      `
      document.body.appendChild(alertContainer)

      setTimeout(()=> {
        alertContainer.remove()
      }, 3000)
    } catch (error) {
      console.log(error)
    }
  }


  return (     
        <tr key={task.id}>
            <td>{task.titulo}</td>
            <td>{task.descricao}</td>
            <td className='flex gap-5'>
              <FiEdit onClick={() => {
                setModalOpenEdit(true)
              }} cursor='pointer'  className='text-blue-500' size={25}/>
              <Modal modalOpen={openModalEdit} setModalOpen={setModalOpenEdit}>
                <form onSubmit={handleSubmitEditTodo}>
                  <h3 className='font-bold text-lg text-center'>
                    Edição da tarefa
                  </h3>
                  <div className='w-full mb-4'>
                    <label className='label mb-2'>
                      <span className='label-text font-semibold'>Título</span>
                    </label>
                    <input 
                      value={taskToEdit}
                      onChange={e => setTaskEdit(e.target.value)}
                      type="text" 
                      placeholder='Type here'
                      className='input input-bodered w-full mb-4'
                    />
                    <label className='label mb-2'>
                      <span className='label-text font-semibold'>Descrição</span>
                    </label>
                    <input 
                      value={taskToEditDescription}
                      onChange={e => setTaskEditDescription(e.target.value)}
                      type="text" 
                      placeholder='Type here'
                      className='input input-bodered w-full mb-4'
                    />
                    <div className='flex justify-end'>
                      <button type='submit' className='btn'>Confirmar</button>
                    </div>
                  </div>
                </form>
              </Modal>
              <FaTrash onClick={() => {
                setModalOpenDeleted(true)
              }} cursor='pointer' className='text-red-500' size={25}/>
              <Modal modalOpen={openModalDelete} setModalOpen={setModalOpenDeleted}>
                  <h3 className='text-lg'>
                    Deseja realmente deletar a tarefa?
                  </h3>
                  <div className='modal-action'>
                    <button onClick={() => {
                      handleSubmitDeleteTodo(task.id)
                    }} className='btn'>
                      Sim
                    </button>
                  </div>
              </Modal>
            </td>
        </tr>
  )
}

export default Task