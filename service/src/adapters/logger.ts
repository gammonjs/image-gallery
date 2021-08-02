import { Service } from "typedi";

@Service()
class LoggerAdapter {
    trace = (value: any): void => console.trace(value)
    info = (value: any): void => console.info(value)
    error = (value: any): void => console.error(value)
}

export default LoggerAdapter;
