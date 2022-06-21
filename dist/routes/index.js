"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userRouter_1 = __importDefault(require("./userRouter"));
/* GET home page. */
function default_1(app) {
    app.get('/', (req, res) => {
        res.send('API Homepage');
    });
    app.use('/users', userRouter_1.default);
}
exports.default = default_1;
