import 'reflect-metadata';
import { Container } from 'typedi';
import Application, { IApplication } from './adapters/express';

const Run = async () => {

    const application = Container.get<IApplication>(Application)

    application.connect();
    application.route();
    application.run();
}

Run();

