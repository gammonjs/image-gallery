import 'reflect-metadata';
import { Container } from 'typedi';
import Server, { IServer } from './adapters/express';

const Run = async () => {
    const application = Container.get<IServer>(Server);

    application.connect();
    application.route();
    application.run();
};

Run();
