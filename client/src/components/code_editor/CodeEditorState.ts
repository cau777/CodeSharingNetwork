/**
 * @summary Representation of the code editor state to be used in undo and redo operations
 */
export class CodeEditorState {
    private readonly text?: string;
    private readonly selectionStart?: number;
    private readonly selectionEnd?: number;
    
    public constructor();
    public constructor(prevState: CodeEditorState, target: HTMLTextAreaElement);
    
    public constructor(prevState?: CodeEditorState, target?: HTMLTextAreaElement) {
        if (prevState && target) {
            if (target.value !== prevState.text)
                this.text = target.value;
            
            if (target.selectionStart !== prevState.selectionStart)
                this.selectionStart = target.selectionStart;
            
            if (target.selectionEnd !== prevState.selectionEnd)
                this.selectionEnd = target.selectionEnd;
        } else {
            this.text = "";
            this.selectionStart = 0;
            this.selectionEnd = 0;
        }
    }
    
    public equalState(target: HTMLTextAreaElement) {
        return this.text === target.value && this.selectionStart === target.selectionStart && this.selectionEnd === target.selectionEnd;
    }
    
    public applyState(target: HTMLTextAreaElement) {
        if (this.text !== undefined)
            target.value = this.text;
        
        if (this.selectionStart !== undefined)
            target.selectionStart = this.selectionStart;
        
        if (this.selectionEnd !== undefined)
            target.selectionEnd = this.selectionEnd;
    }
}