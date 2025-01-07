import React from 'react';

/**
 * @link https://codepen.io/uberpwner/pen/xvdJxx
 */
const PriceTag = ({ price }) => {
    const color = 'var(--color-middle)';
    const styles = {
        cardPrice: {
            display: 'inline-block',
            width: 'auto',
            height: '38px',
            backgroundColor: color,
            borderRadius: '3px 4px 4px 3px',
            borderLeft: '1px solid ' + color,
            marginLeft: '19px',
            position: 'relative',
            color: 'white',
            fontWeight: 300,
            fontSize: '22px',
            lineHeight: '38px',
            padding: '0 10px 0 10px',
        },
        triangle: {
            content: '""',
            position: 'absolute',
            display: 'block',
            left: '-19px',
            width: 0,
            height: 0,
            borderTop: '19px solid transparent',
            borderBottom: '19px solid transparent',
            borderRight: '19px solid ' + color,
        },
        circle: {
            content: '""',
            backgroundColor: 'white',
            borderRadius: '50%',
            width: '4px',
            height: '4px',
            display: 'block',
            position: 'absolute',
            left: '-9px',
            top: '17px',
        },
    };

    return (
        <div style={styles.cardPrice}>
            <div style={styles.triangle}></div>
            <div style={styles.circle}></div>
            {price}
        </div>
    );
};

export default PriceTag;
