// eslint-disable-next-line react/prop-types
function Button({className, children, ...rest}) {
    return (
        <button className={className} {...rest}>{children}</button>
    );
}

export default Button;