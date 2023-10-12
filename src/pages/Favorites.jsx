import Card from "../components/Card";
import React from "react";

function Favorites({items, onAddToFavorite}) {
    return(
        <div className="content p-40">
            <div className="d-flex align-center justify-between mb-40">
                <h1>Мои закладки</h1>

            </div>

            <div className="d-flex flex-wrap ">
                {items
                    .map(item =>
                        <Card
                            {...item}
                            key={item.title}
                            favorited={true}
                            onFavorite={onAddToFavorite}
                        />
                    )}
            </div>
        </div>
    )
}

export default Favorites;