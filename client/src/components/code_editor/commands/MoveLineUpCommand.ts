import {CodeEditorCommand} from "./CodeEditorCommand";
import {LanguageOptions} from "../languages/LanguageOptions";
import React from "react";
import {find, findReversed} from "../../../utils/StringUtils";

export class MoveLineUpCommand extends CodeEditorCommand {
    public canExecute(alt: boolean, ctrl: boolean, shift: boolean, key: string): boolean {
        return alt && !ctrl && !shift && key === "ArrowUp";
    }
    
    public async performAction(target: HTMLTextAreaElement, e: React.KeyboardEvent<HTMLTextAreaElement>, options: LanguageOptions): Promise<void> {
        this.saveStateBefore();
        this.saveStateAfter();
        
        let selectionStart = target.selectionStart;
        let selectionEnd = target.selectionEnd;
        
        let currentLineStart = findReversed(target.value, "\n", 0, selectionStart);
        if (!currentLineStart) return;
        currentLineStart++;
        
        let currentLineEnd = find(target.value, "\n", selectionEnd) ?? target.value.length;
        let currentLine = target.value.substring(currentLineStart, currentLineEnd);
        
        let prevLineEnd = currentLineStart - 1;
        let prevLineStart = (findReversed(target.value, "\n", 0, prevLineEnd - 1) ?? -1) + 1;
        
        let prevLine = target.value.substring(prevLineStart, prevLineEnd);
        let textBefore = target.value.substring(0, prevLineStart);
        let textAfter = target.value.substring(currentLineEnd);
        
        target.value = textBefore + currentLine + "\n" + prevLine + textAfter;
        
        target.selectionStart = selectionStart - prevLine.length - 1;
        target.selectionEnd = selectionEnd - prevLine.length - 1;
    }
}