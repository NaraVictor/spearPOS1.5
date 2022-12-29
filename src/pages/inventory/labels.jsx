import { PrinterFilled, ReloadOutlined } from "@ant-design/icons";
import { Button, Input, Select, Space } from "antd";
import React, { useEffect, useState } from "react";
import BarCode from 'react-barcode'
import { useReactToPrint } from 'react-to-print'
import CopyRight from "../../components/copyright"

export default function ProductLabels ( { products, ...props } ) {

    const [ prods, setProducts ] = useState( [] )
    const printArea = React.useRef()

    const handlePrint = useReactToPrint( {
        content: () => printArea.current,
        documentTitle: "Product Labels",
        copyStyles: true,
    } );

    const { Search } = Input;
    const { Option } = Select;


    useEffect( () => {
        setProducts( products )
    }, [] )


    return (

        <>
            <div className="row">
                <div className="col-12 d-flex justify-content-between">
                    <Button
                        type="primary"
                        size="large"
                        className="d-flex align-items-center"
                        onClick={ handlePrint }>
                        <PrinterFilled />
                        Print
                    </Button>
                    <Space className="ms-3">
                        <Search
                            onChange={ ( e ) =>
                                setProducts(
                                    products.filter(
                                        ( d ) =>
                                            d.code === e.target.value ||
                                            d.productName
                                                .toLowerCase()
                                                .includes( e.target.value.toLowerCase() ) ||
                                            d.category.name
                                                .toLowerCase()
                                                .includes( e.target.value.toLowerCase() )
                                    )
                                )
                            }
                            placeholder="search product by name, code or category"
                            style={ { width: "300px" } }
                        />
                        <Select
                            style={ { width: "150px" } }
                            name="byproductcategory"
                            onChange={ ( v ) =>
                                setProducts(
                                    prods.filter( ( d ) => d.category.name === v )
                                )
                            }
                            defaultValue="product category">
                            { [ ...new Set( prods.map( ( d ) => d.category.name ) ) ].map(
                                ( v ) => (
                                    <Option value={ v } key={ v }>{ v }</Option>
                                )
                            ) }
                        </Select>
                    </Space>
                    <Button
                        onClick={ () => setProducts( products ) }
                        type="default"
                        className="ms-2 d-flex align-items-center">
                        <ReloadOutlined />
                        Reset filters
                    </Button>
                </div>
            </div>
            <div ref={ printArea }>
                <div className="row p-5" >
                    <h5 className="mb-0">Product Labels</h5>
                    <p className="mb-0 mt-0">Printed on { new Date().toUTCString() }</p>
                    <p className="mt-0 mb-5"><CopyRight /> | +233 (0)50 915 2188</p>
                    {
                        prods.map( prod =>
                            prod?.code && <div className="col-3 text-center" key={ prod.id }>
                                <BarCode value={ prod.code } displayValue fontSize="14" width="1" height="70" />
                                <p className="mt-0">{ prod.productName }</p>
                            </div>
                        )
                    }
                </div>
            </div>
        </>
    )
}


