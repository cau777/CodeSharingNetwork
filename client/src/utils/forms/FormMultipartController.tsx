import {AxiosResponse} from "axios";
import api from "../api";
import {FormController} from "./FormController";

export class FormMultipartController<TResponse> extends FormController<TResponse> {
    public constructor(url: string, method: "get" | "post",
                       onStart?: () => void,
                       onFulfilled?: (response: AxiosResponse<TResponse>) => void,
                       onRejected?: (reason: any) => void) {
        super(new FormData(), url, method, onStart, onFulfilled, onRejected);
    }
    
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
}