import React, { useState, useRef, useEffect } from "react";
import shimano from "./assets/shimano.jpg";
import "./App.css";

export default function App() {
  const [paidFor, setPaidFor] = useState(false);
  const [loaded, setLoaded] = useState(false);

  let paypalRef = useRef();

  const product = {
    price: 89.99,
    description: "graphite Shimano fishing rod",
    img: "assets/shimano.jpg"
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://www.paypal.com/sdk/js?client-id=AfDCVWJTflAAMVnxvFB4IN-vmEL1BaNRe5VRQjmyqcvj0OXP_cXOLsUBAvWX1teTDzRacGJmdExgILLp";
    script.addEventListener("load", () => setLoaded(true));
    document.body.appendChild(script);

    if (loaded) {
      setTimeout(() => {
        window.paypal
          .Buttons({
            createOrder: (data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    description: product.description,
                    amount: {
                      currency_code: "USD",
                      value: product.price
                    }
                  }
                ]
              });
            },
            onApprove: async (data, actions) => {
              const order = await actions.order.capture();
              setPaidFor(true);
              console.log(order);
            }
          })
          .render(paypalRef);
      });
    }
  });

  return (
    <div className="app">
      <div>
        <h1>Navin's Store</h1>
      </div>
      <div>
        {paidFor ? (
          <div>
            <h1 id="store-title">You just bought the fishing rod!</h1>
          </div>
        ) : (
          <div>
            <h2>
              {product.description} for ${product.price}
            </h2>
            <img src={shimano} width="200" />
            <div ref={v => (paypalRef = v)} />
          </div>
        )}
      </div>
    </div>
  );
}
