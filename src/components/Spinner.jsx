export default function Spinner(props) {
    return (
        <div id='spinner' className='loading-container show'>
            <div className="spinner">
                <div className="double-bounce1"></div>
                <div className="double-bounce2"></div>
            </div>
            {/* eslint-disable-next-line react/prop-types */}
            <p>{props.text}</p>
        </div>
    )
}