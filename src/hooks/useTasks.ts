import { ITask } from "@/@types/interface/tasks.interfaces";
import { fetchTasks } from "@/utils/api/tasksApi";
import { useEffect, useState } from "react";

export const useTasks = () => {
  const [tasks, setTasks] = useState<ITask[]>([]);

  const getTasks = async () => {
    try {
      const res = await fetchTasks();
      setTasks(res.data);
    } catch (error) {
      console.error("Fetch tasks failed", error);
    }
  };

  useEffect(() => {
    const fetchTasks = async () => {
      await getTasks();
    };

    fetchTasks();
  }, []);

  return { tasks, setTasks, getTasks };
};
