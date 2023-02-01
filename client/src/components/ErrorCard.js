

const ErrorCard = ({missingData, resolve}) => {

        if (missingData) {
            return  <div className={'error-card'}>
                        <div id={'text-box'}>
                            {'Data unavailable for selected region :('}
                        </div>
                        <div id={'resolve-button'}>
                            <button onClick={() => resolve()}>
                                OK
                            </button>
                        </div>
                    </div>
        }

        return null;
}

export default ErrorCard;