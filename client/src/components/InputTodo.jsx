import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const InputTodo = ({ todos, setTodos }) => {
  const [description, setDescription] = useState("");

  const onSubmitForm = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!description.trim()) {
      toast.error("Please add a task");
      return;
    }

    const API_URL = import.meta.env.VITE_API_URL;

    try {
      const body = { description };
      const response = await fetch(`${API_URL}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        return toast.error(data.error || "Failed to add task");
      }

      setTodos((prev) => [...prev, data]);
      toast.success("Task added successfully.");
      setDescription(""); // Clear input after successful submission
    } catch (error) {
      console.error(error.message);
      toast.error("Failed to add task.");
    }
  };

  return (
    <div className="container mx-auto max-w-3xl space-y-6 mr-5 -mt-16 pt-3">
      {/* <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800">QuickNote</h1>
      </div> */}
      
      <form onSubmit={onSubmitForm} className="flex gap-4">
        <Input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter your task..."
          className="flex-1"
        />
        <Button type="submit" disabled={!description.trim()}>
          Add Task
        </Button>
      </form>
    </div>
  );
};

export default InputTodo;

