import type React from 'react';
import style from './styles/summaryCard.module.css';
import { FaIcons } from 'react-icons/fa';
import { Link } from 'react-router-dom';
interface CardProp {
    name?: string
    bg?: 'yellow' | 'blue' | 'green'
    amount?: number | string
    label?: string
    icone?: React.ReactNode
    moreInfoUrl?: string | undefined
}
function Card(props: CardProp) {
    const {
        bg = 'green',
        amount = 0,
        moreInfoUrl,
        label = 'Label',
        icone = <FaIcons />
    } = props || {}
    
    const dark_class = `${bg}_dark`
    return (
        <div className={`${style.card} ${style[bg]}`}>
            <div className={style.card_info}>
                <div className={style.card_info_details}>
                    <span>{amount}</span>
                    <span>{label}</span>
                </div>
                <div className={style.card_info_icone}>{icone}</div>
            </div>
            {
                moreInfoUrl ? <Link to={moreInfoUrl} className={style.card_more_info + ` ${style[dark_class]}`}>More Info</Link> :
                    <div className={style.card_more_info + ` ${style[dark_class]}`}>More Info</div>
            }
        </div>
    )
}
export default Card