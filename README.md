# 🌌 IskolarSpace: AI Powered Task Management Application for Students  

## 🚀 Overview  
IskolarSpace is a **Next.js-powered** productivity platform designed for students to efficiently **manage their academic tasks**. It provides a structured way to **plan, prioritize, and collaborate** daily workloads, ensuring students stay on top of their academic progress.

## 🎯 Purpose  
To give students a **seamless way** to write down and manage tasks, creating an **organized plan** for daily academic activities.

## 🎓 Target Users  
- **Students** at any level looking for better task organization  
- Learners who need **a clear workflow** to improve study habits  
- Anyone seeking **a structured academic progress tracker**  

## ✨ Features  
- ✅ **Create progress tasks** for assignments, studies, and projects  
- 🔍 **View ongoing tasks** in an intuitive interface  
- 📝 **Edit tasks** to update priorities and deadlines with drag and drop features
- ❌ **Remove completed or irrelevant tasks** for a cleaner workspace  
- ⏰ **Set Deadlines** on task and todos of your workspace
- 📊 **Kanban Board** for visual task management and workflow tracking
- 👥 **Assign a task to multiple members** so group work has clear shared ownership
- 🗑 **Select and delete tasks in bulk** to clear finished work in one action
- 🤖 **AI Study Planner** powered by Google Gemini API for intelligent task scheduling
- 🛰 **Daily motivational quotes** to boost engagement  
- 🌌 **Create and Join Space** to collaborate with other students workspace 
- 📖 **Share your notes to the Universe** gives you way to say your thoughts outloud in space!
- 🔐 **Role-based space permissions** keeping admin actions with space admins
- 🗂 Kanban Board Functionality

IskolarSpace includes a **Kanban Board** to help students visually organize and track their tasks through different stages of completion:

### 🟩 Key Kanban Features:
- **Drag-and-drop task movement** between columns (e.g., To Do, In Progress, Done)
- **Column-based workflow** for clear progress tracking
- **Task prioritization** and easy status updates
- **Visual overview** of all tasks and their current state
- **Multi-select mode** for acting on several tasks at once
- **Collaborative updates** in shared spaces for group projects

### 🔧 How It Works:
1. **View tasks in Kanban columns** representing different workflow stages
2. **Drag tasks** to update their status and progress
3. **Instant updates** for all collaborators in the space
4. **Seamless integration** with AI Study Planner and other productivity features

## 👥 Multi-Assignee Tasks
Group projects rarely belong to one person, so a task in a shared space can be assigned to **any number of members** rather than just one.

### ✨ Key Features:
- 🤝 **Assign several members** to a single task from one dropdown
- 🏷 **Chips for each assignee**, removable with a click
- 👀 **At-a-glance ownership** on Kanban cards, showing the first two names and a `+N` badge when more are assigned
- 📧 **Email notifications** sent to everyone newly added to a task
- 🔒 **Space-scoped** so only members of that space can be assigned

### 🔧 How It Works:
1. **Open a task** in the add or edit modal
2. **Pick one or more members** from the assignee dropdown
3. **Everyone newly assigned is notified** by email
4. **Assignments stay put** when a card is dragged between columns

## 🗑 Bulk Task Actions
Clearing finished work no longer means deleting tasks one at a time.

### 🔧 How It Works:
1. **Enter selection mode** on the Kanban board
2. **Tick the tasks** you want to remove
3. **Confirm once** to delete the whole selection

## 🔐 Spaces, Roles, and Access
Spaces are collaborative, so who can do what is enforced on the **server**, not just hidden in the interface.

### ✨ Key Features:
- 👑 **Admin and member roles** per space
- 🛡 **Admin-only actions** covering renaming a space, deleting it, removing members, and changing roles
- 🚪 **Members can leave** a space at any time
- 🔑 **Every request is authenticated**, and each one is checked against your membership of the space it targets
- 🧭 **Tasks stay inside their space** and are only readable by that space's members
- ⚠️ **Last admin protected** so a space can never be left without someone able to manage it

## 🗄 Database Setup
The app relies on Supabase **Row Level Security** policies. They are not optional: the Supabase key ships in the browser bundle, so these policies are what keep one user's data out of another user's reach.

Two SQL scripts must be applied to the database, in order:

1. `sql/01_security_hardening.sql` — enables Row Level Security and adds access policies
2. `sql/02_multi_assignee.sql` — creates the multi-assignee table and migrates existing assignments

Run them from the **Supabase Dashboard → SQL Editor**. Neither script deletes data. Take a backup first, and run the verification queries at the end of each file to confirm the result.

Required environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
GEMINI_API_KEY=
GMAIL_USER=
GMAIL_PASS=
NEXT_PUBLIC_URL=
```

## 🛠 Built With  
- **Next.js** – Fast & scalable React framework  
- **TailwindCSS** – Modern styling for UI consistency  
- **Supabase** – Database & authentication layer  
- **TypeScript** – Type-safe and scalable development  
- **Google Gemini API** – Advanced AI integration for intelligent study planning

## 🧠 AI Study Planner  
IskolarSpace features an **intelligent AI Study Planner** powered by **Google Gemini API** that helps students create optimized study schedules:

### ✨ Key AI Features:
- 📅 **Smart Schedule Generation** - Creates daily, weekly, or monthly study plans
- 🎯 **Task Analysis** - Analyzes your current tasks to suggest optimal study sequences  
- ⚡ **Instant Planning** - Generate comprehensive study plans in seconds
- 🚀 **Auto-Task Creation** - Automatically populates task creation form with AI-generated content for study planning

### 🔧 How It Works:
1. **Select Time Frame** - Choose between day, week, or month planning
2. **AI Analysis** - Gemini API analyzes your existing tasks and priorities
3. **Plan Generation** - Receives an optimized study schedule with detailed recommendations
4. **Quick Implementation** - One-click integration into your task management workflow  

## Designed and Developed by Steven Gabriel Madali EST 2025