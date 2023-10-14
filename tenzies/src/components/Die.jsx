import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiceOne } from '@fortawesome/free-solid-svg-icons';
import { faDiceTwo } from '@fortawesome/free-solid-svg-icons';
import { faDiceThree } from '@fortawesome/free-solid-svg-icons';
import { faDiceFour } from '@fortawesome/free-solid-svg-icons';
import { faDiceFive } from '@fortawesome/free-solid-svg-icons';
import { faDiceSix } from '@fortawesome/free-solid-svg-icons';

export default function Die(props) {
    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "white"
    }
    
    const getDiceIcon = (value) => {
        switch (value) {
          case 1:
            return <FontAwesomeIcon icon={faDiceOne} />;
          case 2:
            return <FontAwesomeIcon icon={faDiceTwo} />;
          case 3:
            return <FontAwesomeIcon icon={faDiceThree} />;
          case 4:
            return <FontAwesomeIcon icon={faDiceFour} />;
          case 5:
            return <FontAwesomeIcon icon={faDiceFive} />;
          case 6:
            return <FontAwesomeIcon icon={faDiceSix} />;
          default:
            return null;
        }
    }

    return (
        <div 
            className="die-face"
            onClick={props.holdDice}
            style={styles}
        >
            <div className="die-dots">{getDiceIcon(props.value)}</div>
        </div>
    )
}