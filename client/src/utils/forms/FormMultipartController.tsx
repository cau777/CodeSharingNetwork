import {AxiosResponse} from "axios";
import api from "../api";
import {IFormEvent} from "./IFormEvent";
import {ISubmittable} from "./ISubmittable";

/**
 * @summary Utility class to work with forms and send data encoded as forms
 */
export class FormMultipartController<TResponse> implements ISubmittable {
    public readonly values: FormData;
    private readonly url: string;
    private readonly method: "get" | "post";
    
    private readonly onStart: (() => void) | undefined;
    private readonly onFulfilled: ((response: AxiosResponse<TResponse>) => void) | undefined;
    private readonly onRejected: ((reason: any) => void) | undefined;
    
    /**
     * @param url
     * @param method
     * @param onStart Triggered when the controller starts sending the value to the api
     * @param onFulfilled Triggered if the api responded with success
     * @param onRejected Triggered if the api responded with failure
     */
    public constructor(url: string, method: "get" | "post",
                       onStart: (() => void) | undefined = undefined,
                       onFulfilled: ((response: AxiosResponse<TResponse>) => void) | undefined = undefined,
                       onRejected: ((reason: any) => void) | undefined = (reason => alert(reason))) {
        
        this.values = new FormData();
        this.url = url;
        this.method = method;
        
        this.onStart = onStart;
        this.onFulfilled = onFulfilled;
        this.onRejected = onRejected;
        
        this.submit = this.submit.bind(this);
        this.inputChange = this.inputChange.bind(this);
    }
    
    /**
     * @summary Sends the values to the api
     */
    public submit() {
        this.onStart?.();
        
        let promise = this.method === "get" ?
            api.get<TResponse>(this.url, {
                params: this.values,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            :
            api.post<TResponse>(this.url, this.values, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        
        promise.then(this.onFulfilled, this.onRejected);
    }
    
    /**
     * @summary Should be triggered when the form element has its value changed
     * @param event
     */
    public inputChange(event: IFormEvent<any>) {
        const target = event.currentTarget;
        this.values.set(target.name, target.value);
    }
}