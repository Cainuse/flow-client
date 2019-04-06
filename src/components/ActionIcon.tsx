import * as React from 'react';
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface ActionIconProps {
    readonly icon: IconProp;
    message?: string;
    onClick?: () => void;
}

export default class ActionIcon extends React.Component<ActionIconProps> {

    render() {
        return (
        <button className="action-icon" onClick={this.props.onClick}>
            <FontAwesomeIcon icon={this.props.icon}></FontAwesomeIcon>
        </button >);
    }
}