// eslint-disable-next-line react/prop-types
export default function Spinner({children}) {
    return (
        <div id='spinner' className='loading-container show'>
            <div className="spinner">
                <div className="double-bounce1"></div>
                <div className="double-bounce2"></div>
            </div>
            <p>{children}</p>
        </div>
    )
}