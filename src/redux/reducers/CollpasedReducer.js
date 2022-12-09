import { UPDATEISCOLLPASED } from '../constant'

const CollpasedReducer =  (preState = { isCollpased: false }, action) => {
    const { type, data } = action
    switch (type) {
        case UPDATEISCOLLPASED:
            return { isCollpased: data }
        default:
            return preState
    }
}

export default CollpasedReducer