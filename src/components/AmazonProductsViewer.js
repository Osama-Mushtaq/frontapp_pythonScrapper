import React, { useState, useEffect } from 'react';

function ProductList() {
    const [data, setData] = useState([]);
    const [selected, setSelected] = useState('');
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMenu, setIsLoadingMenu] = useState(true);
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        fetch('/data/user_queries.json')
            .then(res => res.json())
            .then(d => {
                setData(d);
                setIsLoadingMenu(false);
            })
            .catch(err => {
                alert('Error loading categories');
                setIsLoadingMenu(false);
            });
    }, []);

    useEffect(() => {
        if (selected === '') return;

        setIsLoading(true);
        fetch('/data/' + selected + '.json')
            .then(res => res.json())
            .then(d => {
                let good_items = d.filter(item => {
                    if (item.title === null && item.price === null) return false;
                    return true;
                });
                setItems(good_items);
                setIsLoading(false);
                setShowMenu(false);
            })
            .catch(err => {
                alert('Error loading products');
                setItems([]);
                setIsLoading(false);
            });
    }, [selected]);

    function selectCategory(cat) {
        setSelected(cat);
    }

    return (
        <div className="container mx-auto px-4 py-2 md:py-4">
            <div className="lg:hidden mb-4">
                <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                    {showMenu ? "Hide Categories" : "Show Categories"}
                </button>
            </div>

            <div className="block lg:grid lg:grid-cols-12 lg:gap-4">
                <div className={`${showMenu ? 'block' : 'hidden'} lg:block lg:col-span-3 mb-4 lg:mb-0`}>
                    <div style={{ background: 'white' }} className="rounded-lg shadow-lg lg:h-screen">
                        <div className="p-4">
                            <h2 className="text-xl font-bold mb-4">Categories</h2>
                            <div className="space-y-2 overflow-y-auto max-h-[60vh] lg:max-h-[calc(100vh-8rem)]">
                                {isLoadingMenu ? (
                                    <div className="flex justify-center items-center h-32">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                    </div>
                                ) : (
                                    data.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => selectCategory(cat)}
                                            className={selected === cat ? 'w-full text-left px-4 py-2 rounded-lg bg-blue-500 text-white capitalize' : 'w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 capitalize'}
                                        >
                                            {cat}
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-9">
                    <div style={{ background: 'white' }} className="rounded-lg shadow-lg min-h-[80vh] lg:h-screen">
                        <div className="p-4">
                            <h2 className="text-xl font-bold mb-4">
                                {selected ? selected + " Products" : "Pick a category"}
                            </h2>
                            <div className="overflow-x-auto">
                                {isLoading ? (
                                    <div className="flex justify-center items-center h-64">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                                    </div>
                                ) : selected ? (
                                    <div className="overflow-y-auto max-h-[60vh] lg:max-h-[calc(100vh-12rem)]">
                                        <div className="hidden md:block"> {/* Desktop Table */}
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50 sticky top-0">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reviews</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scraped</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {items.map((item, i) => (
                                                        <tr key={i} className="hover:bg-gray-50">
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center">
                                                                    {item.image_url && (
                                                                        <img
                                                                            src={item.image_url}
                                                                            alt="product"
                                                                            className="h-10 w-10 rounded-md mr-4"
                                                                        />
                                                                    )}
                                                                    <div className="text-sm text-gray-900">
                                                                        {item.title || 'No title'}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">{item.price || 'N/A'}</td>
                                                            <td className="px-6 py-4">{item.rating || 'N/A'}</td>
                                                            <td className="px-6 py-4">{item.review_count || 'N/A'}</td>
                                                            <td className="px-6 py-4">{item.created_at || 'N/A'}</td>
                                                            <td className="px-6 py-4">{item.scrape_date || 'N/A'}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="md:hidden"> {/* Mobile Cards */}
                                            <div className="space-y-4">
                                                {items.map((item, i) => (
                                                    <div key={i} className="bg-gray-50 p-4 rounded-lg">
                                                        <div className="flex items-center mb-2">
                                                            {item.image_url && (
                                                                <img
                                                                    src={item.image_url}
                                                                    alt="product"
                                                                    className="h-16 w-16 rounded-md mr-4"
                                                                />
                                                            )}
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {item.title || 'No title'}
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                                            <div>
                                                                <span className="font-medium">Price:</span> {item.price || 'N/A'}
                                                            </div>
                                                            <div>
                                                                <span className="font-medium">Rating:</span> {item.rating || 'N/A'}
                                                            </div>
                                                            <div>
                                                                <span className="font-medium">Reviews:</span> {item.review_count || 'N/A'}
                                                            </div>
                                                            <div>
                                                                <span className="font-medium">Created:</span> {item.created_at || 'N/A'}
                                                            </div>
                                                            <div className="col-span-2">
                                                                <span className="font-medium">Scraped:</span> {item.scrape_date || 'N/A'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex justify-center items-center h-64 text-gray-500">
                                        Please pick a category first
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductList;