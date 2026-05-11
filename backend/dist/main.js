"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const socket_1 = require("./socket");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    app.enableCors({
        origin: [
            process.env.CLIENT_URL || 'http://localhost:5173',
            'http://localhost:3001',
        ],
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
    }));
    const port = process.env.BACKEND_PORT || process.env.PORT || 3001;
    (0, socket_1.initializeSocket)(app.getHttpServer());
    await app.listen(port);
}
void bootstrap();
//# sourceMappingURL=main.js.map