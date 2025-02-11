"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();
  const [task, setTask] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [todos, setTodos] = useState<any[]>([]);

  // FETCH USER SESSION 
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
      } else {
        setUserEmail(session.user.email ?? "");
        setUserId(session.user.id);
      }
    };

    fetchUser();
  }, [router]);

  // Separate useEffect for fetching todos
  useEffect(() => {
    if (userId) { // Only fetch if userId exists
      fetchTodos();
    }
  }, [userId]); // Depend on userId

  // FUNCTION TO FETCH TASK FROM SUPABASE  
  const fetchTodos = async () => {
    if (!userId) return; // Guard clause

    const { data, error } = await supabase
      .from("tbl_todos")
      .select("*")
      .order("created_at", { ascending: false })
      .eq('user_id', userId);
    
    if (error) {
      console.error("Error fetching todos:", error);
    } else {
      setTodos(data || []);
    }
  };

  // HANLDE ADDING A NEW TASK  
  const handleAddTask = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!task.trim() || !userId) return;

      // INSERT THE NEW TASK ALONG WITH THE USER'S ID 
      const { error } = await supabase.from("tbl_todos").insert([
        { user_id: userId, content: task },
      ]);
     
      if (error) {
        console.error("Error adding new task", error.message);
      }else {
        setTask("");
        setShowInput(false); 
        fetchTodos();
      }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
    
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      {userEmail ? <p>Logged in as: {userEmail}</p> : <p>Loading...</p>}
      <button
        onClick={handleLogout}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>

      <div className="p-4 max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Your Task List</h1>
      
        <button onClick={() => setShowInput((prev) => !prev)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add Task
        </button>

        {showInput && (
          <form onSubmit={handleAddTask} className="mt-4">
            <textarea
            className="w-full border p2 rounded mb-2"
            placeholder="Add a new task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            />
            <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
              Save Task
            </button>
          </form>
        )}

        <div className="mt-6">
          {todos.length === 0 ? (
            <p className="text-gray-600">No tasks added yet.</p>
          ) : (
            <ul className="space-y-2">
              {todos.map((todo) => (
                <li
                key={todo.id}
                className="border p-3 rounded shadow-sm hover:bg-gray-50">
                  {todo.content}
                </li>
              ))}
            </ul>
          )}

        </div>


      </div>

    </div>
  );
}
