import {CodeEditorCommand} from "./CodeEditorCommand";
import React from "react";
import {CodeEditorOptions} from "../CodeEditorOptions";

export class DeleteCommand extends CodeEditorCommand{
    constructor() {
        super(true, true);
    }
    
    public canExecute(alt: boolean, ctrl: boolean, shift: boolean, key: string): boolean {
        return !alt && !ctrl && !shift && key === "Delete";
    }
    
    protected performAction(component: React.Component, e: React.KeyboardEvent<HTMLTextAreaElement>, options: CodeEditorOptions): void {
        let target = e.currentTarget;
        if (target.selectionStart === target.selectionEnd) {
            target.selectionEnd = Math.min(target.value.length , target.selectionEnd + 1);
        }
        
        this.insertValue(target, "");
    }
}