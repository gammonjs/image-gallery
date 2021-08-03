import 'reflect-metadata';
import { Container } from 'typedi';
import Server from './server';
import { Application } from './application';

Application(Container.get(Server));
