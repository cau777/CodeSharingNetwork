import {CodeEditorCommand} from "./CodeEditorCommand";
import React from "react";
import {CodeEditorOptions} from "../CodeEditorOptions";

export default class SelectAllCommand extends CodeEditorCommand {
    constructor() {
        super(true, false);
    }
    
    public canExecute(alt: boolean, ctrl: boolean, shift: boolean, key: string): boolean {
        return !alt && ctrl && !shift && key === "a";
    }
    
    protected performAction(component: React.Component, e: React.KeyboardEvent<HTMLTextAreaElement>, options: CodeEditorOptions): void {
        let target = e.currentTarget;
        target.selectionStart = 0;
        target.selectionEnd = target.value.length;
    }
}
