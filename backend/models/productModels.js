const db = require("../utils/db");
const { v4: uuidv4 } = require("uuid");

const Product = {
  getAll: (cb) => {
    db.query("SELECT * FROM products ORDER BY created_at DESC", cb);
  },

  getById: (id, cb) => {
    db.query("SELECT * FROM products WHERE id = ?", [id], cb);
  },

  create: (data, cb) => {
  try {
    const id = uuidv4();
    const { name, price, off, size, image } = data;

    // Required field check
    if (!name || !price || !image) {
      return cb(new Error("Missing required fields (name, price, or image)"));
    }

    const offValue = off && !isNaN(off) ? Number(off) : 0;

    // ✅ Handle size properly: if string, parse it
    const sizeArray = size
      ? (typeof size === "string" ? JSON.parse(size) : size)
      : [];
    const sizeValue = JSON.stringify(sizeArray);

    const sql =
      "INSERT INTO products (id, name, price, off, size, image) VALUES (?, ?, ?, ?, ?, ?)";

    db.query(
      sql,
      [id, name, price, offValue, sizeValue, image],
      (err, result) => {
        if (err) return cb(err);

        cb(null, {
          id,
          name,
          price,
          off: offValue,
          size: sizeArray,
          image,
        });
      }
    );
  } catch (error) {
    cb(error);
  }
},


  update: (id, data, cb) => {
    const { name, price, off = 0, size = [], image } = data;
    db.query(
      "UPDATE products SET name = ?, price = ?, off = ?, size = ?, image = ? WHERE id = ?",
      [name, price, off, JSON.stringify(size), image, id],
      (err, result) => {
        if (err) return cb(err);
        cb(null, result);
      }
    );
  },
delete: (id, cb) => {
  const sql1 = "DELETE FROM order_items WHERE product_id = ?";
  const sql2 = "DELETE FROM products WHERE id = ?";

  db.query(sql1, [id], (err) => {
    if (err) return cb(err);
    db.query(sql2, [id], cb);
  });
},

};

module.exports = Product;

