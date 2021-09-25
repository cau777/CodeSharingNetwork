import {CodeEditorCommand} from "./commands/CodeEditorCommand";
import React from "react";
import {CodeEditorOptions} from "./CodeEditorOptions";
import {CodeEditorState} from "./CodeEditorState";

export class CommandExecutor {
    private readonly onExecute: () => void;
    private readonly history: CodeEditorState[];
    private readonly target: HTMLTextAreaElement;
    private undoneHistory: CodeEditorState[];
    
    public constructor(target: HTMLTextAreaElement, onExecute: ()=>void,) {
        this.target = target;
        this.onExecute = onExecute;
        this.history = [new CodeEditorState()];
        this.undoneHistory = [];
    }
    
    public async execute(command: CodeEditorCommand, e: React.KeyboardEvent<HTMLTextAreaElement>, options: CodeEditorOptions) {
        e.preventDefault();
        this.undoneHistory = [];
        
        await command.performAction(e.currentTarget, e, options);
        this.saveState();
        
        this.onExecute();
    }
    
    public async undo() {
        console.log(this.history)
        if (this.history.length !== 1) {
            let prev = this.history.pop();
            if (prev)
                this.undoneHistory.push(prev);
        }
        
        let last = this.lastState();
        last.applyState(this.target);
        this.onExecute();
    }
    
    public async redo() {
        let action = this.undoneHistory.pop();
        if (action === undefined) return;
        
        action.applyState(this.target);
        this.onExecute();
        
        this.history.push(action);
    }
    
    public saveState() {
        let last = this.lastState();
        if (!last.equalState(this.target))
            this.history.push(new CodeEditorState(last, this.target));
        
    }
    
    private lastState() {
        return this.history[this.history.length - 1];
    }
}