import "../../css/Settings.css";
import {Component} from "react";
import {ProfilePictureSettings} from "./ProfilePictureSettings";

export class Settings extends Component<any, any> {
    
    public render() {
        return (
            <div className="settings px-4 py-2">
                <ProfilePictureSettings/>
            </div>
        );
    }
}