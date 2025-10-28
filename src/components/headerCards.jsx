import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";

const HeaderCard = ({
  products,
  activeCart,
  updateQuantity,
  removeFromCart,
}) => {
  // header card start

  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const handleDelete = (id, selectedSize) => {
    removeFromCart(id, selectedSize);
  };

  return (
    <>
      <div className={activeCart ? "header__card active" : "header__card"}>
        <div className="header__cart__heading">
          <h5>Shopping Cart</h5>
          <hr />
        </div>

        <div className="header__cart__body">
          {products.length === 0 ? (
            <p className="text-center">No items in the cart</p>
          ) : (
            products.map((item, index) => (
              <div
                className="header__cart__body__item position-relative"
                key={index}
              >
              <img src={item.image} alt={item.name} />
              <div className="header__cart__body__item__info">
                <p>
                  <small>
                    <span>
                      {item.name.length > 15
                        ? item.name.slice(0, 15) + "..."
                        : item.name}
                    </span> <span className="text-primary">{item.selectedSize}</span>
                  </small>
                </p>
                <p>
                  <small>
                    <span>৳ {item.price}</span>
                    
                  </small>
                </p>

                <div className="header__cart__body__item__action">
                  <span
                    className="qty-btn"
                    onClick={() => {
                      if (item.quantity > 1) {
                        updateQuantity(
                          item.id,
                          item.selectedSize,
                          item.quantity - 1
                        );
                      }
                    }}
                  >
                    -
                  </span>
                  <span className="qty-value">{item.quantity}</span>
                  <span
                    className="qty-btn"
                    onClick={() => {
                      updateQuantity(
                        item.id,
                        item.selectedSize,
                        item.quantity + 1
                      );
                    }}
                  >
                    +
                  </span>
                </div>

                <p className="subtotal">
                  {" "}
                  <small>Total: ৳ {item.price * (item.quantity || 1)}</small>
                </p>
              </div>
              <button
                className="text-danger cursor-pointer border-0 outline-none bg-transparent fs-4 position-absolute bottom-0 end-0"
                onClick={() => handleDelete(item.id, item.selectedSize)}
              >
                <MdDelete />
              </button>
            </div>
          )))}
        </div>

        <div className="header__cart__footer">
          <h6 className="cart-total">
            <span>Total:</span>
            <span className="total-amount">
              ৳{" "}
              {products
                .reduce(
                  (acc, item) => acc + item.price * (item.quantity || 1),
                  0
                )
                .toFixed(2)}
            </span>
          </h6>
          {products.length === 0 ? (
           <button onClick={() => navigate("/shop")} className="checkout__btn mt-2">
              Go To Shop
            </button>
          ) : (
            <button onClick={handleCheckout} className="checkout__btn mt-2">
              Checkout
            </button>
          )}
        </div>
      </div>
    </>
  );
};
export default HeaderCard;
