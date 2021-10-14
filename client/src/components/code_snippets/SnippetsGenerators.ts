import {copyDate, minDate, subtractDays} from "../../utils/DateUtils";
import api from "../../utils/api";

async function* generateSnippetsByDay() {
    // Loops until it gets snippets or 204 No Content (to show that there are no more snippets)
    let dateCreated = new Date();
    let end = copyDate(dateCreated);
    end.setHours(23);
    end.setMinutes(59);
    end.setSeconds(59);
    end.setMilliseconds(999);
    
    let start = copyDate(dateCreated);
    start.setHours(0);
    start.setMinutes(0);
    start.setSeconds(0);
    start.setMilliseconds(0);
    
    while (true) {
        let response = await api.get<number[]>("snippets/recommended/", {
            params: {
                start: start,
                end: minDate(end, dateCreated)
            }
        });
        
        if (response.status === 200) {
            let emptyResponse = response.data.length === 0;
            
            if (!emptyResponse) {
                yield response.data;
            }
            
            subtractDays(start, 1);
            subtractDays(end, 1);
        } else {
            if (response.status !== 204)
                console.log(response);
            break;
        }
    }
}

export {generateSnippetsByDay}