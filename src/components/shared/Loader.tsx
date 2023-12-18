const Loader = ({height = 42, width = 42}) => {
    return (
        <div className="flex-center w-full">
            <img src="/assets/icons/loader.svg" alt="loader"
                width={height} height={width} />
        </div>
    )
}

export default Loader