import {AxiosResponse} from "axios";
import {ISubmittable} from "./ISubmittable";
import api from "../api";
import {IFormEvent} from "./IFormEvent";

/**
 * @summary Utility class to work with forms
 */
class FormController<TResponse> implements ISubmittable {
    public readonly values: Map<string, any>;
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
        
        this.values = new Map<string, any>();
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
        
        let requestData = Object.fromEntries(this.values);
        
        let promise = this.method === "get" ?
            api.get<TResponse>(this.url, {params: requestData}) :
            api.post<TResponse>(this.url, requestData);
        
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

export {FormController};