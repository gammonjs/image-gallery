import 'reflect-metadata';
import { Container } from 'typedi';
import Server, { IServer } from './adapters/server';

export const Run = async () => {
    const server = Container.get<IServer>(Server);

    server.connect();
    server.route();
    server.run();
};

Run();
