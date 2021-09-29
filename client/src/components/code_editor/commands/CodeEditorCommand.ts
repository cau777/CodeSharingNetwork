import React from "react";
import {countOccurrences} from "../../../utils/StringUtils";
import {CodeEditorOptions} from "../CodeEditorOptions";
import {OpenCloseSet} from "../../../utils/OpenCloseSet";

export abstract class CodeEditorCommand {
    public savesStateBefore: boolean;
    public savesStateAfter: boolean;
    
    protected static readonly BlockCharacters = new OpenCloseSet([["(", ")"], ["{", "}"], ["[", "]"]]);
    protected static readonly LinkedCharacters = new OpenCloseSet([["(", ")"], ["{", "}"], ["[", "]"], ["\"", "\""], ["'", "'"]]);
    
    public abstract canExecute(alt: boolean, ctrl: boolean, shift: boolean, key: string): boolean;
    
    public abstract performAction(target: HTMLTextAreaElement, e: React.KeyboardEvent<HTMLTextAreaElement>, options: CodeEditorOptions): Promise<void>;
    
    public constructor() {
        this.savesStateBefore = false;
        this.savesStateAfter = false;
        this.insertValue = this.insertValue.bind(this);
        this.calcIndentationLevel = this.calcIndentationLevel.bind(this);
        this.generateIndentation = this.generateIndentation.bind(this);
    }
    
    protected insertValue(target: HTMLTextAreaElement, value: string) {
        let start = target.selectionStart;
        
        target.value = target.value.substring(0, target.selectionStart) + value + target.value.substring(target.selectionEnd);
        
        target.selectionStart = start + value.length;
        target.selectionEnd = target.selectionStart;
    }
    
    protected calcIndentationLevel(target: HTMLTextAreaElement) {
        let level = 0;
        
        for (let [open, close] of CodeEditorCommand.BlockCharacters.elements) {
            let opening = countOccurrences(target.value, open, 0, target.selectionStart);
            let closing = countOccurrences(target.value, close, 0, target.selectionStart);
            
            level += Math.max(0, opening - closing);
        }
        
        return Math.max(0, level);
    }
    
    protected generateIndentation(level: number, options: CodeEditorOptions) {
        return options.indentation.repeat(level);
    }
    
    protected moveCursor(target: HTMLTextAreaElement, pos: number) {
        target.selectionStart = pos;
        target.selectionEnd = target.selectionStart;
    }
    
    protected saveStateBefore() {
        this.savesStateBefore = true;
    }
    
    protected saveStateAfter() {
        this.savesStateAfter = true;
    }
}