import {AxiosResponse} from "axios";
import api from "../api";
import {FormController} from "./FormController";

class FormBodyController<TResponse> extends FormController<TResponse> {
    public constructor(url: string, method: "get" | "post",
                       onStart?: () => void,
                       onFulfilled?: (response: AxiosResponse<TResponse>) => void,
                       onRejected?: (reason: any) => void) {
        super(new Map<string, any>(), url, method, onStart, onFulfilled, onRejected);
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
    
}

export {FormBodyController};