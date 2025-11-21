import React, { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Input } from "./ui/input";

const EditTodo = ({ todo, todos, setTodos }) => {
  const [description, setDescription] = useState(todo.description);

  const updateTodo = async () => {
    if (!description.trim()) {
      toast.error("Description cannot be empty");
      return;
    }

    const API_URL = import.meta.env.VITE_API_URL;

    try {
      const body = { description };
      const response = await fetch(
        `${API_URL}/todos/${todo.todo_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) throw new Error("Failed to update");

      // Real-time UI update
      const updatedList = todos.map((item) =>
        item.todo_id === todo.todo_id ? { ...item, description } : item
      );

      setTodos(updatedList);
      toast.success("Todo updated successfully!");
    } catch (err) {
      console.error("Error updating todo:", err);
      toast.error("Failed to update todo");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="btn btn-warning cursor-pointer">Edit</button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Todo</AlertDialogTitle>
          <AlertDialogDescription>
            Update your task description below.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Input
          type="text"
          className="form-control my-3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={updateTodo}>
            Save Changes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EditTodo;
