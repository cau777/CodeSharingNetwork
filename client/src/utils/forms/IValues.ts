export interface IValues extends Iterable<[string, any]> {
    get(key: string): any;
    
    set(key: string, value: any): void;
}