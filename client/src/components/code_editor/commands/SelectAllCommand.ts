import {CodeEditorCommand} from "./CodeEditorCommand";
import React from "react";
import {LanguageOptions} from "../languages/LanguageOptions";

export default class SelectAllCommand extends CodeEditorCommand {
    public canExecute(alt: boolean, ctrl: boolean, shift: boolean, key: string): boolean {
        return !alt && ctrl && !shift && key === "a";
    }
    
    public async performAction(target: HTMLTextAreaElement, e: React.KeyboardEvent<HTMLTextAreaElement>, options: LanguageOptions) {
        target.selectionStart = 0;
        target.selectionEnd = target.value.length;
    }
}
