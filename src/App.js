import React from "react";
import {Routes, Route} from "react-router-dom";
import axios from "axios";
import Header from "./components/Header";
import Drawer from "./components/Drawer";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import AppContext from "./context";

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
            const cartResponse = await axios.get('https://64ccbaab2eafdcdc851a33d0.mockapi.io/cart');
            const favoritesResponse = await axios.get('https://652822c3931d71583df1eda7.mockapi.io/favorites');
            const itemsResponse = await axios.get('https://64ccbaab2eafdcdc851a33d0.mockapi.io/items');

            setIsLoading(false);
            setCartItems(cartResponse.data);
            setFavorites(favoritesResponse.data);
            setItems(itemsResponse.data);
        }

        fetchData();
    }, []);

    const onAddToCart = (obj) => {
        try {
            if (cartItems.find(item => Number(item.id) === Number(obj.id))) {
                axios.delete(`https://64ccbaab2eafdcdc851a33d0.mockapi.io/cart/${obj.id}`);
                setCartItems(prev => prev.filter(prevItem => Number(prevItem.id) !== Number(obj.id)))
            } else {
                axios.post('https://64ccbaab2eafdcdc851a33d0.mockapi.io/cart', obj);
                // .then(res => setCartItems(prev => [...prev, res.data]));
                setCartItems(prev => [...prev, obj]);
            }
        } catch (error) {
            console.log(error)
        }

    }
    const onRemoveItem = (id) => {
        axios.delete(`https://64ccbaab2eafdcdc851a33d0.mockapi.io/cart/${id}`);
        setCartItems(prev => prev.filter(item => item.id !== id));
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
       <AppContext.Provider value={{items, cartItems, favorites, isItemAdded, onAddToFavorite, setCartItems, setCartOpened}}>
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
                                         isLoading={isLoading}
                          />}
                   />
                   <Route path="/favorites"
                          element={
                              <Favorites />
                          }
                   />
               </Routes>

           </div>
       </AppContext.Provider>
    );
}

export default App;
