import axios from 'axios';

// Create a space
export const createSpace = async (name: string, code: string, userId: number) => {
  const res = await axios.post('/api/spaces/create', { name, code, userId });
  return res.data;
};

// Join a space
export const joinSpace = async (code: string, userId: number) => {
  try {
    const res = await axios.post('/api/spaces/join', { code, userId });
    return res.data;
  } catch (err: any) {
    if (err.response?.status === 409) {
      throw new Error('Already a member');
    }
    throw new Error(err.response?.data?.error || 'Failed to join space');
  }
};

// Get all spaces the user has joined
export const getUserSpaces = async (userId: number) => {
  const res = await axios.get(`/api/spaces/user-spaces?userId=${userId}`);
  return res.data.spaces;
};

// Get all members in a space
export const getSpaceMembers = async (spaceId: string) => {
  const res = await axios.get(`/api/spaces/members?spaceId=${spaceId}`);
  return res.data.members;
};

// Get all tasks in a space
export const getTasks = async (spaceId: string) => {
  const res = await axios.get(`/api/spaces/tasks?spaceId=${spaceId}`);
  return res.data.tasks;
};

// Create a task in a space
export const createTask = async (spaceId: string, task: any) => {
  const res = await axios.post(`/api/spaces/tasks?spaceId=${spaceId}`, task);
  return res.data.task;
};

// Update a task in a space
export const updateTask = async (spaceId: string, task: any) => {
  const res = await axios.put(`/api/spaces/tasks?spaceId=${spaceId}`, task);
  return res.data.task;
};

// Delete a task in a space
export const deleteTask = async (spaceId: string, id: string) => {
  const res = await axios.delete(`/api/spaces/tasks?spaceId=${spaceId}`, { data: { id } });
  return res.data.success;
};