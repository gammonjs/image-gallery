import { IServer } from "./server";

export const Application = async (server: IServer) => {
    server.connect();
    server.route();
    server.run();
};
