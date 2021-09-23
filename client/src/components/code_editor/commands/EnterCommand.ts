import {CodeEditorCommand} from "./CodeEditorCommand";
import React from "react";
import {regexTestRange} from "../../../utils/StringUtils";
import {CodeEditorOptions} from "../CodeEditorOptions";

export class EnterCommand extends CodeEditorCommand {
    public constructor() {
        super(true);
    }
    
    public canExecute(alt: boolean, ctrl: boolean, shift: boolean, key: string): boolean {
        return key === "Enter";
    }
    
    protected performAction(component: React.Component, e: React.KeyboardEvent<HTMLTextAreaElement>, options: CodeEditorOptions): void {
        let target = e.currentTarget;
        
        // If there is ] ) or } right after the cursor, send this character to the next line
        if (regexTestRange(target.value, /^ *[})\]]/, target.selectionEnd)) {
            let level = super.calcIndentationLevel(target);
            let firstPart = "\n" + this.generateIndentation(level, options);
            let secondPart = "\n" + this.generateIndentation(level - 1, options);
            this.insertValue(target, firstPart);
            this.insertValue(target, secondPart);
            target.selectionStart -= secondPart.length;
            target.selectionEnd = target.selectionStart;
        } else {
            let indentation = this.generateIndentation(this.calcIndentationLevel(target), options);
            this.insertValue(target, "\n" + indentation);
        }
        
        if (target.scrollHeight !== 0) {
            target.scrollBy(0, 23);
        }
    }
}