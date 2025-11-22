import React, { useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import EditTodo from "./EditTodo";

const ListTodos = ({ todos, setTodos }) => {
  // Delete todo function
  const deleteTodo = async (id) => {
    const API_URL = import.meta.env.VITE_API_URL;
    try {
      await fetch(`${API_URL}/todos/${id}`, {
        method: "DELETE",
      });
      setTodos(todos.filter((todo) => todo.todo_id !== id));
      toast.success("Task deleted successfully.");
    } catch (err) {
      console.error(err.message);
      toast.error("Failed to delete task.");
    }
  };

  useEffect(() => {
    const handleTodoUpdate = () => {
      // This would trigger a refetch if needed
      // For now, EditTodo dispatches a custom event that ListTodos can listen to
    };

    window.addEventListener("todoUpdated", handleTodoUpdate);
    return () => {
      window.removeEventListener("todoUpdated", handleTodoUpdate);
    };
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Edit</TableHead>
              <TableHead>Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {todos.map((todo) => (
              <TableRow key={todo.todo_id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{todo.description}</TableCell>
                <TableCell>
                  <EditTodo todo={todo} todos={todos} setTodos={setTodos} />

                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteTodo(todo.todo_id)}
                    className="h-8 px-3"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {todos.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No tasks yet. Add one above!
        </div>
      )}
    </div>
  );
};

export default ListTodos;
