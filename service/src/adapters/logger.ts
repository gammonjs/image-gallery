import { Service } from 'typedi';
import { ILogger } from '../contracts';

@Service()
class ConsoleLoggerAdapter implements ILogger {
    trace = (value: any): void => console.trace(value);
    info = (value: any): void => console.info(value);
    error = (value: any): void => console.error(value);
}

export default ConsoleLoggerAdapter;
