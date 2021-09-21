import React from "react";
import {countOccurrences} from "../../../utils/StringUtils";
import {CodeEditorOptions} from "../CodeEditorOptions";
import {OpenCloseSet} from "../../../utils/OpenCloseSet";

export abstract class CodeEditorCommand {
    protected static readonly BlockCharacters = new OpenCloseSet([["(", ")"], ["{", "}"], ["[", "]"]]);
    protected static readonly LinkedCharacters = new OpenCloseSet([["(", ")"], ["{", "}"], ["[", "]"], ["\"", "\""], ["'", "'"]]);
    
    private readonly preventsDefault: boolean;
    private readonly updatesText: boolean;
    
    public abstract canExecute(alt: boolean, ctrl: boolean, shift: boolean, key: string): boolean;
    
    protected abstract performAction(component: React.Component, e: React.KeyboardEvent<HTMLTextAreaElement>, options: CodeEditorOptions): void;
    
    protected constructor(preventsDefault: boolean, updatesSize: boolean) {
        this.preventsDefault = preventsDefault;
        this.updatesText = updatesSize;
        
        this.execute = this.execute.bind(this);
        this.insertValue = this.insertValue.bind(this);
        this.updateRowsAndCols = this.updateRowsAndCols.bind(this);
        this.calcIndentationLevel = this.calcIndentationLevel.bind(this);
        this.generateIndentation = this.generateIndentation.bind(this);
    }
    
    public execute(component: React.Component, e: React.KeyboardEvent<HTMLTextAreaElement>, options: CodeEditorOptions) {
        this.performAction(component, e, options);
        
        if (this.updatesText) {
            this.updateRowsAndCols(component, e.currentTarget);
            component.setState({text: e.currentTarget.value})
        }
        
        if (this.preventsDefault) e.preventDefault();
    }
    
    protected insertValue(target: HTMLTextAreaElement, value: string) {
        let start = target.selectionStart;
        
        target.value = target.value.substring(0, target.selectionStart) + value + target.value.substring(target.selectionEnd);
        
        target.selectionStart = start + value.length;
        target.selectionEnd = target.selectionStart;
    }
    
    protected updateRowsAndCols(component: React.Component, target: HTMLTextAreaElement) {
        let lines = (target.value + "\n").match(/.*\n/g) || [];
        let rows = lines.length;
        let longestRow = 0;
        
        for (let line of lines) {
            longestRow = Math.max(longestRow, line.length);
        }
        
        target.rows = rows;
        component.setState({rows: rows});
    }
    
    protected calcIndentationLevel(target: HTMLTextAreaElement) {
        let opening = 0;
        let closing = 0;
        
        for (let [open, close] of CodeEditorCommand.BlockCharacters.elements) {
            opening += countOccurrences(target.value, open, 0, target.selectionStart);
            closing += countOccurrences(target.value, close, 0, target.selectionStart);
        }
        
        return Math.max(0, opening - closing);
    }
    
    protected generateIndentation(level: number, options: CodeEditorOptions) {
        return options.indentation.repeat(level);
    }
}