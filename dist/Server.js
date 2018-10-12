"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const App_1 = require("./App");
const PORT = process.env.PORT || 3000;
App_1.default.listen(PORT, () => console.log(`Server up on port: ${PORT}`));
//# sourceMappingURL=Server.js.map