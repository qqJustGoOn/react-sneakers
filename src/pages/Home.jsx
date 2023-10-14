import React from "react";
import Card from "../components/Card";

function Home({
                  items,
                  searchValue,
                  setSearchValue,
                  onAddToFavorite,
                  onAddToCart,
                  onChangeSearchInput,
                  isLoading
              }) {
    const renderItems = () => {
        const filteredItems = items.filter(item => item.title.toLowerCase().includes(searchValue.toLowerCase()));

        return (isLoading ? [...Array(11)] : filteredItems)
            .map((item, i) =>
                <Card
                    {...item}
                    key={i}
                    onFavorite={(obj) => onAddToFavorite(obj)}
                    onPlus={(obj) => onAddToCart(obj)}
                    loading={isLoading}
                />
            )
    }

    return (
        <div className="content p-40">
            <div className="d-flex align-center justify-between mb-40">
                <h1>{searchValue ? `Поиск по запросу: "${searchValue}"` : 'Все кроссовки'}</h1>
                <div className="search-block d-flex">
                    <img src="/img/search.svg" alt="Search"/>
                    <input onChange={onChangeSearchInput} value={searchValue} type="text" placeholder="Поиск"/>
                    {searchValue &&
                        <img onClick={() => setSearchValue('')} className="removeBtn clear" src="/img/btn-remove.svg"
                             alt="Clear"/>}
                </div>
            </div>

            <div className="d-flex flex-wrap ">
                {renderItems()}
            </div>
        </div>
    )
}

export default Home;