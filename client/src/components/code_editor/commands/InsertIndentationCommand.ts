import {CodeEditorCommand} from "./CodeEditorCommand";
import {CodeEditorOptions} from "../CodeEditorOptions";
import React from "react";

export default class InsertIndentationCommand extends CodeEditorCommand{
    
    public canExecute(alt: boolean, ctrl: boolean, shift: boolean, key: string): boolean {
        return !alt && !ctrl && !shift && key === "Tab";
    }
    
    public async performAction(target: HTMLTextAreaElement, e: React.KeyboardEvent<HTMLTextAreaElement>, options: CodeEditorOptions): Promise<void> {
        this.insertValue(e.currentTarget, options.indentation);
    }
}