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

  // STATES TO EDIT TASK 
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState("");

  // DELETE CONFIRMATION MODAL 
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState<string | null>(null);

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

  // HANDLE EDITING TASK 
  const startEditing = (todo: any) => {
    setEditingTaskId(todo.id);
    setEditedContent(todo.content);
  }

  // HANDLE CANCEL EDIT MODE 
  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditedContent("");
  }

  // HANDLE SAVE EDITED TASK 
  const handleSaveEdit = async (todoId: string) => {
    if (!editedContent.trim()) return;

    const { error } = await supabase
      .from("tbl_todos")
      .update({ content: editedContent })
      .eq("id", todoId);

    if (error) {
      console.error("Error updating task", error.message);
    } else {

      // CLEAR EDITING STATE 
      setEditingTaskId(null);
      setEditedContent("");
      fetchTodos();
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  // HANDLE DELETE TASK
  const handleDelete = async () => {
    if(!todoToDelete) return;

    const { error } = await supabase
    .from("tbl_todos")
    .delete()
    .eq("id", todoToDelete);

    if (error) {
      console.error("Error deleting task", error.message);
    }else {
      fetchTodos();
    }

    setShowDeleteModal(false);
    setTodoToDelete(null);
  };

  // Confirm delete action
  const confirmDelete = (todoId: string) => {
    setTodoToDelete(todoId);
    setShowDeleteModal(true);
  };

  // Cancel the delete action
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setTodoToDelete(null);
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
        <h1 className="text-3xl font-bold mb-4 text-center">Your Task List</h1>
      
        <button onClick={() => setShowInput((prev) => !prev)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add Task
        </button>

        {showInput && (
          <form onSubmit={handleAddTask} className="mt-4">
            <textarea
            className="w-full border p2 rounded mb-2 resize-none p-4"
            placeholder="Add a new task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            />
            <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
              Save Task
            </button>
            <button onClick={() => setShowInput(false)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded ml-2 hover:bg-gray-300">
              Cancel
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
                 
                 {/* FETCH TASKS */}
                  <div className="flex-1">
                    {editingTaskId === todo.id ? (
                      <input
                      type="text"
                      className="w-full border p-2 rounded"
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      />
                    ) : (
                      <span>{todo.content}</span>
                    )}
                  </div>

                  <div className="ml-4">
                    {editingTaskId === todo.id ? (
                      // SAVE EDIT MODE 
                      <>
                      <button onClick={() => handleSaveEdit(todo.id)}
                        className="text-green-600 mr-2">
                        Save
                      </button>

                      {/* // CANCEL EDIT MODE  */}
                      <button
                      onClick={cancelEditing}
                      className="text-red-600">
                        Cancel
                      </button>
                      </>

                    ) : (

                     <>
                       {/* EDIT TASK */}
                      <button
                      onClick={() => startEditing(todo)}
                      className="text-blue-600">
                        Edit
                      </button>

                       {/* DELETE TASK */}
                      <button 
                      onClick={() => confirmDelete(todo.id)}
                      className="text-red-600 ml-2"
                      >
                        Delete
                      </button>
                     
                     
                     </>
                    )}

                  </div>
                </li>

              ))}
            </ul>
          )}
        </div>

        {/* DELETE CONFIRMATION MODAL */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-md max-w-sm w-full">
              <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
              <p>Are you sure you want to delete this task?</p>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Yes, Delete task
                </button>
                <button
                onClick={cancelDelete}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
                  Cancel
                </button>
              </div>
            </div>

          </div>
        )}


      </div>

    </div>
  );
}
