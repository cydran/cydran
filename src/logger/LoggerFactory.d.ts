import Logger from './Logger';
declare class LoggerFactory {
    static getLogger(name: string): Logger;
}
export default LoggerFactory;
