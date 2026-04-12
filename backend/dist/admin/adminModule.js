"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const adminController_1 = require("./adminController");
const userModule_1 = require("../users/userModule");
const gameModule_1 = require("../games/gameModule");
const categoryModule_1 = require("../categories/categoryModule");
const platformModule_1 = require("../platforms/platformModule");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [userModule_1.UsersModule, gameModule_1.GameModule, categoryModule_1.CategoryModule, platformModule_1.PlatformModule],
        controllers: [adminController_1.AdminController],
    })
], AdminModule);
//# sourceMappingURL=adminModule.js.map