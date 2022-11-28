import {Dispatch} from 'redux';
import {SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType} from '../../app/app-reducer';
import {authAPI, LoginParamsType} from '../../api/todolists-api';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import axios from 'axios';
import {clearTodosDataAC} from '../TodolistsList/todolists-reducer';

const initialState = {
    isLoggedIn: false
}
type initialStateType = typeof initialState
export const authReducer = (state: initialStateType = initialState, action: ActionsType): initialStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN': {
            return {...state, isLoggedIn: action.value}
        }
        default:
            return state
    }
}
export const setIsLoginInAC = (value: boolean) => {
    return {type: 'login/SET-IS-LOGGED-IN', value} as const
}

// export const loginTC = (data: LoginParamsType) => (dispatch: Dispatch<ActionsType | SetAppStatusActionType>) => {
//     dispatch(setAppStatusAC('loading'))
//     authAPI.login(data)
//         .then((res) => {
//             if (res.data.resultCode === 0) {
//                 dispatch(setAppStatusAC('succeeded'))
//             } else {
//                 handleServerAppError(res.data, dispatch);
//             }
//         })
//         .catch((error) => {
//             handleServerNetworkError(error, dispatch)
//         })
// }
export const loginTC = (data: LoginParamsType) => async (dispatch: ThunkDispatch) => {
    dispatch(setAppStatusAC('loading'))
    try {
        const res = await authAPI.login(data)
        if (res.data.resultCode === 0) {
            dispatch(setIsLoginInAC(true))
            dispatch(setAppStatusAC('succeeded'))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            handleServerNetworkError(error, dispatch)
        }
    }
}

export const logoutTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.logout().then(res => {
        if (res.data.resultCode === 0) {
            dispatch(setIsLoginInAC(false))
            dispatch(setAppStatusAC('succeeded'))
            dispatch(clearTodosDataAC())
        } else {
            handleServerAppError(res.data, dispatch);
        }
    }).catch(error => {
        handleServerNetworkError(error, dispatch)
    })
}

type ActionsType = ReturnType<typeof setIsLoginInAC>
type ThunkDispatch = Dispatch<ActionsType | SetAppStatusActionType | SetAppErrorActionType>