import { ITask } from "@/@types/interface/tasks.interfaces";
import { fetchTasks } from "@/utils/api/tasksApi";
// import { fetchTasks } from "@/pages/api/tasksApi";
import { useEffect, useState } from "react";

export const useTasks = (role?: string) => {
  const [tasks, setTasks] = useState<ITask[]>([]);

  const getTasks = async () => {
    try {
      let res;
      if (role === "admin") {
         const { fetchadminmytasks } = await import("@/utils/api/admin/admin");
         res = await fetchadminmytasks();
      } else {
         res = await fetchTasks();
      }
      setTasks(res.data);
    } catch (error) {
      console.error("Fetch tasks failed", error);
    }
  };

  useEffect(() => {
    if (role !== undefined) {
      getTasks();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  return { tasks, setTasks, getTasks };
};
