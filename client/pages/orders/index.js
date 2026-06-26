const OrderIndex = ({ orders }) => {
    return (
        <div className="fifa-page">
            <div className="fifa-section-card rounded-4 p-4 p-md-5">
            <h1 className="fifa-title fifa-gradient-text display-4">MY ORDERS</h1>
            <ul className="fifa-order-list">
                {orders.map((order) => (
                    <li key={order.id}>
                        <div className="d-flex flex-column flex-md-row justify-content-between gap-2">
                          <span>{order.ticket.title}</span>
                          <span>${order.ticket.price.toFixed(2)}</span>
                          <span className="fifa-order-status">{order.status}</span>
                        </div>
                    </li>
                ))}
            </ul>
            </div>
        </div>
    );
};

OrderIndex.getInitialProps = async (context, client, currentUser) => {
    const { data } = await client.get('/api/orders');
    return { orders: data };
}

export default OrderIndex;