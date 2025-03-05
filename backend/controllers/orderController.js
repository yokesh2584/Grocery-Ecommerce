import asyncHandler from "express-async-handler"
import Order from "../models/orderModel.js"
import Cart from "../models/cartModel.js"

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body

  if (orderItems && orderItems.length === 0) {
    res.status(400)
    throw new Error("No order items")
  } else {
    // Create new order
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    })

    const createdOrder = await order.save()

    // Clear user's cart after successful order
    await Cart.findOneAndUpdate({ user: req.user._id }, { $set: { items: [] } })

    res.status(201).json(createdOrder)
  }
})

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "name email")

  if (order) {
    // Check if the order belongs to the logged in user or if user is admin
    if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      res.status(401)
      throw new Error("Not authorized to view this order")
    }

    res.json(order)
  } else {
    res.status(404)
    throw new Error("Order not found")
  }
})

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    order.isPaid = true
    order.paidAt = Date.now()
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    }

    const updatedOrder = await order.save()

    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error("Order not found")
  }
})

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    order.isDelivered = true
    order.deliveredAt = Date.now()

    const updatedOrder = await order.save()

    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error("Order not found")
  }
})

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
  res.json(orders)
})

// @desc    Get all orders
// @route   GET /api/orders/admin
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("user", "id name").sort({ createdAt: -1 })
  res.json(orders)
})

// @desc    Get dashboard data
// @route   GET /api/orders/admin/dashboard
// @access  Private/Admin
const getDashboardData = asyncHandler(async (req, res) => {
  // Get total sales
  const totalSales = await Order.aggregate([
    { $match: { isPaid: true } },
    { $group: { _id: null, total: { $sum: "$totalPrice" } } },
  ])

  // Get total orders
  const totalOrders = await Order.countDocuments()

  // Get total products
  const totalProducts = await Product.countDocuments()

  // Get total users
  const totalUsers = await User.countDocuments()

  // Get recent orders
  const recentOrders = await Order.find({}).populate("user", "id name").sort({ createdAt: -1 }).limit(10)

  // Get sales by month for the last 6 months
  const date = new Date()
  date.setMonth(date.getMonth() - 5)

  const salesByMonth = await Order.aggregate([
    {
      $match: {
        isPaid: true,
        createdAt: { $gte: date },
      },
    },
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
        },
        total: { $sum: "$totalPrice" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ])

  // Format sales by month data
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const formattedSalesByMonth = salesByMonth.map((item) => ({
    month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
    total: item.total,
  }))

  res.json({
    totalSales: totalSales.length > 0 ? totalSales[0].total : 0,
    totalOrders,
    totalProducts,
    totalUsers,
    recentOrders,
    salesByMonth: formattedSalesByMonth,
  })
})

export {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  getDashboardData,
}

