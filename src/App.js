import React from "react";
import {Routes, Route} from "react-router-dom";
import axios from "axios";
import Header from "./components/Header";
import Drawer from "./components/Drawer";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import AppContext from "./context";
import Orders from "./pages/Orders";

function App() {
    const [items, setItems] = React.useState([]);
    const [favorites, setFavorites] = React.useState([]);
    const [cartItems, setCartItems] = React.useState([]);
    const [searchValue, setSearchValue] = React.useState('');
    const [cartOpened, setCartOpened] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        async function fetchData() {
            // setIsLoading(true);
            try {
                const [cartResponse, favoritesResponse, itemsResponse] = await Promise.all([
                    axios.get('https://64ccbaab2eafdcdc851a33d0.mockapi.io/cart'),
                    axios.get('https://652822c3931d71583df1eda7.mockapi.io/favorites'),
                    axios.get('https://64ccbaab2eafdcdc851a33d0.mockapi.io/items')
                ]);

                setIsLoading(false);
                setCartItems(cartResponse.data);
                setFavorites(favoritesResponse.data);
                setItems(itemsResponse.data);
            } catch (error) {
                alert(`Ошибка при добавлении в корзину: ${error}`);
            }
        }

        fetchData();
    }, []);

    const onAddToCart = async (obj) => {
        try {
            if (cartItems.find(item => Number(item.id) === Number(obj.id))) {
                setCartItems(prev => prev.filter(prevItem => Number(prevItem.id) !== Number(obj.id)));
                await axios.delete(`https://64ccbaab2eafdcdc851a33d0.mockapi.io/cart/${obj.id}`);

            } else {
                setCartItems(prev => [...prev, obj]);
                await axios.post('https://64ccbaab2eafdcdc851a33d0.mockapi.io/cart', obj);
                // .then(res => setCartItems(prev => [...prev, res.data]));

            }
        } catch (error) {
            alert('Ошибка при добавлении в корзину');
            console.error(error);
        }

    }
    const onRemoveItem = async (id) => {
        try {
            await axios.delete(`https://64ccbaab2eafdcdc851a33d0.mockapi.io/cart/${id}`);
            setCartItems(prev => prev.filter(item => item.id !== id));
        } catch (error) {
            alert(`Ошибка при удалении из корзины}`);
        }
    }

    const onAddToFavorite = async (obj) => {
        try {
            if (favorites.find(favObj => Number(favObj.id) === Number(obj.id))) {
                axios.delete(`https://652822c3931d71583df1eda7.mockapi.io/favorites/${obj.id}`);
                setFavorites(prev => prev.filter(item => Number(item.id) !== Number(obj.id))); //- удаление из стейта закладок
            } else {
                //дожидаемся ответа от сервера, и записывай в стейт объект как в бекенде (чтоб не было проблем с id)
                const {data} = await axios.post('https://652822c3931d71583df1eda7.mockapi.io/favorites', obj);
                setFavorites(prev => [...prev, data])
            }
        } catch (error) {
            alert('Не удалось добавить в закладки!');
            console.log(error.message);
        }
    }
    const onChangeSearchInput = (event) => {
        setSearchValue(event.target.value);
    }
    const isItemAdded = (id) => {
        return cartItems.some(cartItem => Number(cartItem.id) === Number(id));
    }

    return (
        <AppContext.Provider value={{
            items, cartItems, favorites, isItemAdded, onAddToFavorite, onAddToCart,
            setCartItems, setCartOpened
        }}>
            <div className="wrapper clear">
                <Drawer items={cartItems} onClose={() => setCartOpened(false)} onRemove={onRemoveItem}
                        opened={cartOpened}/>
                <Header onClickCart={() => setCartOpened(true)}/>

                <Routes>
                    <Route path="/"
                           element={<Home items={items}
                                          searchValue={searchValue}
                                          setSearchValue={setSearchValue}
                                          onAddToFavorite={onAddToFavorite}
                                          onAddToCart={onAddToCart}
                                          onChangeSearchInput={onChangeSearchInput}
                                          isLoading={isLoading}
                           />}
                    />
                    <Route path="/favorites"
                           element={
                               <Favorites/>
                           }
                    />
                    <Route path="/orders"
                           element={
                               <Orders/>
                           }
                    />
                </Routes>

            </div>
        </AppContext.Provider>
    );
}

export default App;
