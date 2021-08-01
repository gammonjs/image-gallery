import 'reflect-metadata';
import { Container } from 'typedi';
import Server from './server';
import { Application } from './app';

Application(Container.get(Server));
