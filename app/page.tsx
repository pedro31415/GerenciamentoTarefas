"use client"

import { trpc } from "@/utils/trpc";
import AddTask from "./components/AddTask";
import ToDoList from "./components/ToDoList";

export default function Home() {
  const { data: tasks = [], isLoading } = trpc.task.getall.useQuery()

  if (isLoading) return <p>Loading...</p>

  return (
      <main className="max-w-4xl mx-auto mt-4">
        <div className="text-center my-5 flex flex-col gap-4">
          <h1 className="text-2xl font-bold">Todo List App</h1>
          <AddTask />
          <ToDoList tasks={tasks}/>
        </div>
      </main>
  );
}
