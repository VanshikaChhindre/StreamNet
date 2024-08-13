import React, { useId } from 'react'

const Input = React.forwardRef(function Input({
    label = "",
    type = "text",
    className = "",
    placeholder,
    labelClassName,
    ...props
}, ref){

    const id = useId();
    return (
        <div className='w-full mb-4'>
            <label 
            className={`text-black inline-block mb-1 pl-2 ${labelClassName}`}
            htmlFor={id}>
                {label}
            </label>

            <input 
            type={type}
            className = {`w-full min-h-8 rounded-md px-3 py-2 outline-none ${className}`}
            placeholder={placeholder}
            ref={ref}
            id={id}
            {...props}
            
            />
            
        </div>
    )


})

export default Input