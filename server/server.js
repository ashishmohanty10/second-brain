"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("./src");
const config_1 = require("./src/config/config");
const startServer = () => {
    const { port } = config_1.config || 3000;
    src_1.app.listen(port, () => {
        console.log(`Server started at port ${port}`);
    });
};
startServer();
