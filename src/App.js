import React from "react";
import Card from "./components/Card";
import Header from "./components/Header";
import Drawer from "./components/Drawer";

const arr = [
    // {title: 'Мужские Кроссовки Nike Blazer Mid Suede', price: 12999, imageUrl: "img/sneakers/1.jpg"},
    // {title: 'Мужские Кроссовки Nike Air Max 270', price: 15699, imageUrl: "img/sneakers/2.jpg"},
    // {title: 'Мужские Кроссовки Nike Blazer Mid Suede', price: 12679, imageUrl: "img/sneakers/3.jpg"},
    // {title: 'Кроссовки Puma X Aka Boku Future Rider', price: 8999, imageUrl: "img/sneakers/4.jpg"},
    // {title: 'Мужские Кроссовки Under Armour Curry 8', price: 8999, imageUrl: "img/sneakers/5.jpg"},
    // {title: 'Мужские Кроссовки Nike Kyrie 7', price: 11299, imageUrl: "img/sneakers/6.jpg"},
    // {title: 'Мужские Кроссовки Jordan Air Jordan 11', price: 10799, imageUrl: "img/sneakers/7.jpg"},
];

function App() {
    const [items, setItems] = React.useState([]);
    const [cartItems, setCartItems] = React.useState([]);

    const [cartOpened, setCartOpened] = React.useState(false);

    React.useEffect(() => {
        fetch('https://64ccbaab2eafdcdc851a33d0.mockapi.io/items')
            .then(res => {
                return res.json();
            }).then(json => {
            setItems(json);
        });
    }, []);

    const onAddToCart = (obj) => {
        setCartItems(prev => [...prev, obj])
    }

    return (
        <div className="wrapper clear">
            {cartOpened && <Drawer items={cartItems} onClose={() => setCartOpened(false)}/>}
            <Header onClickCart={() => setCartOpened(true)}/>
            <div className="content p-40">
                <div className="d-flex align-center justify-between mb-40">
                    <h1>Все кроссовки</h1>
                    <div className="search-block d-flex">
                        <img src="/img/search.svg" alt="Search"/>
                        <input type="text" placeholder="Поиск"/>
                    </div>
                </div>

                <div className="d-flex flex-wrap ">


                    {items.map(item =>
                        <Card
                            title={item.title}
                            imageUrl={item.imageUrl}
                            price={item.price}
                            onFavorite={() => console.log('Добавили взакладки')}
                            onPlus={(obj) => onAddToCart(obj)}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
