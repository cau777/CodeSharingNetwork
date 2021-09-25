import {CodeEditorCommand} from "./CodeEditorCommand";
import React from "react";
import {CodeEditorOptions} from "../CodeEditorOptions";

export class DeleteCommand extends CodeEditorCommand{
    public canExecute(alt: boolean, ctrl: boolean, shift: boolean, key: string): boolean {
        return !alt && !ctrl && !shift && key === "Delete";
    }
    
    public async performAction(target: HTMLTextAreaElement, e: React.KeyboardEvent<HTMLTextAreaElement>, options: CodeEditorOptions): Promise<void> {
        if (target.selectionStart === target.selectionEnd) {
            target.selectionEnd = Math.min(target.value.length , target.selectionEnd + 1);
        }
        
        this.insertValue(target, "");
    }
}