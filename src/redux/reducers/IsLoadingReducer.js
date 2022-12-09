import { ISLOADING } from "../constant";

const IsLoadingReducer =  (preState = { isLoading: false }, action) => {
    const { type, data } = action
    switch (type) {
        case ISLOADING:
            return { isLoading: data }
        default:
            return preState
    }
}

export default IsLoadingReducer