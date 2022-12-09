import { ISLOADING } from "../constant";
import { store } from "../store";
export const isLoading = data => {
    store.dispatch({ type: ISLOADING, data })
    // console.log(data);
    // return ({
    //     type: ISLOADING,
    //     data
    // })
}
