import { IServer } from "./server";

export const Application = async (server: IServer) => {
    const connected = await server.connect()
    if(connected) {
        server.route();
        server.run();
    }
};
