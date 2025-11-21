import React, { useEffect, useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CalendarDays, 
  CheckCircle, 
  Circle, 
  FileText,
  Plus 
} from "lucide-react";
import "./App.css";
import InputTodo from "./components/InputTodo";
import ListTodos from "./components/ListTodo";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "./components/ui/button";

function App() {
  const [todos, setTodos] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    progress: 0
  });

  // Calculate stats based on todos
  const updateStats = () => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const progress = total > 0 ? (completed / total) * 100 : 0;
    
    setStats({
      total,
      completed,
      progress: Math.round(progress)
    });
  };

  // Fetch todos ONCE when the app loads
  useEffect(() => {
    const fetchTodos = async () => {
      const API_URL = import.meta.env.VITE_API_URL;
      try {
        const res = await fetch(`${API_URL}/todos`);
        const data = await res.json();
        setTodos(data);
      } catch (err) {
        console.error("Error fetching todos:", err.message);
      }
    };

    fetchTodos();
  }, []);

  // Update stats whenever todos change
  useEffect(() => {
    updateStats();
  }, [todos]);

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      
      {/* Hero Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                QuickNote
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your tasks efficiently and stay organized
              </p>
            </div>
            <Badge variant="secondary" className="text-sm">
              <FileText className="w-4 h-4 mr-1" />
              {stats.total} tasks
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 mb-8">
          {/* Total Tasks Card */}
          <Card className="bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Total Tasks</CardTitle>
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {stats.total}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                All tasks across your workspace
              </p>
            </CardContent>
          </Card>

          {/* Days Streak Card */}
          <Card className="bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Active Days</CardTitle>
                <CalendarDays className="h-6 w-6 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                7
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Consecutive days of productivity
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Section */}
        <Card className="mb-8 bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Task
            </CardTitle>
            <CardDescription>
              Create a new task to get started or add to your list
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InputTodo todos={todos} setTodos={setTodos} />
          </CardContent>
        </Card>

        {/* Tasks List Section */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Your Tasks
              <Badge variant="outline" className="text-sm">
                {stats.total > 0 ? `${stats.total} total` : "No tasks"}
              </Badge>
            </CardTitle>
            <CardDescription>
              All your tasks organized in one place
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ListTodos todos={todos} setTodos={setTodos} />
          </CardContent>
        </Card>

        {/* Empty State */}
        {todos.length === 0 && (
          <Card className="bg-card mt-8">
            <CardContent className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No tasks yet</h3>
              <p className="text-muted-foreground mb-4">
                Your workspace is empty. Start by adding your first task above.
              </p>
              <Button variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Create first task
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default App;
