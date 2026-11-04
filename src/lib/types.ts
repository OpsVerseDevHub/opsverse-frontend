export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  status: string;
  owner_id?: number;
  created_at?: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: string;
  priority: string;
  assignee_id?: number;
  project_id: number;
  due_date?: string;
  github_issue_id?: number;
  commit_hash?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TaskCreate {
  title: string;
  description?: string;
  assignee_id?: number;
  project_id: number;
  status?: string;
  priority?: string;
  due_date?: string;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  assignee_id?: number;
  project_id?: number;
  status?: string;
  priority?: string;
  due_date?: string;
}

export interface SlackMessage {
  id: string;
  user_id: string;
  channel_id: string;
  text: string;
  timestamp: string;
  received_at?: string;
  project_id?: number;
  thread_ts?: string;
}

export interface SlackMapping {
  id: number;
  project_id: number;
  slack_channel_id: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}
