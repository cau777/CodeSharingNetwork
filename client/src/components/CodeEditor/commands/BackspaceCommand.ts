import {CodeEditorCommand} from "./CodeEditorCommand";
import {CodeEditorOptions} from "../CodeEditorOptions";
import React from "react";
import {regexTestRange} from "../../../utils/StringUtils";

export class BackspaceCommand extends CodeEditorCommand {
    constructor() {
        super(true, true);
    }
    
    public canExecute(alt: boolean, ctrl: boolean, shift: boolean, key: string): boolean {
        return !alt && !ctrl && !shift && key === "Backspace";
    }
    
    protected performAction(component: React.Component, e: React.KeyboardEvent<HTMLTextAreaElement>, options: CodeEditorOptions): void {
        let target = e.currentTarget;
        if (target.selectionStart === target.selectionEnd) {
            if (regexTestRange(target.value, new RegExp(options.indentation + "$"), 0, target.selectionStart)) {
                target.selectionStart = Math.max(0, target.selectionStart - options.indentation.length);
            }
            else
                target.selectionStart = Math.max(0, target.selectionStart - 1);
        }
        
        this.insertValue(target, "");
    }
}