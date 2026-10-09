import pool from '../conf/dbConnection';

const isValidId = (id: any): any => /^[1-9]\d*$/.test(String(id));

const isValidPrice = (price: any): any =>
  typeof price === 'number' && Number.isFinite(price) && price > 0;

const serverError = (res: any): any =>
  res.status(500).json({ ok: false, message: 'Error interno del servidor' });

export const getAll = async (req: any, res: any): Promise<any> => {
  try {
    const [rows]: any = await pool.query(
      'SELECT * FROM products WHERE active = ?',
      [true]
    );
    return res.status(200).json({ ok: true, data: rows });
  } catch (error: any) {
    return serverError(res);
  }
};

export const getById = async (req: any, res: any): Promise<any> => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ ok: false, message: 'El id debe ser un entero positivo' });
    }
    const [rows]: any = await pool.query(
      'SELECT * FROM products WHERE id = ? AND active = ?',
      [Number(id), true]
    );
    if (rows.length === 0) {
      return res.status(404).json({ ok: false, message: 'Producto no encontrado' });
    }
    return res.status(200).json({ ok: true, data: rows[0] });
  } catch (error: any) {
    return serverError(res);
  }
};

export const create = async (req: any, res: any): Promise<any> => {
  try {
    const { name, price, stock, description, brand, img } = req.body;
    if (!name || !description || !Number.isInteger(stock) || stock < 0) {
      return res.status(400).json({
        ok: false,
        message: 'name, description y stock (entero) son obligatorios',
      });
    }
    if (!isValidPrice(price)) {
      return res.status(400).json({ ok: false, message: 'price debe ser numérico y mayor que cero' });
    }
    const [result]: any = await pool.query(
      'INSERT INTO products (name, price, stock, description, brand, img) VALUES (?, ?, ?, ?, ?, ?)',
      [name, price, stock, description, brand ?? null, img ?? null]
    );
    return res.status(201).json({
      ok: true,
      message: 'Producto creado',
      data: { id: result.insertId, name, price, stock, description, brand, img },
    });
  } catch (error: any) {
    return serverError(res);
  }
};

export const update = async (req: any, res: any): Promise<any> => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ ok: false, message: 'El id debe ser un entero positivo' });
    }
    const { name, price, stock, description, brand, img } = req.body;
    if (!name || !description || !Number.isInteger(stock) || stock < 0) {
      return res.status(400).json({
        ok: false,
        message: 'name, description y stock (entero) son obligatorios',
      });
    }
    if (!isValidPrice(price)) {
      return res.status(400).json({ ok: false, message: 'price debe ser numérico y mayor que cero' });
    }
    const [result]: any = await pool.query(
      'UPDATE products SET name = ?, price = ?, stock = ?, description = ?, brand = ?, img = ? WHERE id = ? AND active = ?',
      [name, price, stock, description, brand ?? null, img ?? null, Number(id), true]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, message: 'Producto no encontrado' });
    }
    return res.status(200).json({ ok: true, message: 'Producto actualizado' });
  } catch (error: any) {
    return serverError(res);
  }
};

export const remove = async (req: any, res: any): Promise<any> => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ ok: false, message: 'El id debe ser un entero positivo' });
    }
    const [result]: any = await pool.query(
      'UPDATE products SET active = ? WHERE id = ? AND active = ?',
      [false, Number(id), true]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, message: 'Producto no encontrado' });
    }
    return res.status(200).json({ ok: true, message: 'Producto dado de baja' });
  } catch (error: any) {
    return serverError(res);
  }
};

export const changePrice = async (req: any, res: any): Promise<any> => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ ok: false, message: 'El id debe ser un entero positivo' });
    }
    const keys: any = Object.keys(req.body || {});
    if (keys.length !== 1 || keys[0] !== 'price') {
      return res.status(400).json({ ok: false, message: 'El cuerpo debe contener solamente price' });
    }
    const { price } = req.body;
    if (!isValidPrice(price)) {
      return res.status(400).json({ ok: false, message: 'price debe ser numérico y mayor que cero' });
    }
    const [result]: any = await pool.query(
      'UPDATE products SET price = ? WHERE id = ? AND active = ?',
      [price, Number(id), true]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, message: 'Producto no encontrado' });
    }
    return res.status(200).json({ ok: true, message: 'Precio actualizado' });
  } catch (error: any) {
    return serverError(res);
  }
};