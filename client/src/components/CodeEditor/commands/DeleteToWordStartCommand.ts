import {CodeEditorCommand} from "./CodeEditorCommand";
import {CodeEditorOptions} from "../CodeEditorOptions";
import React from "react";

export class DeleteToWordStartCommand extends CodeEditorCommand {
    constructor() {
        super(true, true);
    }
    
    public canExecute(alt: boolean, ctrl: boolean, shift: boolean, key: string): boolean {
        return !alt && ctrl && !shift && key === "Backspace";
    }
    
    protected performAction(component: React.Component, e: React.KeyboardEvent<HTMLTextAreaElement>, options: CodeEditorOptions): void {
        let target = e.currentTarget;
        
        if (target.selectionStart === target.selectionEnd) {
            let sub = target.value.substring(0, target.selectionEnd);
            let lineStartIndex = target.selectionStart - (sub.match(/\n *$/) ?? [" "])[0].length + 1;
            let wordStartIndex = target.selectionStart - (sub.match(/\w+ *$/) ?? [" "])[0].length;
            target.selectionStart = Math.max(0, Math.min(lineStartIndex, wordStartIndex));
        }
        
        this.insertValue(target, "");
    }
}