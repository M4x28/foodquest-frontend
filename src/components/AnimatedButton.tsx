import React,{ useState } from "react";

interface PropType{
    className? :string, 
    OnClick?: () => void, 
    animated?:boolean, 
    animationClass?:string,
    children?:React.ReactNode
}

function AnimatedButton({className = "", OnClick = () => {}, animated = true, animationClass,children}:PropType){

    const [anim,setAnim] = useState(false);
    const btnClass:string = className + (anim ? " " + animationClass : "");

    const onBtnClick = () => {
        if(!anim && animated){
            setAnim(true);
        }
        OnClick();
    }

    const onAnimEnd = () => {
        if(anim){
            setAnim(false);
        }
    } 

    return (
        <button className={btnClass} onClick={onBtnClick} onAnimationEnd={onAnimEnd}>
            {children}
        </button>
    );

}

export default AnimatedButton;