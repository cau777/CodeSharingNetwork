export interface IFormEvent<TValue> {
    currentTarget: {
        name: string;
        value: TValue;
    };
}
