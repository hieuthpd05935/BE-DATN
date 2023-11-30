import React, { useEffect, useState } from 'react'
import { WrapperContent, WrapperLableText } from './style'
import * as ProductService from '../../services/ProductService'
import TypeProduct from '../TypeProduct/TypeProduct'
import { isEmpty } from 'lodash'

const NavBarComponent = () => {
     const [typeProducts, setTypeProducts] = useState([])

    const fetchProductAll = async () => {
        const res = await ProductService.getAllTypeProduct()
        if(res?.status === 'OK') {
            const data = res?.data.map((i, index) => ({ key: index, label: <TypeProduct name={i} /> }))
            setTypeProducts(data)
        }
    }
    
    useEffect(() => {
        fetchProductAll()
    }, [])
    
    return (
        <div>
            <WrapperLableText>Lable</WrapperLableText>
            <WrapperContent>
                {!isEmpty(typeProducts) && (
                    typeProducts.map(({ key, label }) => label)
                )}
            </WrapperContent>
        </div>
    )
}

export default NavBarComponent