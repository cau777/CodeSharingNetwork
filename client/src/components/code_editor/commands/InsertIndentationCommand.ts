import {CodeEditorCommand} from "./CodeEditorCommand";
import {LanguageOptions} from "../languages/LanguageOptions";
import React from "react";

export default class InsertIndentationCommand extends CodeEditorCommand{
    
    public canExecute(alt: boolean, ctrl: boolean, shift: boolean, key: string): boolean {
        return !alt && !ctrl && !shift && key === "Tab";
    }
    
    public async performAction(target: HTMLTextAreaElement, e: React.KeyboardEvent<HTMLTextAreaElement>, options: LanguageOptions): Promise<void> {
        this.insertValue(e.currentTarget, options.tab);
    }
}