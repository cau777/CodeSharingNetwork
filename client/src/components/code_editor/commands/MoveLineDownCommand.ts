import {CodeEditorCommand} from "./CodeEditorCommand";
import React from "react";
import {CodeEditorOptions} from "../CodeEditorOptions";
import {find, findReversed} from "../../../utils/StringUtils";

export class MoveLineDownCommand extends CodeEditorCommand {
    public canExecute(alt: boolean, ctrl: boolean, shift: boolean, key: string): boolean {
        return alt && !ctrl && !shift && key === "ArrowDown";
    }
    
    public async performAction(target: HTMLTextAreaElement, e: React.KeyboardEvent<HTMLTextAreaElement>, options: CodeEditorOptions): Promise<void> {
        this.saveStateBefore();
        this.saveStateAfter();
        
        let selectionStart = target.selectionStart;
        let selectionEnd = target.selectionEnd;
        
        let currentLineStart = (findReversed(target.value, "\n", 0, selectionStart) ?? -1) + 1;
        let currentLineEnd = find(target.value, "\n", selectionEnd);
        if (!currentLineEnd) return;
        
        let currentLine = target.value.substring(currentLineStart, currentLineEnd);
        
        let nextLineStart = currentLineEnd + 1;
        let nextLineEnd = find(target.value, "\n", nextLineStart) ?? target.value.length;
        
        let nextLine = target.value.substring(nextLineStart, nextLineEnd);
        let textBefore = target.value.substring(0, currentLineStart);
        let textAfter = target.value.substring(nextLineEnd);
        
        target.value = textBefore + nextLine + "\n" + currentLine + textAfter;
        
        target.selectionStart = selectionStart + nextLine.length + 1;
        target.selectionEnd = selectionEnd + nextLine.length + 1;
    }
}