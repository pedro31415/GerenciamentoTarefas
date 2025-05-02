import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';
import { ITask } from '@/types/tasks';
import { generateId } from '@/utils/generateId';
import { tasksDb } from '../memory';
import SuperJSON from 'superjson';

const t = initTRPC.create({
  transformer: SuperJSON
});


export const appRouter = t.router({
  task: t.router({
    getall: t.procedure.query(() => {
      return tasksDb
    }),

    add: t.procedure.input(z.object({
      titulo: z.string().min(1),
      descricao: z.string().optional()
    })).mutation(({ input }) => {
      const newTask: ITask = {
        id: generateId(),
        titulo: input.titulo,
        descricao: input.descricao,
        dataCriacao: new Date().toISOString()
      };
      tasksDb.push(newTask);
      console.log(tasksDb)
      return {
        status: 201,
        message: 'Tarefa criada com sucesso',
        data: newTask
      };
    }),

    edit: t.procedure.input(z.object({
      id: z.string(),
      titulo: z.string().min(1),
      descricao: z.string().optional()
    })).mutation(({ input }) => {
      const taskIndex = tasksDb.findIndex(task => task.id === input.id);
      if (taskIndex === -1)  {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Tarefa não encontrada'
        })
      }

      const updatedTask: ITask = {
        ...tasksDb[taskIndex],
        titulo: input.titulo,
        descricao: input.descricao
      };
      tasksDb[taskIndex] = updatedTask;
      return {
        status: 200,
        message: 'Tarefa atualizada com sucesso',
        data: updatedTask
      };
    }),

    delete: t.procedure.input(z.string()).mutation(({ input }) => {
      const taskIndex = tasksDb.findIndex(task => task.id === input);
      if (taskIndex === -1) throw new  TRPCError({
        code: 'NOT_FOUND',
        message: 'Tarefa não encontrada'
      });

      const deletedTask = tasksDb.splice(taskIndex, 1)[0]

      return {
        status: 200,
        message: 'Tarefa deletada com sucesso',
        data: deletedTask
      }
    }),
  }),
});

export type AppRouter = typeof appRouter;

