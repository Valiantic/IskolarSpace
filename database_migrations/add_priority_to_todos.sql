-- Add priority column to todos table
-- This migration adds a priority field with enum values: low, moderate, high

-- Create an enum type for priority levels
CREATE TYPE priority_level AS ENUM ('low', 'moderate', 'high');

-- Add priority column to existing todos table with default value 'low'
ALTER TABLE public.tbl_todos 
ADD COLUMN priority priority_level NOT NULL DEFAULT 'low';

-- Add an index for better query performance when filtering by priority
CREATE INDEX idx_todos_priority ON public.tbl_todos(priority);

-- Add a combined index for user_id and priority for efficient filtering
CREATE INDEX idx_todos_user_priority ON public.tbl_todos(user_id, priority);
