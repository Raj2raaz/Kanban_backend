export default (io) => {
    io.on("connection", (socket) => {
      const userId = socket.handshake.query.userId || socket.id;
      console.log(`New client connected with ID: ${userId}`);
  
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
  