import { Service } from 'typedi';

export interface ILogger {
    trace(value: any): void;
    info(value: any): void;
    error(value: any): void;
}

@Service()
class LoggerAdapter implements ILogger {
    trace = (value: any): void => console.trace(value);
    info = (value: any): void => console.info(value);
    error = (value: any): void => console.error(value);
}

export default LoggerAdapter;
