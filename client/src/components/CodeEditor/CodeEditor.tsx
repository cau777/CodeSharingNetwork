import "../../css/CodeEditor.css";
import React, {Component, KeyboardEvent, UIEvent} from "react";
import {SupportedLanguages} from "./SupportedLanguages";
import LineNumbers from "./LineNumbers";
import {DeleteToWordStartCommand} from "./commands/DeleteToWordStartCommand";
import {EnterCommand} from "./commands/EnterCommand";
import InsertIndentationCommand from "./commands/InsertIndentationCommand";
import SelectAllCommand from "./commands/SelectAllCommand";
import {BackspaceCommand} from "./commands/BackspaceCommand";
import {InsertKeyCommand} from "./commands/InsertKeyCommand";
import {CodeEditorCommand} from "./commands/CodeEditorCommand";
import {CodeEditorOptions} from "./CodeEditorOptions";
import $ from "jquery";
import {CodeDisplay} from "./CodeDisplay";
import {countOccurrences} from "../../utils/StringUtils";
import {DeleteCommand} from "./commands/DeleteCommand";

interface IProps {
    language: SupportedLanguages;
}

interface IState {
    text: string;
    selected: number;
    rows: number;
}

class CodeEditor extends Component<IProps, IState> {
    private static readonly commands: CodeEditorCommand[] = [
        new SelectAllCommand(),
        new DeleteToWordStartCommand(),
        new EnterCommand(),
        new InsertIndentationCommand(),
        new BackspaceCommand(),
        new DeleteCommand(),
        new InsertKeyCommand(),
    ];
    
    public constructor(props: IProps) {
        super(props);
        this.state = {
            text: "",
            selected: 0,
            rows: 1,
        };
        
        this.keyDown = this.keyDown.bind(this);
        this.updateSelectedRow = this.updateSelectedRow.bind(this);
    }
    
    public render() {
        // noinspection JSJQueryEfficiency
        return (
            <div className="code-editor selected-border">
                <LineNumbers lineNumbers={this.state.rows}/>
                <div id="code-wrapper">
                    <div id="code-text-wrapper">
                        <CodeDisplay selected={this.state.selected} text={this.state.text}/>
                    </div>
                    <textarea id="code-input" is="LineInput" onKeyDown={this.keyDown}
                              onScroll={CodeEditor.scrollNumbers} onFocus={() => $(".code-editor").addClass("selected")}
                              onBlur={() => $(".code-editor").removeClass("selected")} onSelect={this.updateSelectedRow} rows={1} maxLength={10_000}>
                        
                    </textarea>
                </div>
            </div>
        )
    }
    
    private static prepareKey(key: string) {
        // InternetExplorer and Edge use different naming
        switch (key) {
            case "Down":
                return "ArrowDown";
            case "Up":
                return "ArrowUp";
            case "Left":
                return "ArrowLeft";
            case "Right":
                return "ArrowRight";
            case "Esc":
                return "Escape";
            default:
                return key;
        }
    }
    
    private static scrollNumbers(event: UIEvent<HTMLTextAreaElement>) {
        let target = event.currentTarget;
        let lines = document.getElementById("line-numbers");
        let codeText = document.getElementById("code-text-wrapper");
        
        if (lines !== null) {
            lines.style.top = -target.scrollTop + "px";
            lines.style.left = "0";
        }
        
        if (codeText !== null) {
            codeText.style.top = -target.scrollTop + "px";
            codeText.style.left = -target.scrollLeft + "px";
        }
    }
    
    private keyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
        for (let command of CodeEditor.commands) {
            if (command.canExecute(e.altKey, e.ctrlKey, e.shiftKey, CodeEditor.prepareKey(e.key))) {
                command.execute(this, e, new CodeEditorOptions());
                break;
            }
        }
    }
    
    private updateSelectedRow(e: KeyboardEvent<HTMLTextAreaElement>) {
        let lineNum = countOccurrences(e.currentTarget.value, "\n", 0, e.currentTarget.selectionEnd);
        this.setState({selected: lineNum});
    }
}

export {CodeEditor};