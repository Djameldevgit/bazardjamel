const Stores = require('../models/storeModel')
const Users = require('../models/userModel')

class APIfeatures {
  constructor(query, queryString){
    this.query = query
    this.queryString = queryString
  }

  paginating(){
    const page = this.queryString.page * 1 || 1
    const limit = this.queryString.limit * 1 || 9
    const skip = (page - 1) * limit
    this.query = this.query.skip(skip).limit(limit)
    return this
  }
}

const storeCtrl = {
  // 🏪 Crear tienda
  createStore: async (req, res) => {
    try {
      const { name, description } = req.body

      if(!name) return res.status(400).json({ msg: "Name is required." })

      const newStore = new Stores({
        name,
        description,
        owner: req.user._id
      })
      await newStore.save()

      res.json({
        msg: 'Store created!',
        newStore: { ...newStore._doc, owner: req.user }
      })
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },

  // 📦 Obtener todas las tiendas del usuario autenticado
  getStores: async (req, res) => {
    try {
      const features = new APIfeatures(
        Stores.find({ owner: req.user._id }),
        req.query
      ).paginating()

      const stores = await features.query
        .sort('-createdAt')
        .populate('owner', 'avatar username')

      res.json({ msg: 'Success!', result: stores.length, stores })
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },

  // 🔍 Obtener una tienda específica
 // GET store by ID (público)
 getStore: async (req, res) => {
  try {
    const store = await Stores.findById(req.params.id)
      .populate("owner", "username avatar")  // info del dueño
      .populate({
        path: "products",
        model: "post",                    // tus productos son posts
        populate: { 
          path: "user likes comments",
          select: "-password" 
        }
      })

    if (!store) 
      return res.status(400).json({ msg: "This store does not exist." })

    res.json({ store })

  } catch (err) {
    return res.status(500).json({ msg: err.message })
  }
},


  // ✏️ Actualizar una tienda
  updateStore: async (req, res) => {
    try {
      const { name, description } = req.body

      const store = await Stores.findOneAndUpdate(
        { _id: req.params.id, owner: req.user._id },
        { name, description },
        { new: true }
      ).populate('owner', 'avatar username fullname')

      if(!store)
        return res.status(400).json({ msg: "Store not found or not yours." })

      res.json({
        msg: 'Store updated!',
        newStore: store
      })
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },

  // 🗑️ Eliminar una tienda
  deleteStore: async (req, res) => {
    try {
      const store = await Stores.findOneAndDelete({
        _id: req.params.id,
        owner: req.user._id
      })

      if(!store)
        return res.status(400).json({ msg: 'Store not found or not yours.' })

      res.json({
        msg: 'Store deleted!',
        store
      })
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },

  // 🌍 Obtener tiendas de otros usuarios (descubrir)
  discoverStores: async (req, res) => {
    try {
      const num = req.query.num || 9

      const stores = await Stores.aggregate([
        { $match: { owner: { $ne: req.user._id } } },
        { $sample: { size: Number(num) } }
      ])

      res.json({
        msg: 'Success!',
        result: stores.length,
        stores
      })
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  }
}

module.exports = storeCtrl
