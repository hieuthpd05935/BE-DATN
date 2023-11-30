import React from 'react'
import { isEmpty } from 'lodash'
import { Dropdown } from 'antd';
import SliderComponent from '../../components/SliderComponent/SliderComponent'
import { WrapperButtonMore, WrapperProducts, WrapperTypeProduct } from './style'
import slider1 from '../../assets/images/slider1.webp'
import slider2 from '../../assets/images/slider2.webp'
import slider3 from '../../assets/images/slider3.webp'
import CardComponent from '../../components/CardComponent/CardComponent'
import { useQuery } from '@tanstack/react-query'
import * as ProductService from '../../services/ProductService'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import Loading from '../../components/LoadingComponent/Loading'
import { useDebounce } from '../../hooks/useDebounce'
import { useEffect } from 'react'
import TypeProduct from '../../components/TypeProduct/TypeProduct';
import {MenuOutlined} from '@ant-design/icons';

const HomePage = () => {
  const searchProduct = useSelector((state) => state?.product?.search)
  const searchDebounce = useDebounce(searchProduct, 500)
  const [loading, setLoading] = useState(false)
  const [limit, setLimit] = useState(6)
  const [typeProducts, setTypeProducts] = useState([])
  
  const fetchProductAll = async (context) => {
    const limit = context?.queryKey && context?.queryKey[1]
    const search = context?.queryKey && context?.queryKey[2]
    const res = await ProductService.getAllProduct(search, limit)

    return res;
  }

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct()
    if(res?.status === 'OK') {
      const data = res?.data.map((i, index) => ({ key: index, label: <TypeProduct name={i} /> }))
      setTypeProducts(data)
    }
  }

  const { isLoading, data: products, isPreviousData } = useQuery(['products', limit, searchDebounce], fetchProductAll, { retry: 3, retryDelay: 1000, keepPreviousData: true })

  useEffect(() => {
    fetchAllTypeProduct()
  }, [])

  return (
    <Loading isLoading={isLoading || loading}>
      <div style={{ width: '1270px', margin: '0 auto' }}>
        <WrapperTypeProduct>
          {!isEmpty(typeProducts) && (
            <Dropdown
              menu={{
                items: typeProducts,
              }}
              placement="bottom"
              arrow={{
                pointAtCenter: true,
              }}
            >
              <div style={{cursor: 'pointer'}}><MenuOutlined /> Danh mục sản phẩm</div>
            </Dropdown>
          )}
              <div style={{cursor: 'pointer'}}>Tin tức</div>
              <div style={{cursor: 'pointer'}}>Giới thiệu</div>
        </WrapperTypeProduct>
      </div>
      <SliderComponent style={{width: '100%', height: '100%'}} arrImages={[slider1, slider2, slider3]} />
      <div style={{textAlign: 'center', height: '100px'}}>
        <p style={{fontSize: '27px', fontWeight: '500', padding: '37px'}}>SÁCH MỚI</p>
      </div>
      <div className='body' style={{ width: '100%', height: '400px', backgroundColor: '#fff', }}>
        <div id="container" style={{ width: '1270px', margin: '0 auto' }}>
          <WrapperProducts>
            {products?.data?.map((product) => {
              return (
                <CardComponent
                  key={product._id}
                  countInStock={product.countInStock}
                  description={product.description}
                  image={product.image}
                  name={product.name}
                  price={product.price}
                  rating={product.rating}
                  type={product.type}
                  selled={product.selled}
                  discount={product.discount}
                  id={product._id}
                />
              )
            })}
          </WrapperProducts>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
            <WrapperButtonMore
              textbutton={isPreviousData ? 'Load more' : "Xem thêm"} type="outline" styleButton={{
                border: `1px solid ${products?.total === products?.data?.length ? '#f5f5f5' : '#9255FD'}`, color: `${products?.total === products?.data?.length ? '#f5f5f5' : '#9255FD'}`,
                width: '240px', height: '38px', borderRadius: '4px'
              }}
              disabled={products?.total === products?.data?.length || products?.totalPage === 1}
              styleTextButton={{ fontWeight: 500, color: products?.total === products?.data?.length && '#fff' }}
              onClick={() => setLimit((prev) => prev + 6)}
            />
          </div>
        </div>
      </div>
      <div>fotter</div>
    </Loading>
  )
}

export default HomePage 