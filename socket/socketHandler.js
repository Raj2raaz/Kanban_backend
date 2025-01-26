export default (io) => {
  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId || socket.id;
    // console.log(`New client connected with ID: ${userId}`);
    socket.on("addTask", ({ columnId, task }) => {
      // console.log(`Task added by user ${userId}:`, { columnId, task });
      io.emit("taskUpdated", { columnId, task });
    });

    // Handle task edit
    socket.on("editTask", ({ columnId, taskId, newTitle }) => {
      console.log(`Task edited by user ${userId}:`, {
        columnId,
        taskId,
        newTitle,
      });
      io.emit("taskUpdated", { columnId, taskId, newTitle });
    });

    // Handle task deletion
    socket.on("deleteTask", ({ columnId, taskId }) => {
      console.log(`Task deleted by user ${userId}:`, { columnId, taskId });
      io.emit("taskUpdated", { columnId, taskId, action: "deleted" });
    });

    // Handle task reordering or movement between columns
    socket.on("moveTask", ({ sourceColumnId, targetColumnId, task }) => {
      console.log(`Task moved by user ${userId}:`, {
        sourceColumnId,
        targetColumnId,
        task,
      });
      io.emit("taskUpdated", { sourceColumnId, targetColumnId, task });
    });

    // Handle column addition
    socket.on("addColumn", ({ column }) => {
      console.log(`Column added by user ${userId}:`, column);
      io.emit("columnUpdated", column);
    });

    // Handle column edit
    socket.on("editColumn", ({ columnId, title }) => {
      console.log(`Column edited by user ${userId}:`, { columnId, title });
      io.emit("columnUpdated", { columnId, title });
    });

    // Handle column deletion
    socket.on("deleteColumn", ({ columnId }) => {
      console.log(`Column deleted by user ${userId}:`, columnId);
      io.emit("columnUpdated", { columnId, action: "deleted" });
    });

    // Handle column reordering
    socket.on("moveColumn", ({ oldIndex, newIndex }) => {
      console.log(`Column reordered by user ${userId}:`, {
        oldIndex,
        newIndex,
      });
      io.emit("columnUpdated", { oldIndex, newIndex });
    });

    // Handle board updates
    socket.on("boardUpdated", (data) => {
      console.log(`Board updated by user ${userId}:`, data);
      io.emit("boardUpdated", data);
    });
    socket.on("taskUpdated", (data) => {
      console.log(`Task updated by user ${userId}:`, data);
      io.emit("taskUpdated", data);
    });

    socket.on("columnUpdated", (data) => {
      console.log(`Column updated by user ${userId}:`, data);
      io.emit("columnUpdated", data);
    });

    socket.on("boardUpdated", (data) => {
      console.log(`Board updated by user ${userId}:`, data);
      io.emit("boardUpdated", data);
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected with ID: ${userId}`);
    });
  });
};
