import axios from 'axios';
import { supabase } from '../../lib/supabaseClient';

/**
 * Attaches the current Supabase access token to every API request. The server
 * derives the caller's identity from this token; ids sent in a request body are
 * not trusted. Requests made without a session will be rejected with a 401.
 */
const authHeaders = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token
    ? { Authorization: `Bearer ${session.access_token}` }
    : {};
};

// Create a space. The creator is taken from the session server-side.
export const createSpace = async (name: string, code: string, _userId?: unknown) => {
  const res = await axios.post('/api/spaces/create', { name, code }, {
    headers: await authHeaders(),
  });
  return res.data;
};

// Join a space by code. Always enrolls the signed-in user.
export const joinSpace = async (code: string, _userId?: unknown) => {
  try {
    const res = await axios.post('/api/spaces/join', { code }, {
      headers: await authHeaders(),
    });
    return res.data;
  } catch (err: any) {
    if (err.response?.status === 409) {
      throw new Error('Already a member');
    }
    throw new Error(err.response?.data?.error || 'Failed to join space');
  }
};

// Get all spaces the signed-in user has joined.
export const getUserSpaces = async (_userId?: unknown) => {
  const res = await axios.get('/api/spaces/user-spaces', {
    headers: await authHeaders(),
  });
  return res.data.spaces;
};

// Get all members in a space
export const getSpaceMembers = async (spaceId: string) => {
  const res = await axios.get(`/api/spaces/members?spaceId=${spaceId}`, {
    headers: await authHeaders(),
  });
  return res.data.members;
};

// Get all tasks in a space. Each task carries an `assignees: string[]`.
export const getTasks = async (spaceId: string) => {
  const res = await axios.get(`/api/spaces/tasks?spaceId=${spaceId}`, {
    headers: await authHeaders(),
  });
  return res.data.tasks;
};

// Create a task in a space. Pass `assignees` as an array of user ids.
export const createTask = async (spaceId: string, task: any) => {
  const res = await axios.post(`/api/spaces/tasks?spaceId=${spaceId}`, task, {
    headers: await authHeaders(),
  });
  return res.data.task;
};

// Update a task in a space. Omit `assignees` to leave assignments untouched.
export const updateTask = async (spaceId: string, task: any) => {
  const res = await axios.put(`/api/spaces/tasks?spaceId=${spaceId}`, task, {
    headers: await authHeaders(),
  });
  return res.data.task;
};

// Delete one or many tasks in a space
export const deleteTask = async (spaceId: string, id: string | string[]) => {
  const payload = Array.isArray(id) ? { ids: id } : { id };
  const res = await axios.delete(`/api/spaces/tasks?spaceId=${spaceId}`, {
    data: payload,
    headers: await authHeaders(),
  });
  return res.data.success;
};

// Edit space name (admin only, enforced server-side)
export const editSpaceName = async (spaceId: string, newName: string) => {
  const res = await axios.put('/api/spaces/user-spaces', { spaceId, name: newName }, {
    headers: await authHeaders(),
  });
  return res.data.space;
};

// Delete space (admin only, enforced server-side)
export const deleteSpace = async (spaceId: string) => {
  const res = await axios.delete('/api/spaces/user-spaces', {
    data: { spaceId, action: 'delete_space' },
    headers: await authHeaders(),
  });
  return res.data.success;
};

// Leave space. Always removes the signed-in user.
export const leaveSpace = async (spaceId: string, _userId?: unknown) => {
  const res = await axios.delete('/api/spaces/user-spaces', {
    data: { spaceId, action: 'leave_space' },
    headers: await authHeaders(),
  });
  return res.data.success;
};

// Make a space member admin (admin only, enforced server-side)
export const makeMemberAdmin = async (spaceId: string, memberId: string) => {
  const res = await axios.patch('/api/spaces/user-spaces', {
    spaceId,
    memberId,
    makeAdmin: true,
  }, {
    headers: await authHeaders(),
  });
  return res.data.success;
};