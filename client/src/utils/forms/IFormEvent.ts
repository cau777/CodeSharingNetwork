import {ITarget} from "./ITarget";

export interface IFormEvent<TValue> {
    currentTarget: ITarget<TValue>;
}
