"use client"
import React from 'react'
import { store } from './redux/store'
import { Provider } from 'react-redux'

export default function StoreProvider({ children }) {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}
