import Card from "../components/Card";
import React from "react";

function Home({items,searchValue, setSearchValue, onAddToFavorite, onAddToCart, onChangeSearchInput}) {
    return(
        <div className="content p-40">
            <div className="d-flex align-center justify-between mb-40">
                <h1>{searchValue ? `Поиск по запросу: "${searchValue}"` : 'Все кроссовки'}</h1>
                <div className="search-block d-flex">
                    <img src="/img/search.svg" alt="Search"/>
                    <input onChange={onChangeSearchInput} value={searchValue} type="text" placeholder="Поиск"/>
                    {searchValue && <img onClick={() => setSearchValue('')} className="removeBtn clear" src="/img/btn-remove.svg" alt="Clear"/>}
                </div>
            </div>

            <div className="d-flex flex-wrap ">
                {items
                    .filter(item => item.title.toLowerCase().includes(searchValue.toLowerCase()))
                    .map(item =>
                        <Card
                            key={item.title}
                            {...item}
                            onFavorite={(obj) => onAddToFavorite(obj)}
                            onPlus={(obj) => onAddToCart(obj)}
                        />
                    )}
            </div>
        </div>
    )
}

export default Home;