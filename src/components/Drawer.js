import Info from "./Info";
import React from "react";
import AppContext from "../context";
import axios from "axios";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
function Drawer({onClose, onRemove, items = []}) {
    const {cartItems, setCartItems} = React.useContext(AppContext);
    const [isOrderComplete, setIsOrderComplete] = React.useState(false);
    const [orderId, setOrderId] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);


    const onClickOrder = async () => {
       try {
           setIsLoading(true);
           const {data} = await axios.post('https://652822c3931d71583df1eda7.mockapi.io/orders', {
               items: cartItems
           });//передаем заказ(оъбект корзины) на сервер

           setOrderId(data.id); //устанавливаем Id номер заказа с бэкенда(сервера)
           setIsOrderComplete(true); //заказ оформлен
           setCartItems([]); //очищаем корзину в стейте
        //КОСТЫЛь
          for (let i = 0; i < cartItems.length; i++) {
            const item = cartItems[i];
            await axios.delete('https://64ccbaab2eafdcdc851a33d0.mockapi.io/cart/' + item.id, );//очищаем корзину на сервере, удаляя каждый элемент, с ождинаием выполнения удаления
            await delay(1000);
          }


       } catch (error) {
           alert("Ошибка при создании заказа")
       }
       setIsLoading(false);
    }

    return (
        <div className="overlay">
            <div className="drawer">
                <h2 className="mb-30 d-flex justify-between">
                    Корзина
                    <img onClick={onClose} className="removeBtn cu-p" src="/img/btn-remove.svg" alt="Close"/>
                </h2>

                {
                    items.length > 0 ?
                        <>
                            <div className="items">
                                {items.map((obj) => (
                                    <div key={obj.id} className="cartItem d-flex align-center mb-20">
                                        <div style={{backgroundImage: `url(${obj.imageUrl})`}}
                                             className="cartItemImg"></div>

                                        <div className="mr-20 flex">
                                            <p className="mb-5">{obj.title}</p>
                                            <b>{obj.price} руб.</b>
                                        </div>
                                        <img onClick={() => onRemove(obj.id)} className="removeBtn"
                                             src="/img/btn-remove.svg" alt="Remove"/>
                                    </div>
                                ))}
                            </div>
                            <div className="cartTotalBlock">
                                <ul className="">
                                    <li className="d-flex">
                                        <span>Итого</span>
                                        <div></div>
                                        <b>21 498 руб.</b>
                                    </li>
                                    <li className="d-flex">
                                        <span>Налог 5%</span>
                                        <div></div>
                                        <b>1074 руб. </b>
                                    </li>
                                </ul>
                                <button disabled={isLoading} onClick={onClickOrder} className="greenButton">Оформить заказ <img src="/img/arrow.svg" alt="Arrow"/>
                                </button>
                            </div>
                        </>
                        :
                        <Info title={isOrderComplete ? "Заказ оформлен" : "Корзина пустая"}
                                     description={isOrderComplete ? `Ваш заказ #${orderId} скоро будет передан курьерской доставке` : "Добавьте хотя бы одну пару кроссовок"}
                              image={isOrderComplete ? "/img/complete-order.jpg" : "/img/empty-cart.jpg"}/>
                }

            </div>
        </div>
    );
}

export default Drawer;