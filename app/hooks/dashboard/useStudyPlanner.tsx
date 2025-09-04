"use client";
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { createClient } from '@supabase/supabase-js';
import { useStudyPlannerContext } from '../../contexts/StudyPlannerContext';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const useStudyPlanner = ({ onClose, userId, spaceId, tableType = 'todos', openAddTaskWithAIPlan }: { 
  onClose: () => void, 
  userId: string,
  spaceId?: string,
  tableType?: 'todos' | 'tasks',
  openAddTaskWithAIPlan?: (planTitle: string, planContent: string) => void
}) => {
  const { aiPlan, setAiPlan, selectedType, setSelectedType, setPlanTitle } = useStudyPlannerContext();

  const handleTypeClick = (type: 'day' | 'week' | 'month') => {
    setSelectedType(type);
  };
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleClose = () => {
    setContent('')
    setSelectedType(null)
    setAiPlan('')
    setPlanTitle('')
    onClose()
  }
  
  const handleBackdropClick = (e: React.MouseEvent) => {
  if (e.target === e.currentTarget) {
        handleClose()
      }
  }

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePlan = async (range: "day" | "week" | "month") => {
    setLoading(true);
    setAiPlan(""); 
    setPlanTitle(`IskolarSpace Generated ${range.charAt(0).toUpperCase() + range.slice(1)} Study Plan`);

    // Dynamic table and filter based on tableType
    const tableName = tableType === 'todos' ? 'tbl_todos' : 'tbl_tasks';
    const filterField = tableType === 'todos' ? 'user_id' : 'space_id';
    const filterValue = tableType === 'todos' ? userId : spaceId;

    if (!filterValue) {
      toast.error(tableType === 'todos' ? "User ID required" : "Space ID required");
      setLoading(false);
      return;
    }

    const { data: tasks, error } = await supabase
      .from(tableName)
      .select("*")
      .eq(filterField, filterValue);

    if (error) {
      console.error("Database error:", error);
      toast.error("Error fetching tasks from database.");
      setLoading(false);
      return;
    }

    if (!tasks || tasks.length === 0) {
      toast.error("No tasks found. Add tasks before planning.");
      setLoading(false);
      return;
    }

    const prompt = `
    You are an academic study planner. Based on the following tasks, generate a ${range}-based schedule:
    ${tasks.map((t) => `- ${t.title || t.content || t.description} (due: ${t.deadline || 'No deadline'})`).join("\n")}
    Include time blocks, priorities, and motivational tips. don't add text column or rows such as | - or any
    special characters upon generation to make the output more readable put some spaces before and after the sentence.
    `;

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        body: JSON.stringify({ prompt }),
        headers: { "Content-Type": "application/json" },
      });
      
      if (!res.ok) {
        throw new Error(`API request failed with status ${res.status}`);
      }

      const result = await res.json();

      if (result.plan) {
        setAiPlan(result.plan);
        toast.success("Study plan generated successfully!");
        
        // Automatically open AddTaskModal with AI plan content
        if (openAddTaskWithAIPlan) {
          const planTitle = `IskolarSpace Generated ${range.charAt(0).toUpperCase() + range.slice(1)} Study Plan`;
          openAddTaskWithAIPlan(planTitle, result.plan);
        }
      } else if (result.error) {
        toast.error(`API Error: ${result.error}`);
      } else {
        setAiPlan("Test plan - API returned but no plan field found");
        toast.error("No plan received from AI.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to generate plan.");
    } finally {
      setLoading(false);
    }
  };

  return {
    content,
    isLoading,
    setContent,
    setIsLoading,
    handleBackdropClick,
    handleClose,
    selectedType,
    handleTypeClick,
    showModal,
    setShowModal,
    aiPlan,
    setAiPlan,
    loading,
    handlePlan,
    setSelectedType,
  }
}

export default useStudyPlanner
