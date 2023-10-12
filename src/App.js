import React from "react";
import {Routes, Route} from "react-router-dom";
import axios from "axios";
import Header from "./components/Header";
import Drawer from "./components/Drawer";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";

function App() {
    const [items, setItems] = React.useState([]);
    const [favorites, setFavorites] = React.useState([]);
    const [cartItems, setCartItems] = React.useState([]);
    const [searchValue, setSearchValue] = React.useState('');
    const [cartOpened, setCartOpened] = React.useState(false);

    React.useEffect(() => {
        // fetch('https://64ccbaab2eafdcdc851a33d0.mockapi.io/items')
        //     .then(res => {
        //         return res.json();
        //     }).then(json => {
        //     setItems(json);
        // });

        axios.get('https://64ccbaab2eafdcdc851a33d0.mockapi.io/items').then(res => {
            setItems(res.data);
        });
        axios.get('https://64ccbaab2eafdcdc851a33d0.mockapi.io/cart').then(res => {
            setCartItems(res.data);
        });
        axios.get('https://652822c3931d71583df1eda7.mockapi.io/favorites').then(res => {
            setFavorites(res.data);
        });
    }, []);

    const onAddToCart = (obj) => {
        axios.post('https://64ccbaab2eafdcdc851a33d0.mockapi.io/cart', obj)
            .then(res => setCartItems(prev => [...prev, res.data]));
        // setCartItems(prev => [...prev, obj]);
    }
    const onRemoveItem = (id) => {
        axios.delete(`https://64ccbaab2eafdcdc851a33d0.mockapi.io/cart/${id}`);
        setCartItems(prev => prev.filter(item => item.id !== id));
    }

    const onAddToFavorite = async (obj) => {
        try {
            if (favorites.find(favObj => favObj.id === obj.id)) {
                axios.delete(`https://652822c3931d71583df1eda7.mockapi.io/favorites/${obj.id}`);
                // setFavorites(prev => prev.filter(item => item.id !== obj.id));
            } else {
                //дожидаемся ответа от сервера, и записывай в стейт объект как в бекенде (чтоб не было проблем с id)
                const { data} = await axios.post('https://652822c3931d71583df1eda7.mockapi.io/favorites', obj);
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

    return (
        <div className="wrapper clear">
            {cartOpened && <Drawer items={cartItems} onClose={() => setCartOpened(false)} onRemove={onRemoveItem}/>}
            <Header onClickCart={() => setCartOpened(true)}/>

            <Routes>
                <Route path="/"
                       element={<Home items={items}
                                      searchValue={searchValue}
                                      setSearchValue={setSearchValue}
                                      onAddToFavorite={onAddToFavorite}
                                      onAddToCart={onAddToCart}
                                      onChangeSearchInput={onChangeSearchInput}
                       />}
                />
                <Route path="/favorites"
                       element={
                           <Favorites items={favorites}
                                      onAddToFavorite={onAddToFavorite}

                           />
                       }
                />
            </Routes>

        </div>
    );
}

export default App;
