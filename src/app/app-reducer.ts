import {Dispatch} from 'redux';
import {authAPI} from '../api/todolists-api';
import {setIsLoginInAC} from '../features/Login/authReducer';
import {handleServerAppError, handleServerNetworkError} from '../utils/error-utils';
import axios from 'axios';

const initialState: InitialStateType = {
    status: 'idle',
    error: null,
    isInitialized: false
}
export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        case 'APP/SET-IS-INITIALIZED':
            return {...state, isInitialized: action.value}
        default:
            return {...state}
    }
}
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
    // происходит ли сейчас взаимодействие с сервером
    status: RequestStatusType
    // если ошибка какая-то глобальная произойдёт - мы запишем текст ошибки сюда
    error: string | null
    // true когда приложение проинициализирвоалось (проверили пользователя, настройки получили и т.д)
    isInitialized: boolean
}
export const setAppErrorAC = (error: string | null) => ({type: 'APP/SET-ERROR', error} as const)
export const setAppStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)
export const setAppInitializedAC = (value: boolean) => ({type: 'APP/SET-IS-INITIALIZED', value} as const)

//хотим проверить залогинены мы или не залогинены. me запрос
//санка только должна просто отпарвить запрос на сервер me и спросить ,,а мы залогинены или незалогинены,,
// export const initializedTC = () => (dispatch: Dispatch) => {
//     authAPI.me()
//         .then(res => {
//             if (res.data.resultCode === 0) {
//                 dispatch(setIsLoginInAC(true))
//             } else {
//                 handleServerAppError(res.data, dispatch);
//             }
//         })
//         .catch((error) => {
//             handleServerNetworkError(error, dispatch)
//         })
//         .finally(() => {
//             dispatch(setAppInitializedAC(true))
//         })
// }

//========================= OR ========================= async/await:

export const initializedTC = () => async (dispatch: Dispatch) => {
    try {
        const res = await authAPI.me()
        if (res.data.resultCode === 0) {
            dispatch(setIsLoginInAC(true))
        } else {
            handleServerAppError(res.data, dispatch);
        }
    } catch (error) {
        if(axios.isAxiosError(error)) {
            handleServerNetworkError(error, dispatch)
        }
    } finally {
        dispatch(setAppInitializedAC(true))
    }
}

export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
export type initializedACType = ReturnType<typeof setAppInitializedAC>

type ActionsType = | SetAppErrorActionType | SetAppStatusActionType | initializedACType
