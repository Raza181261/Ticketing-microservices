import { useState } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";


const NewTicket = () => {
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const { doRequest, errors } = useRequest({
        url: "/api/tickets",
        method: "post",
        body: {
            title,
            price
        },
        onSuccess: () => Router.push("/")
    });



    const onBlur = () => {
        const value = parseFloat(price);
        if (isNaN(value)) {
            return;
        }
        setPrice(value.toFixed(2));
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        await doRequest();
    };


  return (
      <div className="fifa-page">
        <div className="fifa-ticket-card mx-auto" style={{ maxWidth: "720px" }}>
        <h1 className="fifa-title fifa-gradient-text display-4">CREATE NEW TICKET 🎫</h1>
        <form onSubmit={onSubmit}>
          <div className="fifa-form-group">
              <label className="fifa-label">Title</label>
            <input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
                className="form-control fifa-input" 
                placeholder="Match ticket title"
            />
        </div>
          <div className="fifa-form-group">
              <label className="fifa-label">Price</label>
            <input 
              value={price}
              onBlur={onBlur}
              onChange={(e) => setPrice(e.target.value)}
                className="form-control fifa-input" 
                placeholder="0.00"
            />
        </div>
        {errors}
          <button className="btn btn-primary fifa-submit w-100 mt-4">Submit</button>
      </form>
        </div>
    </div>
  )
};

export default NewTicket;   