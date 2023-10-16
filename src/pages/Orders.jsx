import React from "react";
import axios from "axios";
import Card from "../components/Card";

function Orders() {
    const [orders, setOrders] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        //как вариант - самовызывающаяся функция (для асинхронного запроса)
        (async () => {
            try {
                const {data} = await axios.get('https://652822c3931d71583df1eda7.mockapi.io/orders');
                setOrders(data.reduce((prev, obj) => [...prev, ...obj.items], [])); //объединили массивы заказов в 1 массив
                setIsLoading(false);
            } catch (error) {
                console.log(error, 'Ошибка при запросе заказов')
            }
        })();

    }, []);

    return (
        <div className="content p-40">
            <div className="d-flex align-center justify-between mb-40">
                <h1>Мои заказы</h1>
            </div>

            <div className="d-flex flex-wrap ">
                {(isLoading ? [...Array(8)] : orders)
                    .map((item, i) =>
                        <Card key={i} loading={isLoading} {...item} />
                    )}
            </div>
        </div>
    )
}

export default Orders;