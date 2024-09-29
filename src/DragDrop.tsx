import React, { useEffect, useState } from "react";

interface Task {
  id: string;
  title: string;
  status: string;
}

const DragDropExample = () => {

  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };
  const [tasks, setTasks] = useState([
    { id: 1, title: "Task 1", status: "todo" },
    { id: 2, title: "Task 2", status: "todo" },
    { id: 3, title: "Task 3", status: "todo" },
  ]);
  const [dropIndicator, setDropIndicator] = useState<string | null>(null);

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    taskId: string
  ) => {
    e.dataTransfer.setData("text/plain", taskId.toString());
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.clearData();
    setDropIndicator(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, status: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");

    const task = tasks?.find((task) => +task.id === +taskId);
    const draggedTask = tasks.find((task) => task.id === parseInt(taskId, 10));

    const dropTargetKey = e.target.getAttribute("data-task-id");



    if (task) {
      task.status = status;
    }
    if (task?.status == status) {
      if (dropTargetKey) {
        const targetTaskIndex = tasks.findIndex(
          (task) => task.id === parseInt(dropTargetKey, 10)
        );
        const draggedTaskIndex = tasks.findIndex(
          (task) => task.id === draggedTask?.id
        );
        if (
          draggedTaskIndex !== -1 &&
          targetTaskIndex !== -1 &&
          draggedTaskIndex !== targetTaskIndex
        ) {
          const updatedTasks = [...tasks];
          updatedTasks[draggedTaskIndex] = tasks[targetTaskIndex];
          updatedTasks[targetTaskIndex] = tasks[draggedTaskIndex];

          setTasks(updatedTasks);
        }
      }
    }

    setDropIndicator(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDropIndicator(e.currentTarget.id);
  };

  const renderTasks = (status: string) => {
    return tasks
      ?.filter((task) => task.status === status)
      .map((task) => (
        <div
          key={task.id}
          data-task-id={task.id}
          draggable
          onDragStart={(e) => handleDragStart(e, task.id)}
          onDragEnd={handleDragEnd}
          className={`w-full p-2 bg-gray-100 rounded ${
            dropIndicator === status ? "bg-blue-200 " : ""
          }`}
        >
          {task.title}
        </div>
      ));
  };

  

  return (
    <div className="flex flex-col p-6 h-screen dark:bg-gray-900 py-10">
      <div className="grid grid-cols-3 gap-2 ">
        <h2 className="text-center dark:text-white">Todo</h2>
        <h2 className="text-center dark:text-white">In Progress</h2>
        <h2 className="text-center dark:text-white">Done</h2>

        <div
          id="todo"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "todo")}
          className={`flex flex-col items-center justify-start w-full border-2 border-dashed p-0.5 gap-1 rounded ${
            dropIndicator === "todo" ? "bg-blue-100 " : ""
          }`}
        >
          {renderTasks("todo")}
        </div>

        <div
          id="in-progress"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "in-progress")}
          className={`flex flex-col items-center justify-start w-full border-2 border-dashed p-0.5 gap-1 rounded ${
            dropIndicator === "in-progress" ? "bg-red-400 " : ""
          }`}
        >
          {renderTasks("in-progress")}
        </div>

        <div
          id="done"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "done")}
          className={`flex flex-col items-center justify-start w-full border-2 border-dashed p-0.5 gap-1 rounded ${
            dropIndicator === "done" ? "bg-green-300 " : ""
          }`}
        >
          {renderTasks("done")}
        </div>

       
      </div>
      <div
          className="draggable"
          style={{
            position: "absolute",
            left: `${position.x}px`,
            top: `${position.y}px`,
            cursor: dragging ? "grabbing" : "grab",
            background:'red'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          Drag me around
        </div>
    </div>
  );
};

export default DragDropExample;
