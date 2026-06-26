import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/use-request";
import Router from "next/router";

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
    const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push("/orders"),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();

    const timeId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timeId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return <div className="fifa-page"><div className="fifa-order-expired text-center">😔 Order Expired</div></div>;
  }

  if (!order) return null;

  return (
    <div className="fifa-page">
      <div className="fifa-order-card mx-auto" style={{ maxWidth: "780px" }}>
      <div className="fifa-order-clock mb-4">
        <div className="fifa-order-meta">ORDER EXPIRES IN</div>
        <div className="fifa-order-timer">{timeLeft}s</div>
      </div>
      <div className="text-center mb-4">
        <h1 className="fifa-title fifa-gradient-text display-5 mb-2">{order.ticket.title}</h1>
        <p className="fifa-order-meta mb-0">Price: ${order.ticket.price.toFixed(2)}</p>
      </div>
      <StripeCheckout
        token={(token) => doRequest({ token: token.id })}
        stripeKey="pk_test_51PfmOHRpeKx0K9LrzlXujnFprI4yrppKf5L16d5f04lYE0NrB911PHutt3qARPLCYSlPabCVZzLaiYBCuxicIVYx00XZQjMSyC"
        amount={order.ticket.price * 100}
        email={currentUser.email}
        className="fifa-stripe-button"
        panelLabel="Pay with Stripe"
        name="GitTix Checkout"
        description="Secure FIFA World Cup 2026 ticket payment"
      />
      {errors}
      </div>
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};

export default OrderShow;
