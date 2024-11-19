import { app } from "./src";
import { config } from "./src/config/config";

const startServer = () => {
  const { port } = config || 3000;

  app.listen(port, () => {
    console.log(`Server started at port ${port}`);
  });
};

startServer();
