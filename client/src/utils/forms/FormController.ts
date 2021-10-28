import {AxiosResponse} from "axios";
import {IValues} from "./IValues";
import {IFormEvent} from "./IFormEvent";
import {ISubmittable} from "./ISubmittable";

/**
 * @summary Utility class to work with forms and send data in the body of requests
 */
export abstract class FormController<TResponse> implements ISubmittable {
    public readonly values: IValues;
    protected readonly url: string;
    protected readonly method: "get" | "post";
    
    protected readonly onStart?: () => void;
    protected readonly onFulfilled?: (response: AxiosResponse<TResponse>) => void;
    protected readonly onRejected?: (reason: any) => void;
    
    /**
     * @param values
     * @param url
     * @param method
     * @param onStart Triggered when the controller starts sending the value to the api
     * @param onFulfilled Triggered if the api responded with success
     * @param onRejected Triggered if the api responded with failure
     */
    protected constructor(values: IValues, url: string, method: "get" | "post",
                          onStart?: () => void,
                          onFulfilled?: (response: AxiosResponse<TResponse>) => void,
                          onRejected?: (reason: any) => void) {
        this.values = values;
        this.url = url;
        this.method = method;
        
        this.onStart = onStart;
        this.onFulfilled = onFulfilled;
        this.onRejected = onRejected ?? (reason => alert(reason));
    
        this.submit = this.submit.bind(this);
        this.inputChange = this.inputChange.bind(this);
    }
    
    /**
     * @summary Sends the values to the api
     */
    public abstract submit(): void;
    
    /**
     * @summary Should be triggered when the form element has its value changed
     * @param event
     */
    public inputChange(event: IFormEvent<any>) {
        const target = event.currentTarget;
        this.values.set(target.name, target.value);
    }
    
    /**
     * @summary Used to manually set a value
     * @param key
     * @param value
     */
    public setValue(key: string, value: any) {
        this.values.set(key, value);
    }
}