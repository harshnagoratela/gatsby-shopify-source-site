import React, { useState, useContext, useEffect, useCallback } from 'react'
import find from 'lodash/find'
import isEqual from 'lodash/isEqual'
import PropTypes from 'prop-types'

import StoreContext from '../context/StoreContext'

const ProductForm = ({ product }) => {
    const {
        options,
        variants,
        variants: [initialVariant],
        priceRange: { minVariantPrice },
    } = product
    const [variant, setVariant] = useState({ ...initialVariant })
    const [quantity, setQuantity] = useState(1)
    const {
        addVariantToCart,
        store: { client, adding, checkout },
    } = useContext(StoreContext)

    const productVariant =
        client.product.helpers.variantForOptions(product, variant) || variant
    const [available, setAvailable] = useState(productVariant.availableForSale)

    const checkAvailability = useCallback(
        productId => {
            client.product.fetch(productId).then(fetchedProduct => {
                // this checks the currently selected variant for availability
                const result = fetchedProduct.variants.filter(
                    variant => variant.id === productVariant.shopifyId
                )
                if (result.length > 0) {
                    setAvailable(result[0].available)
                }
            })
        },
        [client.product, productVariant.shopifyId, variants]
    )

    useEffect(() => {
        checkAvailability(product.shopifyId)
    }, [productVariant, checkAvailability, product.shopifyId])

    const handleQuantityChange = ({ target }) => {
        console.log("******* handleQuantityChange")
        console.log(target.value)

        setQuantity(target.value)
    }

    const handleOptionChange = (optionIndex, { target }) => {
        const { value } = target
        console.log("******* handleOptionChange")
        console.log(value)
        const currentOptions = [...variant.selectedOptions]

        currentOptions[optionIndex] = {
            ...currentOptions[optionIndex],
            value,
        }

        const selectedVariant = find(variants, ({ selectedOptions }) =>
            isEqual(currentOptions, selectedOptions)
        )

        setVariant({ ...selectedVariant })
    }

    const handleAddToCart = () => {
        let addCartReturn = addVariantToCart(productVariant.shopifyId, quantity)
        addCartReturn.then(function(){
            window.open(checkout.webUrl)
            //window.open("/cart","_self")
        });
    }

    /*
    Using this in conjunction with a select input for variants
    can cause a bug where the buy button is disabled, this
    happens when only one variant is available and it's not the
    first one in the dropdown list. I didn't feel like putting
    in time to fix this since its an edge case and most people
    wouldn't want to use dropdown styled selector anyways -
    at least if the have a sense for good design lol.
    */
    const checkDisabled = (name, value) => {
        const match = find(variants, {
            selectedOptions: [
                {
                    name: name,
                    value: value,
                },
            ],
        })
        if (match === undefined) return true
        if (match.availableForSale === true) return false
        return true
    }

    const price = Intl.NumberFormat(undefined, {
        currency: minVariantPrice.currencyCode,
        minimumFractionDigits: 2,
        style: 'currency',
    }).format(variant.price)

    const compareAtPrice = Intl.NumberFormat(undefined, {
        currency: minVariantPrice.currencyCode,
        minimumFractionDigits: 2,
        style: 'currency',
    }).format(variant.compareAtPrice)

    return (
        <>
            {options.map(({ id, name, values }, index) => (
                <React.Fragment key={id}>
                    <select
                        name={name}
                        key={id}
                        onChange={event => handleOptionChange(index, event)}
                        style={{display: "none"}}
                    >
                        {values.map(value => (
                            <option
                                value={value}
                                key={`${name}-${value}`}
                                disabled={checkDisabled(name, value)}
                            >
                                {value}
                            </option>
                        ))}
                    </select>
                </React.Fragment>
            ))}
            <input
                type="hidden"
                id="quantity"
                name="quantity"
                min="1"
                step="1"
                onChange={handleQuantityChange}
                value={quantity}
            />
            <br />
            <button
                type="submit"
                className = "Button"
                style = {{background: "var(--midGrey)", color: "var(--secondary)"}}
                disabled={!available || adding}
                onClick={handleAddToCart}
            >
                Get Started
            </button>

            <h3>{price}</h3>
            {productVariant.compareAtPrice && (compareAtPrice != price) && <h3 style={{ textDecoration: "line-through" }}>{compareAtPrice}</h3>}
            {!available && <p>This Product is out of Stock!</p>}
        </>
    )
}

ProductForm.propTypes = {
    product: PropTypes.shape({
        descriptionHtml: PropTypes.string,
        handle: PropTypes.string,
        id: PropTypes.string,
        shopifyId: PropTypes.string,
        images: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string,
                originalSrc: PropTypes.string,
            })
        ),
        options: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string,
                name: PropTypes.string,
                values: PropTypes.arrayOf(PropTypes.string),
            })
        ),
        productType: PropTypes.string,
        title: PropTypes.string,
        variants: PropTypes.arrayOf(
            PropTypes.shape({
                availableForSale: PropTypes.bool,
                id: PropTypes.string,
                price: PropTypes.string,
                compareAtPrice: PropTypes.string,
                title: PropTypes.string,
                shopifyId: PropTypes.string,
                selectedOptions: PropTypes.arrayOf(
                    PropTypes.shape({
                        name: PropTypes.string,
                        value: PropTypes.string,
                    })
                ),
            })
        ),
    }),
    addVariantToCart: PropTypes.func,
}

export default ProductForm
